import archiver from 'archiver';
import { PassThrough } from 'stream';

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
                const response = await fetch(receipt.imageUrl);
                if (!response.ok) throw new Error(`Failed to fetch ${receipt.imageUrl}`);

                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const filename = `${receipt.merchantName.replace(/[^a-z0-9]/gi, '_')}_${receipt.transactionDate ? new Date(receipt.transactionDate).toISOString().split('T')[0] : 'date'}_${receipt._id}.jpg`;

                archive.append(buffer, { name: filename });
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
