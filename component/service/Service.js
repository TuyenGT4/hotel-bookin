// components/ServiceComponent.js
import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next"; // ✅ thêm hook dịch

const ServiceComponent = () => {
  const { t } = useTranslation("component/service/Service");

  const services = [
    {
      title: t(
        "hotel_room_reservation",
        "Hotel Room Reservation into the Desire Places"
      ),
      description: t(
        "hotel_room_desc",
        "You can easily reserve a hotel room in a good place as you want. This will be able to make good feelings. This will be really effective for us and all & all of the customers & clients."
      ),
      buttonText: t("read_more", "Read More"),
    },
    {
      title: t(
        "resort_reservation",
        "Resort Reservation Into the Good and Suitable Place"
      ),
      description: t(
        "resort_reservation_desc",
        "You can easily reserve a hotel room in a good place as you want. This will be able to make good feelings. This will be really effective for us and all & all of the customers & clients."
      ),
      buttonText: t("read_more", "Read More"),
    },
    {
      title: t(
        "wedding_hall_reservation",
        "Wedding Hall Reservation in the Suitable and Good Place"
      ),
      description: t(
        "wedding_hall_desc",
        "You can easily reserve a hotel room in a good place as you want. This will be able to make good feelings. This will be really effective for us and all & all of the customers & clients."
      ),
      buttonText: t("read_more", "Read More"),
    },
    {
      title: t(
        "conference_room_reservation",
        "Conference Room Reservation in the Suitable and Good Place"
      ),
      description: t(
        "conference_room_desc",
        "You can easily reserve a hotel room in a good place as you want. This will be able to make good feelings. This will be really effective for us and all & all of the customers & clients."
      ),
      buttonText: t("read_more", "Read More"),
    },
  ];

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" m={8} component="h1" align="center" gutterBottom>
        {t("service_list", "Service List")}
      </Typography>
      <Grid container spacing={3}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    marginTop: "20px",
                    backgroundColor: "red",
                    "&:hover": { backgroundColor: "darkred" },
                  }}
                >
                  {service.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ServiceComponent;
