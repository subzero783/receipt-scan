import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Receipt from '@/models/Receipt';
import { getSessionUser } from '@/utils/getSessionUser';
import archiver from 'archiver';
import { PassThrough } from 'stream';

export const POST = async (request) => {
    try {
        await connectDB();
        const sessionUser = await getSessionUser();
        if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

        const { ids, type = 'zip' } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return new NextResponse('No receipts selected', { status: 400 });
        }

        // Fetch receipts
        const receipts = await Receipt.find({
            _id: { $in: ids },
            user: sessionUser.userId
        });

        if (receipts.length === 0) {
            return new NextResponse('No receipts found', { status: 404 });
        }

        if (type === 'csv') {
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

            const csvString = csvRows.map(row => row.join(',')).join('\n');

            return new NextResponse(csvString, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename="receipts.csv"'
                }
            });
        }

        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        const stream = new PassThrough();

        // Error handling for archive
        archive.on('error', (err) => {
            console.error('Archiver Error:', err);
            // It's hard to send an error response if streaming started, but we log it.
        });

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
                    // Optionally append a text file with error?
                }
            }
        });

        // Wait for all fetches and appends to queue
        await Promise.all(appendPromises);

        // Finalize the archive (closes the stream)
        archive.finalize();

        // Return the stream
        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="receipts.zip"'
            }
        });

    } catch (error) {
        console.error('Export Error:', error);
        return new NextResponse('Server Error', { status: 500 });
    }
};
