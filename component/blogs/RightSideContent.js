import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export const RightSideContent = ({ categories, listings }) => {
  const { t } = useTranslation("component/blogs/RightSideContent");

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
        >
          <TextField
            label={t("search", "Search")}
            variant="outlined"
            sx={{ flexGrow: 1, marginRight: "10px" }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "red",
              padding: "15px",
              borderColor: "#ff531a",
              "&:hover": {
                backgroundColor: "#ff531a",
                color: "white",
              },
            }}
          >
            {t("search", "Search")}
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            backgroundColor: "#fff",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            {t("categories", "Categories")}
          </Typography>
          {categories.map((category, index) => (
            <Box key={index}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                }}
              >
                <Typography variant="body1">{category.name}</Typography>
                <Typography variant="body1">{category.count}</Typography>
              </Box>
              {index < categories.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{
            marginTop: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            backgroundColor: "#fff",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            {t("similar_blogs", "Similar blogs")}
          </Typography>

          {listings.map((listing, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Box
                component="img"
                src={listing.image}
                alt={listing.title}
                sx={{
                  width: 80,
                  height: 80,
                  marginRight: "10px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <Box sx={{ flex: 1 }}>
                <a
                  href={`/blogs?slug=${listing.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      "&:hover": {
                        color: "primary.main",
                        textDecoration: "underline",
                        cursor: "pointer",
                      },
                    }}
                  >
                    {listing.title}
                  </Typography>
                </a>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "5px",
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    {listing.postedDate}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {listing.commentsCount} {t("comments", "comm")}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};
