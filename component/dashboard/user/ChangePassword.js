"use client";

// components/ChangePasswordForm.js
import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Box,
} from "@mui/material";
import BeatLoader from "react-spinners/BeatLoader";
import { useTranslation } from "react-i18next";

const ChangePasswordForm = () => {
  const { t } = useTranslation("component/dashboard/user/changepassword");

  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({ oldPassword, newPassword });

    if (newPassword !== confirmPassword) {
      setAlert({
        type: "error",
        message: t("password_mismatch", "New password do not match"),
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${process.env.API}/user/change/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoading(false);

        setAlert({
          type: "success",
          message: t(
            "password_change_success",
            "Password changed successfully"
          ),
        });

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setLoading(false);
        setAlert({
          type: "error",
          message: data?.err || t("update_failed", "Password update failed"),
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: t("something_wrong", "Something went wrong"),
      });
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <Box
        sx={{ width: "100%", padding: "2rem", boxShadow: 9, borderRadius: 1 }}
      >
        {alert.message && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("change_password_title", "Change Password")}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label={t("old_password", "Old Password")}
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{
              style: { color: "#8A12FC" },
            }}
            sx={{
              mb: 3,
              input: { color: "#8A12FC" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#8A12FC",
                },
                "&:hover fieldset": {
                  borderColor: "#8A12FC",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#8A12FC",
                },
              },
            }}
          />
          <TextField
            label={t("new_password", "New Password")}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{
              style: { color: "#8A12FC" },
            }}
            sx={{
              mb: 3,
              input: { color: "#8A12FC" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#8A12FC",
                },
                "&:hover fieldset": {
                  borderColor: "#8A12FC",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#8A12FC",
                },
              },
            }}
          />
          <TextField
            label={t("confirm_password", "Confirm Password")}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{
              style: { color: "#8A12FC" },
            }}
            sx={{
              mb: 3,
              input: { color: "#8A12FC" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#8A12FC",
                },
                "&:hover fieldset": {
                  borderColor: "#8A12FC",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#8A12FC",
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#8A12FC",
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#8A12FC",
                },
                "&:hover fieldset": {
                  borderColor: "#8A12FC",
                  backgroundColor: "#8A12FC",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#8A12FC",
                },
              },
            }}
          >
            <BeatLoader
              color="white"
              loading={loading}
              size={15}
              aria-label="Loading Spinner"
              data-testid="loader"
            />

            {loading ? "" : t("change_password_button", "Change Password")}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ChangePasswordForm;
