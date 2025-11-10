"use client";
import { Box, Grid } from "@mui/material";
 import { LeftSideContent } from "./LeftSideContent";
 import { RightSideContent } from "./RightSideContent";
import { useEffect, useState } from "react";

export default function BlogPage() {
  const [blogData, setBlogData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(true);

  const [slug, setSlug] = useState(null);

  useEffect(() => {
    const getSlugFromUrl = () => {
      if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search);

        const urlSlug = searchParams.get("slug");

        setSlug(urlSlug);
      }
    };

    getSlugFromUrl();
  }, []);

  useEffect(() => {
    if (!slug) return;

    const fetchBlogData = async () => {
      try {
        setLoading(true);

        setError(null);
        const response = await fetch(`${process.env.API}/blogs/${slug}`);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Blog post not found"
              : "Failed to fetch blog data"
          );
        }

        const data = await response.json();
        setBlogData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [slug]);

  if (!slug && !loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          color: "error.main",
        }}
      >
        No slug parameter provided in URL
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        Loading blog post...
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          color: "error.main",
          textAlign: "center",
          p: 3,
        }}
      >
        Error: {error}
      </Box>
    );
  }

  if (!blogData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        No blog data available
      </Box>
    );
  }

  return (
    <Box
      sx={{
        margin: "0 auto",
        width: "80%",
        maxWidth: "1070px",
        py: 4,
      }}
    >
      <Grid container spacing={3}>
       

        <Grid item xs={12} md={8}>
          <LeftSideContent
            title={blogData?.post?.title}
            description={blogData?.post?.description}
            image={blogData?.post?.image}
            views={blogData?.post?.views}
            postedDate={blogData?.post?.createdAt}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <RightSideContent
            categories={blogData.categories}
            listings={blogData.similarPosts.map((post) => ({
              image: post.image,
              title: post.title,
              postedDate: post.createdAt,

              slug: post.slug,
            }))}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
