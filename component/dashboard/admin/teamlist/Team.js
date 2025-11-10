// components/Team.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

const Team = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/teamlist`);

      const data = await response.json();

      setEmployees(data);
    } catch (error) {
      console.log("error fetching employee", error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography
        variant="h4"
        component="h1"
        align="center"
        m={8}
        gutterBottom
        sx={{
          fontWeight: "bold",
          background: "linear-gradient(90deg, #ff6a00, #ee0979)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textTransform: "uppercase",
          letterSpacing: 3,
          transition: "all 0.3s ease",
          cursor: "pointer",
          "&:hover": {
            letterSpacing: 5,
            transform: "scale(1.05)",
          },
        }}
      >
        Brains Behind the Brand
      </Typography>
      <Grid container spacing={4}>
        {employees &&
          employees.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.name}>
              <Card
                sx={{
                  position: "relative",
                  "&:hover .overlay": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ height: 500 }}
                  image={member.image}
                  title={member.name}
                />
                <Box
                  className="overlay"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    opacity: 0,
                    transform: "translateY(20%)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      borderRadius: 2,
                      transition: "all 0.4s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 20px rgba(138, 83, 255, 0.15)",
                        "& .member-position": {
                          opacity: 1,
                          maxHeight: "40px",
                          transform: "scale(1)",
                        },
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 900,
                        background:
                          "linear-gradient(45deg,rgb(212, 10, 196) 0%,rgb(106, 214, 4) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        display: "inline-block",
                        fontSize: "1.9rem",
                        letterSpacing: "-0.5px",
                        lineHeight: 1.2,
                        mb: 1,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          letterSpacing: "0px",
                        },
                      }}
                    >
                      {member.name}
                    </Typography>

                    <Box
                      className="member-position"
                      sx={{
                        opacity: 0.9,
                        maxHeight: 0,
                        transform: "scale(0.95)",
                        transition:
                          "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)",
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#fff",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          py: 1,
                          px: 2,
                          borderRadius: 12,
                          backgroundColor: "rgba(1, 0, 3, 0.08)",
                          display: "inline-block",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        {member.position}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default Team;
