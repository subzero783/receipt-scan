const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch all properties
async function fetchBlogPosts({ showFeatured = false } = {}) {
  try {
    // Handle the case where the domain is not available yet
    if (!apiDomain) {
      return [];
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/posts${showFeatured ? "/featured" : ""}`,
      { cache: "force-cache" },
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Fetch Single Property
async function fetchBlogPost(id) {
  try {
    if (!apiDomain) {
      return null;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/posts/${id}`,
      { cache: "no-store" },
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch properties data");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export { fetchBlogPosts, fetchBlogPost };
