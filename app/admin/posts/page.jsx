// app/admin/posts/page.jsx
"use client";
import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Pagination from "@/components/Pagination";

function AdminPostsList() {
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Pagination state
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(8);
    const [totalPosts, setTotalPosts] = useState(0);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/posts?admin=true&page=${page}&pageSize=${pageSize}`);
            if (!res.ok) throw new Error("Failed to fetch blog posts");
            const data = await res.json();
            setPosts(data.posts || []);
            setTotalPosts(data.total || 0);
        } catch (err) {
            console.error(err);
            setError("Could not retrieve blog posts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchPosts();
        }
    }, [page, session]);

    // Handle session loading
    if (sessionStatus === "loading") {
        return <p className="text-center mt-20 text-gray-500">Checking authorization...</p>;
    }

    // Security Check
    const isAdmin = session?.user?.email === "contact@receiptscan.org" || session?.user?.role === "admin";

    if (!isAdmin) {
        return (
            <div className="container mt-20 text-center text-white">
                <h1>Access Denied</h1>
                <p>Only administrators can view this page.</p>
            </div>
        );
    }

    const handleDelete = async (postId, postTitle) => {
        if (!confirm(`Are you sure you want to delete "${postTitle}"?`)) return;

        setActionLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchPosts();
            } else {
                const errorText = await res.text();
                setError(errorText || "Failed to delete post.");
            }
        } catch (err) {
            setError("An error occurred during deletion.");
        } finally {
            setActionLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="admin-posts-page">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="admin-posts-header">
                            <div>
                                <h1 className="title">Manage Blog Posts</h1>
                                <p className="subtitle">Publish, edit, and categorize blog content.</p>
                            </div>
                            <div className="actions">
                                <Link href="/admin/create-post" className="btn btn-primary">
                                    Create New Post
                                </Link>
                            </div>
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        {loading ? (
                            <p className="text-center text-gray-500 py-10">Loading posts...</p>
                        ) : posts.length === 0 ? (
                            <div className="no-posts-card">
                                <p>No blog posts found.</p>
                                <Link href="/admin/create-post" className="btn btn-primary mt-4">
                                    Create Your First Post
                                </Link>
                            </div>
                        ) : (
                            <div className="posts-table-container">
                                <table className="posts-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Title</th>
                                            <th>Date Created</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {posts.map((post) => {
                                            const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            });

                                            return (
                                                <tr key={post._id}>
                                                    <td className="col-image">
                                                        <div className="table-thumbnail-wrapper">
                                                            <img
                                                                src={post.featured_image || "/images/post-featured-image-placeholder.png"}
                                                                alt=""
                                                                className="table-thumbnail"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="col-title">
                                                        <span className="post-title-cell">{post.title}</span>
                                                        <span className="post-excerpt-cell">{post.excerpt}</span>
                                                    </td>
                                                    <td className="col-date">{formattedDate}</td>
                                                    <td className="col-status">
                                                        <span className={`status-badge ${post.status === "Published" ? "status-published" : "status-draft"}`}>
                                                            {post.status || "Draft"}
                                                        </span>
                                                    </td>
                                                    <td className="col-actions">
                                                        <div className="action-buttons">
                                                            <Link
                                                                href={`/admin/create-post?edit=${post._id}`}
                                                                className="btn btn-action edit-btn"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(post._id, post.title)}
                                                                disabled={actionLoading}
                                                                className="btn btn-action delete-btn"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {!loading && totalPosts > pageSize && (
                            <div className="admin-posts-pagination">
                                <Pagination
                                    page={page}
                                    pageSize={pageSize}
                                    totalItems={totalPosts}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminPostsPage() {
    return (
        <Suspense fallback={<p className="text-center mt-20 text-gray-500">Loading page...</p>}>
            <AdminPostsList />
        </Suspense>
    );
}
