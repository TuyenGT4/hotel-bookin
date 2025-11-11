"use client";

import React, { useState } from "react";
import {
  Divider,
  Container,
  Grid,
  TextField,
  Button,
  Link,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { signIn } from "next-auth/react";
import HotelHubLogo from "@/component/nav/HotelHubLogo";
import { useRouter } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation("app/login/login");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isEmail, setIsEmail] = useState(true);
  const router = useRouter();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatedPhone = (phone) => /^\d{10}$/.test(phone);

  const handleLogin = async (e) => {
    e.preventDefault();

    const isInputEmail = validateEmail(loginId);
    const isInputPhone = validatedPhone(loginId);

    if (!loginId || !password) {
      setSnackbarMessage(t("errors.required"));
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (!isInputEmail && !isInputPhone) {
      setSnackbarMessage(t("errors.invalid_login"));
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        [isInputEmail ? "email" : "phone"]: loginId,
        password,
      });

      if (result?.error) {
        setSnackbarMessage(result.error || t("errors.failed"));
        setSnackbarSeverity("error");
      } else {
        setSnackbarMessage(t("success"));
        setSnackbarSeverity("success");
        router.push("/");
      }
    } catch (error) {
      setSnackbarMessage(t("errors.server"));
      setSnackbarSeverity("error");
    }

    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);
  const handleLoginIdChange = (e) => {
    const value = e.target.value;
    setLoginId(value);
    setIsEmail(value.includes("@"));
  };

  return (
    <Container maxWidth="xxl">
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "background.paper",
            height: "100vh",
            p: 2,
          }}
        >
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              width: "100%",
              maxWidth: 400,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h4" gutterBottom align="center">
              <HotelHubLogo />
            </Typography>

            <Typography variant="h4" gutterBottom align="center">
              {t("title")}
            </Typography>

            <TextField
              label={isEmail ? t("fields.email") : t("fields.phone")}
              type={isEmail ? "email" : "tel"}
              variant="outlined"
              fullWidth
              value={loginId}
              onChange={handleLoginIdChange}
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

            <Link
              href="/forgot-password"
              variant="body2"
              sx={{ alignSelf: "flex-end", mt: 1 }}
            >
              {t("forgot_password")}
            </Link>

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
              {t("buttons.login")}
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
              <Link href="/register" underline="hover">
                {t("no_account")}
              </Link>
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: "100%",
              height: "100vh",
              display: { xs: "none", md: "block" },
            }}
          >
            <Box
              component="img"
              src="/images/login22.jpg"
              alt="Login image"
              sx={{
                width: "100%",
                height: "100vh",
                objectFit: "cover",
              }}
            />
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;
