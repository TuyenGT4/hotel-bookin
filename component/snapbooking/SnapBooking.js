import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import {
  RootContainer,
  Header,
  StyledImage,
  StyledButton,
  ColorfulLoader,
  ErrorMessage,
  MainTitle,
} from "./styles";

export default function Home() {
  const [promo, setPromo] = useState({
    mainTitle: "",
    shortDesc: "",
    linkUrl: "",
    photoUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromoData = async () => {
      try {
        const response = await fetch(`${process.env.API}/bookarea`);

        if (!response.ok) {
          throw new Error("Faoled to fetch data");
        }

        const data = await response.json();

        setTimeout(() => {
          setPromo({
            mainTitle: data?.mainTitle,
            shortDesc: data?.shortDesc,
            linkUrl: data?.linkUrl,
            photoUrl: data?.photoUrl,
          });

          setLoading(false);
        }, 2000);
      } catch (error) {
        setError(error.message);

        setTimeout(() => setLoading(false), 200);
      }
    };

    fetchPromoData();
  }, []);

  if (loading) return <ColorfulLoader />;

  if (error) return <ErrorMessage error={error} />;
  return (
    <RootContainer maxWidth="xl">
      <MainTitle />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box textAlign={{ xs: "center", md: "left" }}>
            <Header variant="h3">{promo.mainTitle}</Header>
            <Typography variant="body1" paragraph>
              {promo.shortDesc}
            </Typography>
            <StyledButton
              variant="contained"
              href={promo.linkUrl}
              sx={{
                background: "linear-gradient(90deg, #FF3CAC 0%, #784BA0 100%)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
              }}
            >
              Book Now
            </StyledButton>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledImage
            src={promo.photoUrl}
            alt="Luxury Resort"
            onError={(e) => {
              e.target.src = "/images/hotel18.webp";
            }}
          />
        </Grid>
      </Grid>
    </RootContainer>
  );
}
