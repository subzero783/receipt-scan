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
        <div className="create-post-page">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>Create New Blog Post</h1>

                        {error && <p className="error-message">{error}</p>}

                        <form onSubmit={handleSubmit} className="create-post-form">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., New Features Added to Receipt Scan"
                                />
                            </div>

                            <div className="form-group">
                                <label>Excerpt / Summary</label>
                                <input
                                    type="text"
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    required
                                    placeholder="A short sentence describing the post..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Featured Image</label>
                                <input
                                    type="file"
                                    name="featured_image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {imageFile && <p className="form-text">Selected: {imageFile.name}</p>}
                            </div>

                            <div className="form-group checkbox-group">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                />
                                <label htmlFor="is_featured">Featured</label>
                            </div>

                            <div className="form-group">
                                <label>Content</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                    rows="12"
                                    placeholder="Write your blog post content here. (Supports HTML if your frontend renders it)"
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Categories</label>
                                <input
                                    type="text"
                                    name="categories"
                                    value={formData.categories.join(", ")}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        categories: e.target.value.split(",").map(cat => cat.trim())
                                    })}
                                    placeholder="e.g., Updates, Engineering, News"
                                />
                                <p className="form-text">Separate categories with commas (e.g., Updates, Engineering)</p>
                            </div>

                            <div className="form-group">
                                <label>Author Name</label>
                                <input
                                    type="text"
                                    name="author.name"
                                    value={formData.author.name}
                                    onChange={handleChange}
                                    placeholder="Author Name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Author Email</label>
                                <input
                                    type="email"
                                    name="author.email"
                                    value={formData.author.email}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                />
                            </div>

                            <div className="form-group">
                                <label>Author Role</label>
                                <input
                                    type="text"
                                    name="author.role"
                                    value={formData.author.role}
                                    onChange={handleChange}
                                    placeholder="Author Role"
                                />
                            </div>

                            <div className="form-group">
                                <label>Author Bio</label>
                                <input
                                    type="text"
                                    name="author.bio"
                                    value={formData.author.bio}
                                    onChange={handleChange}
                                    placeholder="Author Bio"
                                />
                            </div>

                            <div className="form-group">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary submit-btn"
                                >
                                    {loading ? "Publishing..." : "Publish Post"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}