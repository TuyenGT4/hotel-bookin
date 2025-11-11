import { Box, Grid, Typography, IconButton } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTranslation } from "react-i18next";

export const LeftSideContent = ({
  title,
  description,
  image,
  views,
  postedDate,
}) => {
  const { t } = useTranslation("component/blogs/LeftSideContent");

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box
          component="img"
          src={image}
          alt={t("main_image_alt", "Main")}
          sx={{
            width: 800,
            height: 400,
            marginRight: "10px",
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
      </Grid>

      <Grid item xs={12} container spacing={2}>
        <Grid item style={{ display: "flex" }}>
          <IconButton aria-label="Verified">
            <VerifiedUserIcon style={{ color: "#ff531a" }} />
          </IconButton>
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            {t("verified", "Verified")}
          </Typography>
        </Grid>
        <Grid item style={{ display: "flex" }}>
          <IconButton aria-label="Add to Favorites">
            <FavoriteIcon style={{ color: "#ff531a" }} />
          </IconButton>
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            {t("add_to_favorites", "Add to Favorites")}
          </Typography>
        </Grid>
        <Grid item style={{ display: "flex" }}>
          <IconButton aria-label="Views">
            <VisibilityIcon style={{ color: "#ff531a" }} />
          </IconButton>
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            {t("views", "100 views")}
          </Typography>
        </Grid>
        <Grid item style={{ display: "flex" }}>
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            {t("open", "open")}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-line", // Preserves line breaks
            lineHeight: 1.6, // Better readability
            mb: 3, // Bottom margin
            textAlign: "justify", // Clean alignment
          }}
        >
          {description}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          {t("login_comment", "Login to leave a comment.")}
        </Typography>
      </Grid>
    </Grid>
  );
};
