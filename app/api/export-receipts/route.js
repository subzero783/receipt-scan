import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Receipt from '@/models/Receipt';
import { getSessionUser } from '@/utils/getSessionUser';
import { generateCsv, generateZip } from '@/utils/exportHelpers';

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
            const csvString = generateCsv(receipts);

            return new NextResponse(csvString, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename="receipts.csv"'
                }
            });
        }

        const stream = await generateZip(receipts);

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
