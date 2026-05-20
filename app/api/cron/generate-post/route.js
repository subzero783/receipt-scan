import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from '@/config/database';
import BlogPost from '@/models/BlogPost';
import KeywordQueue from '@/models/KeywordQueue';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const GET = async (request) => {
    // 1. Security: Prevent random people from triggering your bot
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        await connectDB();

        // 2. Find the next unprocessed keyword
        const nextKeywordObj = await KeywordQueue.findOne({ isProcessed: false });
        if (!nextKeywordObj) {
            return NextResponse.json({ message: 'No keywords left in queue.' });
        }

        const targetKeyword = nextKeywordObj.keyword;

        // 3. Prompt the AI Agent
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = `
            You are an expert SEO content writer for a SaaS platform called Receipt Scan, which helps freelancers track expenses.
            Write a comprehensive, engaging, and SEO-optimized blog post targeting the keyword: "${targetKeyword}".
            
            Return the result strictly as a JSON object with the following keys:
            - "title": A catchy, SEO-friendly title.
            - "excerpt": A 2-sentence meta description.
            - "slug": A URL-friendly slug based on the title.
            - "content": The full blog post written in clean HTML (use <h2>, <h3>, <p>, <ul>, <li>). Do not include <html> or <body> tags, just the inner content.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean the response (Gemini sometimes wraps JSON in markdown blocks)
        const jsonString = responseText.replace(/```json\n?|```/g, '').trim();
        const generatedData = JSON.parse(jsonString);

        // 4. Save directly to your existing Blog Database
        const newPost = new BlogPost({
            title: generatedData.title,
            categories: [],
            excerpt: generatedData.excerpt,
            author: {
                name: "Gustavo",
                email: process.env.CONTACT_EMAIL,
                role: "Developer",
                bio: "Gustavo Amezcua is a full-stack web developer and SaaS founder with a comprehensive background in frontend architecture, UX/UI design, and backend development. Holding a Bachelor's Degree in International Business from CETYS University, he has built a diverse technical career developing responsive applications, optimizing high-traffic e-commerce platforms, and integrating complex APIs. Fully bilingual in English and Spanish, Gustavo consistently merges technical execution with a sharp focus on user experience and accessibility."
            },
            featured_image: "",
            is_featured: false,
            status: "Draft",
            content: generatedData.content,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newPost.save();

        // 5. Mark keyword as processed
        nextKeywordObj.isProcessed = true;
        await nextKeywordObj.save();

        return NextResponse.json({
            success: true,
            message: `Successfully generated post for: ${targetKeyword}`
        });

    } catch (error) {
        console.error('Agent Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};