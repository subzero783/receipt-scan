import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { getSessionUser } from '@/utils/getSessionUser';
import connectDB from '@/config/database';
import User from '@/models/User';
import { isTrialExpired } from '@/utils/userStatus';

// Configure Gemini API
const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_GEMINI_API_KEY,
});

export const POST = async (request) => {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

        await connectDB();
        const user = await User.findById(sessionUser.userId);
        if (!user) return new NextResponse('User not found', { status: 404 });

        if (isTrialExpired(user)) {
            return new NextResponse(JSON.stringify({ message: 'Trial expired. Please upgrade to Pro to continue generating AI insights.' }), { status: 403 });
        }

        const { receipts } = await request.json();

        if (!receipts || receipts.length === 0) {
            return NextResponse.json({ message: "Not enough data for insights." });
        }

        // Simplify data to save tokens (remove images, IDs, timestamps)
        const simplifiedData = receipts.map(r => ({
            merchant: r.merchantName,
            amount: r.totalAmount,
            date: r.transactionDate ? r.transactionDate.split('T')[0] : 'N/A',
            category: r.category
        }));

        const prompt = `
      Analyze the following expense data for a freelancer/business owner:
      ${JSON.stringify(simplifiedData)}

      Provide a JSON response with the following 3 keys:
      1. "summary": A 1-sentence summary of spending behavior (e.g., "Heavy spending on travel this month").
      2. "anomaly": Identify 1 specific transaction or category that looks unusually high or odd (or say "No anomalies detected").
      3. "tip": A quick 1-sentence tip on how to save money or a tax deduction opportunity based on these specific categories.

      Return ONLY valid JSON.
    `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        });

        const insights = JSON.parse(response.text);

        return NextResponse.json(insights);

    } catch (error) {
        console.error('AI Insight Error:', error);
        return new NextResponse('Error generating insights', { status: 500 });
    }
};