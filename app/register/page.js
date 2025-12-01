"use client";

import React, { useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Link,
  Typography,
  Box,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import HotelHubLogo from "@/component/nav/HotelHubLogo";
import GoogleIcon from "@mui/icons-material/Google";
import { useTranslation } from "react-i18next";
import { signIn } from "next-auth/react";

const RegisterPage = () => {
  const { t } = useTranslation("app/register/register");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !phone || !email || !password) {
      setSnackbarMessage(t("errors.required_all"));
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setSnackbarMessage(t("errors.invalid_phone"));
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSnackbarMessage(t("errors.invalid_email"));
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, email, password }),
      });

      if (response.ok) {
        setSnackbarMessage(t("success"));
        setSnackbarSeverity("success");
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
      } else {
        const data = await response.json();
        setSnackbarMessage(data.message || t("errors.failed"));
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage(t("errors.server"));
      setSnackbarSeverity("error");
    }

    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Left Side - Registration Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.paper",
          p: 2,
          overflowY: "auto",
        }}
      >
        <Box
          onSubmit={handleRegister}
          component="form"
          sx={{
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              ml: "5px",
            }}
          >
            <Typography variant="h4" gutterBottom>
              <HotelHubLogo />
            </Typography>
          </Box>

          <Typography variant="h4" gutterBottom align="center">
            {t("title")}
          </Typography>

          <TextField
            label={t("fields.name")}
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "red" },
                "&:hover fieldset": { borderColor: "red" },
                "&.Mui-focused fieldset": { borderColor: "red" },
              },
              "& .MuiInputLabel-root": { color: "red" },
              "& .MuiInputBase-input": { color: "black" },
            }}
          />

          <TextField
            label={t("fields.phone")}
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "red" },
                "&:hover fieldset": { borderColor: "red" },
                "&.Mui-focused fieldset": { borderColor: "red" },
              },
              "& .MuiInputLabel-root": { color: "red" },
              "& .MuiInputBase-input": { color: "black" },
            }}
          />

          <TextField
            label={t("fields.email")}
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "red" },
                "&:hover fieldset": { borderColor: "red" },
                "&.Mui-focused fieldset": { borderColor: "red" },
              },
              "& .MuiInputLabel-root": { color: "red" },
              "& .MuiInputBase-input": { color: "black" },
            }}
          />

          <TextField
            label={t("fields.password")}
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "red" },
                "&:hover fieldset": { borderColor: "red" },
                "&.Mui-focused fieldset": { borderColor: "red" },
              },
              "& .MuiInputLabel-root": { color: "red" },
              "& .MuiInputBase-input": { color: "black" },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "red",
              "&:hover": { backgroundColor: "darkred" },
              py: 1.5,
            }}
          >
            {t("buttons.register")}
          </Button>

          <Divider>{t("or")}</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              color: "white",
              backgroundColor: "red",
              "&:hover": { backgroundColor: "darkred" },
              py: 1.5,
            }}
            onClick={() => signIn("google")}
          >
            {t("buttons.google")}
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            <Link href="/login" underline="hover">
              {t("already_have_account")}
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Image */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: "50%",
          height: "100%",
        }}
      >
        <Box
          component="img"
          src="/images/registerr.jpeg"
          alt="Register"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;
