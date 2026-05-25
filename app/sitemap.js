import connectDB from "@/config/database";
import BlogPost from "@/models/BlogPost";

export default async function sitemap() {
    const baseUrl = 'https://www.receiptscan.org';

    // Fetch dynamic blog posts
    let blogPosts = [];
    try {
        await connectDB();
        blogPosts = await BlogPost.find({ status: 'Published' }).select('slug updatedAt').lean();
    } catch (error) {
        console.error('Error fetching blog posts for sitemap:', error);
    }

    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0, // Highest priority for the homepage
        },
        {
            url: `${baseUrl}/features`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7, // Good to crawl often for new posts
        },
        {
            url: `${baseUrl}/lp/photographers`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    const dynamicRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug || post._id}`,
        lastModified: post.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    return [...staticRoutes, ...dynamicRoutes];
}