// app/admin/create-post/page.jsx
"use client";
import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function CreateBlogPostForm() {
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit") || searchParams.get("id");

    console.log(editId, searchParams, '--------');

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        categories: [],
        content: "",
        is_featured: false,
        status: "Draft",
        author: {
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            role: session?.user?.role || "",
            bio: session?.user?.bio || ""
        }
    });

    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingPost, setLoadingPost] = useState(false);
    const [error, setError] = useState("");

    // Populate user info if creating a new post and session is loaded
    useEffect(() => {
        if (!editId && session?.user) {
            setFormData(prev => ({
                ...prev,
                author: {
                    name: session.user.name || prev.author.name,
                    email: session.user.email || prev.author.email,
                    role: session.user.role || prev.author.role,
                    bio: session.user.bio || prev.author.bio
                }
            }));
        }
    }, [session, editId]);

    // Fetch existing post details if in edit mode
    useEffect(() => {
        if (!editId) return;

        const fetchPost = async () => {
            setLoadingPost(true);
            setError("");
            try {
                const res = await fetch(`/api/posts/${editId}`);
                if (!res.ok) throw new Error("Failed to fetch blog post");
                const post = await res.json();

                setFormData({
                    title: post.title || "",
                    excerpt: post.excerpt || "",
                    categories: post.categories || [],
                    content: post.content || "",
                    is_featured: post.is_featured || false,
                    status: post.status || "Draft",
                    author: {
                        name: post.author?.name || "",
                        email: post.author?.email || "",
                        role: post.author?.role || "",
                        bio: post.author?.bio || ""
                    }
                });

                if (post.featured_image) {
                    setExistingImage(post.featured_image);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load blog post details.");
            } finally {
                setLoadingPost(false);
            }
        };

        fetchPost();
    }, [editId]);

    // UI State: Loading session
    if (sessionStatus === "loading" || loadingPost) {
        return <p className="text-center mt-20 text-gray-500">Loading details...</p>;
    }

    // Security Check: Only display form if user is logged in AND is the admin
    const isAdmin = session?.user?.email === "contact@receiptscan.org" || session?.user?.role === "admin";

    if (!isAdmin) {
        return (
            <div className="container mt-20 text-center text-white">
                <h1>Access Denied</h1>
                <p>Only administrators can view this page.</p>
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
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        const file = e.target.files[0];
        if (!file) return;

        const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

        if (!validMimeTypes.includes(file.type)) {
            setError("Invalid file type. Only images are allowed.");
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            setError("File exceeds 5MB limit.");
            return;
        }

        setImageFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let imageUrl = existingImage;

            // 1. If a new image is selected, upload it first
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append("file", imageFile);

                const uploadRes = await fetch("/api/upload-blog-image", {
                    method: "POST",
                    body: imageFormData,
                });

                if (!uploadRes.ok) throw new Error("Image upload failed");

                const uploadData = await uploadRes.json();
                imageUrl = uploadData.secure_url || "";
            }

            // 2. Attach the image URL to the rest of the blog post data
            const postData = {
                ...formData,
                featured_image: imageUrl,
            };

            const url = editId ? `/api/posts/${editId}` : "/api/posts";
            const method = editId ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            });

            if (res.ok) {
                if (editId) {
                    router.push("/admin/posts");
                } else {
                    router.push("/blog");
                }
            } else {
                const errorText = await res.text();
                setError(errorText || `Failed to ${editId ? "update" : "publish"} post.`);
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
                        <div className="header-with-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <h1 style={{ marginBottom: 0 }}>{editId ? "Edit Blog Post" : "Create New Blog Post"}</h1>
                            <Link href="/admin/posts" className="btn btn-primary" style={{ fontSize: "14px", padding: "10px 20px" }}>
                                Manage Posts
                            </Link>
                        </div>

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
                                {!imageFile && existingImage && (
                                    <div className="existing-image-preview" style={{ marginTop: "12px" }}>
                                        <p className="form-text" style={{ marginBottom: "6px" }}>Current Featured Image:</p>
                                        <img
                                            src={existingImage}
                                            alt="Current featured image"
                                            style={{ maxWidth: "150px", borderRadius: "8px", border: "1px solid var(--color-neutral-400)", display: "block" }}
                                        />
                                    </div>
                                )}
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
                                <label>Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                </select>
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
                                        categories: e.target.value.split(",").map(cat => cat.trim()).filter(Boolean)
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
                                    {loading ? (editId ? "Updating..." : "Publishing...") : (editId ? "Update Post" : "Publish Post")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CreateBlogPost() {
    return (
        <Suspense fallback={<p className="text-center mt-20 text-gray-500">Loading form...</p>}>
            <CreateBlogPostForm />
        </Suspense>
    );
}