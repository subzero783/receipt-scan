import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSessionUser } from '@/utils/getSessionUser';

const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY,
});

export const POST = async (request) => {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser) return new NextResponse('Unauthorized', { status: 401 });

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

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a helpful financial analyst bot." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            max_tokens: 200,
        });

        const insights = JSON.parse(response.choices[0].message.content);

        return NextResponse.json(insights);

    } catch (error) {
        console.error('AI Insight Error:', error);
        return new NextResponse('Error generating insights', { status: 500 });
    }
};