// app/admin/create-post/page.jsx
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CreateBlogPost() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        categories: [],
        content: "",
        is_featured: false,
        author: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            role: session?.user?.role || "",
            bio: session?.user?.bio || ""
        }
    });

    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // UI State: Loading session
    if (status === "loading") {
        return <p className="text-center mt-20 text-gray-500">Checking authorization...</p>;
    }

    // Security Check: Only display form if user is logged in AND is the admin
    const isAdmin = session?.user?.email === "contact@receiptscan.org" || session?.user?.role === "admin";

    if (!isAdmin) {
        return (
            <div className="">
                <h1 className="">Access Denied</h1>
                <p className="">Only administrators can view this page.</p>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle nested author fields
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
            return;
        }

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {

            let imageUrl = "";

            // 1. If an image is selected, upload it first
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append("file", imageFile); // 'file' or 'image' depending on your upload-image API

                const uploadRes = await fetch("/api/upload-blog-image", {
                    method: "POST",
                    body: imageFormData,
                });

                if (!uploadRes.ok) throw new Error("Image upload failed");

                const uploadData = await uploadRes.json();
                // Adjust this depending on what your upload API returns (e.g., uploadData.url, uploadData.secure_url)
                imageUrl = uploadData.secure_url || "";
            }

            // 2. Attach the image URL to the rest of the blog post data
            const postData = {
                ...formData,
                featured_image: imageUrl,
            };

            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            });

            if (res.ok) {
                router.push("/blog"); // Redirect to the blog index on success
            } else {
                const errorText = await res.text();
                setError(errorText || "Failed to publish post.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <h1 className="">Create New Blog Post</h1>

            {error && <p className="">{error}</p>}

            <form onSubmit={handleSubmit} className="">
                <div>
                    <label className="">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className=""
                        placeholder="e.g., New Features Added to Receipt Scan"
                    />
                </div>

                <div>
                    <label className="">Excerpt / Summary</label>
                    <input
                        type="text"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        required
                        className=""
                        placeholder="A short sentence describing the post..."
                    />
                </div>

                <div>
                    <label className="">Featured Image</label>
                    <input
                        type="file"
                        name="featured_image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className=""
                    />
                    {imageFile && <p>Selected: {imageFile.name}</p>}
                </div>

                <div>
                    <label className="">Featured</label>
                    <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className=""
                    />
                </div>

                <div>
                    <label className="">Content</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows="12"
                        className=""
                        placeholder="Write your blog post content here. (Supports HTML if your frontend renders it)"
                    ></textarea>
                </div>

                <div>
                    <label className="">Categories</label>
                    <input
                        type="text"
                        name="categories"
                        value={formData.categories.join(", ")}
                        onChange={(e) => setFormData({
                            ...formData,
                            categories: e.target.value.split(",").map(cat => cat.trim())
                        })}
                        className=""
                        placeholder="e.g., Updates, Engineering, News"
                    />
                    <p className="">Separate categories with commas (e.g., Updates, Engineering)</p>
                </div>

                {/* Edit the following as the author property should be an object of name and email */}
                {/* Update the Author Name and Author Email to an Author Object with name and email */}
                <div>
                    <label className="">Author Name</label>
                    <input
                        type="text"
                        name="author.name"
                        value={formData.author.name}
                        onChange={handleChange}
                        className=""
                        placeholder="Author Name"
                    />
                </div>
                <div>
                    <label className="">Author Email</label>
                    <input
                        type="email"
                        name="author.email"
                        value={formData.author.email}
                        onChange={handleChange}
                        className=""
                        placeholder="Email Address"
                    />
                </div>

                <div>
                    <label className="">Author Role</label>
                    <input
                        type="text"
                        name="author.role"
                        value={formData.author.role}
                        onChange={handleChange}
                        className=""
                        placeholder="Author Role"
                    />
                </div>

                <div>
                    <label className="">Author Bio</label>
                    <input
                        type="text"
                        name="author.bio"
                        value={formData.author.bio}
                        onChange={handleChange}
                        className=""
                        placeholder="Author Bio"
                    />
                </div>

                <div className="">
                    <button
                        type="submit"
                        disabled={loading}
                        className=""
                    >
                        {loading ? "Publishing..." : "Publish Post"}
                    </button>
                </div>
            </form>
        </div>
    );
}