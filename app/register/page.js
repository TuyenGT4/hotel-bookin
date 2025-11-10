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

import { signIn } from "next-auth/react";
const RegisterPage = () => {
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
      setSnackbarMessage("All fields are  required");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);

      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setSnackbarMessage("Please   enter a valid 10  digit phone number");
      setSnackbarSeverity("error");

      setOpenSnackbar(true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSnackbarMessage("Please  enter a valid email  adrress");
      setSnackbarSeverity("error");

      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch(`${process.env.API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, email, password }),
      });

      if (response.ok) {
        setSnackbarMessage("Registration successful");

        setSnackbarSeverity("success");

        setName("");
        setPhone("");

        setEmail("");

        setPassword("");
      } else {
        const data = await response.json();
        setSnackbarMessage(data.message || "register failed");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage("an error occurresd please try  again");
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
              ml: "5px", // Your left margin
            }}
          >
            <Typography variant="h4" gutterBottom>
              <HotelHubLogo />
            </Typography>
          </Box>

          <Typography variant="h4" gutterBottom align="center">
            Register
          </Typography>

          <TextField
            label="Name"
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
            label="Phone"
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
            label="Email"
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
            label="Password"
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

          <Divider>or</Divider>

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
            Log In with Google
          </Button>

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
            Register
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            <Link href="/login" underline="hover">
              Already have an account? Login
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Image (Hidden on mobile) */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: "50%",
          height: "100%",
        }}
      >
        <Box
          component="img"
          src="/images/register.jpeg"
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

//   (!/^\d{10}$/.test(phone))

// Validate email format (basic check)
//  (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
