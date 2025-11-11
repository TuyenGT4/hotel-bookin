// components/JournalAtGlance.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const Blogs = () => {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation("component/blog/Blogs");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${process.env.API}/blogs`);

        if (!response.ok) {
          throw new Error(t("fetch_failed", "Failed to fetch articles"));
        }

        const data = await response.json();
        setArticles(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [t]);

  const handleArticleClick = (slug) => {
    router.push(`/blogs?slug=${slug}`);
  };

  if (loading) return <Typography>{t("loading", "Loading...")}</Typography>;
  if (error)
    return (
      <Typography color="error">
        {t("error", "Error")}: {error}
      </Typography>
    );

  return (
    <Container maxWidth="xl">
      <Box sx={{ padding: "2rem", textAlign: "center" }}>
        <Typography variant="overline" sx={{ color: "#FF6F61" }}>
          {t("testimonial", "TESTIMONIAL")}
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: "2rem" }}
        >
          {t(
            "latest_testimonials",
            "Our Latest Testimonials and What Our Clients Say"
          )}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={3}>
          {articles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article._id}>
              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-2px)",
                    transition: "all 0.3s ease",
                  },
                }}
                onClick={() => handleArticleClick(article.slug)}
              >
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${article.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {article.description.length > 100
                      ? `${article.description.substring(0, 100)}...`
                      : article.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "red",
                      borderColor: "red",
                      marginTop: 2,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArticleClick(article.slug);
                    }}
                  >
                    {t("read_more", "Read More")}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Blogs;
