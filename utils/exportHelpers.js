import archiver from 'archiver';
import { PassThrough } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import { decryptBuffer } from './encryption.js';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getExtensionFromBuffer = (buffer) => {
    if (!buffer || buffer.length < 4) return 'jpg';
    // PNG magic bytes
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        return 'png';
    }
    // JPEG/JPG magic bytes
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
        return 'jpg';
    }
    // PDF magic bytes
    if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
        return 'pdf';
    }
    // GIF magic bytes
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
        return 'gif';
    }
    return 'jpg';
};

export const generateCsv = (receipts) => {
    const csvRows = [
        ['Date', 'Merchant', 'Category', 'Total']
    ];

    receipts.forEach(receipt => {
        csvRows.push([
            receipt.transactionDate ? new Date(receipt.transactionDate).toISOString().split('T')[0] : '',
            `"${(receipt.merchantName || '').replace(/"/g, '""')}"`,
            `"${(receipt.category || '').replace(/"/g, '""')}"`,
            receipt.totalAmount || 0
        ]);
    });

    return csvRows.map(row => row.join(',')).join('\n');
};

export const generateZip = async (receipts) => {
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    const stream = new PassThrough();

    // Pipe archive to the pass-through stream
    archive.pipe(stream);

    // Process files concurrently
    const appendPromises = receipts.map(async (receipt) => {
        if (receipt.imageUrl) {
            try {
                let fetchUrl = receipt.imageUrl;
                if (receipt.publicId) {
                    fetchUrl = cloudinary.url(receipt.publicId, {
                        resource_type: 'raw',
                        type: 'authenticated',
                        sign_url: true,
                        secure: true,
                    });
                }

                const response = await fetch(fetchUrl);
                if (!response.ok) throw new Error(`Failed to fetch ${fetchUrl}`);

                const arrayBuffer = await response.arrayBuffer();
                const encryptedBuffer = Buffer.from(arrayBuffer);

                // Decrypt buffer (Zero-Knowledge)
                let decryptedBuffer;
                try {
                    decryptedBuffer = decryptBuffer(encryptedBuffer);
                } catch (decryptionError) {
                    console.warn(`Failed to decrypt receipt ${receipt._id}, using raw buffer`, decryptionError);
                    decryptedBuffer = encryptedBuffer;
                }

                const ext = getExtensionFromBuffer(decryptedBuffer);
                const filename = `${receipt.merchantName.replace(/[^a-z0-9]/gi, '_')}_${receipt.transactionDate ? new Date(receipt.transactionDate).toISOString().split('T')[0] : 'date'}_${receipt._id}.${ext}`;

                archive.append(decryptedBuffer, { name: filename });
            } catch (err) {
                console.error(`Failed to append image for receipt ${receipt._id}`, err);
            }
        }
    });

    // Wait for all fetches and appends to queue
    await Promise.all(appendPromises);

    // Finalize the archive (closes the stream)
    archive.finalize();

    return stream;
};
