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
import {  useRouter } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";

const LoginPage = () => {
  const [loginId, setLoginId] = useState("");

  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [isEmail, setIsEmail] = useState(true);

  const router = useRouter();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatedPhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const isInputEmail = validateEmail(loginId);
    const isInputPhone = validatedPhone(loginId);

    if (!loginId || !password) {
      setSnackbarMessage("Login Id and Password are required");

      setSnackbarSeverity("error");

      setOpenSnackbar(true);
      return;
    }

    if (!isInputEmail && !isInputPhone) {
      setSnackbarMessage("Please enter a valid email or phone number");
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
        setSnackbarMessage(result.error || " login  failed");
        setSnackbarSeverity("error");
      } else {
        setSnackbarMessage("Login successfull");
        setSnackbarSeverity("success");

        router.push("/");
      }
    } catch (error) {
      setSnackbarMessage("An error occurred Please try  again");
    }

    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleLoginIdChange = (e) => {
    const value = e.target.value;
    setLoginId(value);

    if (value.includes("@")) {
      setIsEmail(true);
    } else if (/^[0-9]+$/.test(value)) {
      setIsEmail(false);
    }
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
        <Grid item xs={12} md={6}>
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{ p: 3 }}
            onSubmit={handleLogin}
          >
            <Typography variant="h4" gutterBottom>
              <HotelHubLogo />
            </Typography>

            <Typography variant="h4" gutterBottom>
              Login
            </Typography>
            <TextField
              label={isEmail ? "Email" : "Phone Number"}
              type={isEmail ? "email" : "tel"}
              variant="outlined"
              fullWidth
              margin="normal"
              value={loginId}
              onChange={handleLoginIdChange}
              InputLabelProps={{
                style: { color: "red" },
              }}
              InputProps={{
                style: {
                  color: "#fff",
                  borderColor: "red",
                },
              }}
              sx={{
                input: { color: "black" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "red",
                  },
                  "&:hover fieldset": {
                    borderColor: "red",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "red",
                  },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{
                style: { color: "red" },
              }}
              InputProps={{
                style: {
                  color: "#fff",
                  borderColor: "red",
                },
              }}
              sx={{
                input: { color: "black" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "red",
                  },
                  "&:hover fieldset": {
                    borderColor: "red",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "red",
                  },
                },
              }}
            />

            <Divider sx={{ mt: 2 }}>or</Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{
                color: "white",
                backgroundColor: "red",
                "&:hover": {
                  color: "white",
                  backgroundColor: "red",
                },
                mt: 2,
                width: "100%",
              }}
              onClick={() => signIn("google")}
            >
              Log In with Google
            </Button>

            <Link
              href="/forgot-password"
              variant="body2"
              sx={{ alignSelf: "flex-end", mt: 1 }}
            >
              Forgot Password?
            </Link>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "red",
                "&:hover": {
                  backgroundColor: "red",
                },
                mt: 2,
                width: "100%",
              }}
            >
              Login
            </Button>
            <Link href="/register" variant="body2" sx={{ mt: 2 }}>
              Don't have an account? Sign Up
            </Link>
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
              src="/images/login5.jpg"
              alt="Login image"
              sx={{
                marginTop: "3px",
                marginBottom: "2px",
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
        sx={{
          "& .MuiSnackbar-root": {
            top: "24px",
            left: "24px",
          },
        }}
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
