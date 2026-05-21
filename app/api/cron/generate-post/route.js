import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import connectDB from '@/config/database';
import BlogPost from '@/models/BlogPost';
import KeywordQueue from '@/models/KeywordQueue';
import User from '@/models/User';
import { slugify } from '@/utils/slugify';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_GEMINI_API_KEY });

export const GET = async (request) => {
    // 1. Security: Prevent random people from triggering your bot
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        await connectDB();

        // Check daily limit: Only allow 5 blog posts generated per day
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const generatedTodayCount = await BlogPost.countDocuments({
            'author.role': 'Developer',
            createdAt: { $gte: startOfToday }
        });

        if (generatedTodayCount >= 5) {
            return NextResponse.json({
                success: false,
                message: 'Daily generation limit reached. Only 5 blog posts can be generated per day.'
            }, { status: 429 });
        }

        // 2. Find the next unprocessed keyword
        const nextKeywordObj = await KeywordQueue.findOne({ isProcessed: false });
        if (!nextKeywordObj) {
            return NextResponse.json({ message: 'No keywords left in queue.' });
        }

        const targetKeyword = nextKeywordObj.keyword;

        // 3. Prompt the AI Agent
        const result = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `
            You are an expert SEO content writer for a SaaS platform called Receipt Scan, which helps freelancers track expenses.
            Write a comprehensive, engaging, and SEO-optimized blog post targeting the keyword: "${targetKeyword}".
            
            Return the result strictly as a JSON object with the following keys:
            - "title": A catchy, SEO-friendly title.
            - "excerpt": A 2-sentence meta description.
            - "image_prompt": A prompt that can be used on Google Flow, not here, to make an image for the blog post. Please use 'Realistic style' for the image.
            - "slug": A URL-friendly slug based on the title.
            - "content": The full blog post written in clean HTML (use <h2>, <h3>, <p>, <ul>, <li>). Do not include <html> or <body> tags, just the inner content.
        `
                        }
                    ],
                },
            ],
        })

        const responseText = result.text;

        // Clean the response (Gemini sometimes wraps JSON in markdown blocks)
        const jsonString = responseText.replace(/```json\n?|```/g, '').trim();
        const generatedData = JSON.parse(jsonString);

        // Find the owner/admin user to assign the post to
        const ownerUser = await User.findOne({ email: 'contact@receiptscan.org' }) || await User.findOne({ role: 'admin' }) || await User.findOne({});

        if (!ownerUser) {
            return NextResponse.json({ success: false, error: 'No user found in database to assign as owner of the post.' }, { status: 400 });
        }

        // Generate unique slug
        let baseSlug = generatedData.slug || slugify(generatedData.title);
        let slug = baseSlug;
        let counter = 1;
        while (await BlogPost.findOne({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        // Save directly to your existing Blog Database
        const newPost = new BlogPost({
            owner: ownerUser._id,
            title: generatedData.title,
            slug,
            categories: [],
            excerpt: generatedData.excerpt,
            author: {
                name: "Gustavo",
                email: process.env.CONTACT_EMAIL || "contact@receiptscan.org",
                role: "Developer",
                bio: "Gustavo Amezcua is a full-stack web developer and SaaS founder with a comprehensive background in frontend architecture, UX/UI design, and backend development. Holding a Bachelor's Degree in International Business from CETYS University, he has built a diverse technical career developing responsive applications, optimizing high-traffic e-commerce platforms, and integrating complex APIs. Fully bilingual in English and Spanish, Gustavo consistently merges technical execution with a sharp focus on user experience and accessibility."
            },
            featured_image: "",
            is_featured: false,
            status: "Draft",
            image_prompt: generatedData.image_prompt,
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