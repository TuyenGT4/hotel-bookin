// components/Testimonial.js
import React from "react";
import { Container, Box, Grid, Typography, Avatar } from "@mui/material";
import Right from "./Right";
import { useTranslation } from "react-i18next";

const Testimonial = () => {
  const { t } = useTranslation("component/testimoninal/Testimonial");

  return (
    <Container maxWidth="xl">
      <Box sx={{ padding: "2rem", textAlign: "center" }}>
        <Typography variant="overline" sx={{ color: "#FF6F61" }}>
          {t("testimonial_section_title", "TESTIMONIAL")}
        </Typography>

        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: "2rem" }}
        >
          {t(
            "testimonial_main_heading",
            "Our Latest Testimonials and What Our Client Says"
          )}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/hotel14.jpg"
              alt={t("testimonial_image_alt", "Client")}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 2,
                boxShadow: 1,
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Right /> {/* vẫn giữ nguyên logic */}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Testimonial;
