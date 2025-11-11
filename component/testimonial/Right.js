import React from "react";
import { Grid, Box, Card, CardMedia, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { useTranslation } from "react-i18next";

const StyledCard = styled(Card)({
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "scale(1.05)",
    transition: "transform 0.3s ease-in-out",
  },
  maxWidth: 954,
});

const SquareImage = styled(CardMedia)({
  borderRadius: "8px",
  width: "100%",
  height: "35vh",
  margin: "0 auto",
});

const PostCard = ({ post }) => {
  const { t } = useTranslation();
  return (
    <StyledCard>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} container direction="column" alignItems="center">
          <SquareImage component="img" image={post.imageUrl} alt={post.title} />
          <Typography variant="h6" component="div" sx={{ paddingTop: 2 }}>
            {post.title}
          </Typography>
        </Grid>
        <Grid item xs={12} container direction="column" alignItems="center">
          <LocalLibraryIcon
            sx={{ color: "red", marginRight: 1 }}
            size="large"
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ paddingTop: 2 }}
          >
            {post.location}
          </Typography>
        </Grid>
        <LocalLibraryIcon size="large" sx={{ color: "red", margin: 1 }} />
      </Grid>
    </StyledCard>
  );
};

export default function ClientSaid() {
  const { t } = useTranslation("component/testimonial/Right");

  const dummyPosts = [
    {
      title: t("mountain_view", "Beautiful Mountain View"),
      location: t(
        "mountain_view_desc",
        "This setup gives you a layout where each slide showcases the natural beauty of the mountains."
      ),
      imageUrl: "/images/hotel2.jpg",
    },
    {
      title: t("sunny_beach", "Sunny Beach"),
      location: t(
        "sunny_beach_desc",
        "Enjoy the sunshine and waves with this relaxing beachside view."
      ),
      imageUrl: "/images/hotel2.jpg",
    },
    {
      title: t("city_lights", "City Lights"),
      location: t(
        "city_lights_desc",
        "A modern urban escape with sparkling lights and nightlife around."
      ),
      imageUrl: "/images/hotel16.jpg",
    },
    {
      title: t("serene_forest", "Serene Forest"),
      location: t(
        "serene_forest_desc",
        "Feel the calm of the forest and the whispering winds of nature."
      ),
      imageUrl: "/images/hotel3.jpg",
    },
    {
      title: t("desert_adventure", "Desert Adventure"),
      location: t(
        "desert_adventure_desc",
        "Explore the endless sands and breathtaking sunset views of the desert."
      ),
      imageUrl: "/images/hotel16.jpg",
    },
  ];

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    focusOnSelect: true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, slidesToScroll: 1, initialSlide: 1 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {dummyPosts.map((post, index) => (
        <Box key={index} sx={{ padding: 1 }}>
          <PostCard post={post} />
        </Box>
      ))}
    </Slider>
  );
}
