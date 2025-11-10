"use client"; // Ensure this is at the top for Next.js to handle the client-side component

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

// List of countries for the dropdown
const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "IN", name: "India" },
  // Add more countries as needed
];

export default function ProfileUpdateForm() {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");

  const [country, setCountry] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [profileImagePreview, setProfileImagePreview] = useState("");

  const [errors, setErrors] = useState({});

  const [serverMessage, setServerMessage] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.API}/user/profile`);

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      setEmail(data?.email);
      setName(data?.name);
      setMobileNumber(data?.mobileNumber || "");
      setAddress(data?.address || "");

      setCountry(data?.country);
    } catch (error) {
      console.log("error fetching user data", error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!name) errors.name = "name is required";

    if (!email) errors.email = "email is required";

    if (mobileNumber && !/^[0-9]{10}$/.test(mobileNumber)) {
      errors.mobileNumber = " please enter a valid 10  digit mobile number";
    }

    if (address && address.length < 5) {
      errors.address = "address is too  short";
    }

    if (
      country &&
      !countries.some((c) => c.code === country || c.name === country)
    ) {
      errors.country = "please select  a valid country";
    }

    if (!password) errors.password = "password  is required";

    if (password !== confirmPassword) {
      errors.confirmPassword = " password  do not match";
    }
    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const uploadImageToCloudinary = async (image) => {
    const formData = new FormData();

    formData.append("file", image);
    formData.append("upload_preset", "ml_default");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerMessage("");
    if (!validateForm()) return;

    let imageUrl = profileImagePreview;

    if (profileImage) {
      imageUrl = await uploadImageToCloudinary(profileImage);

      setIsSuccess(true);
      setServerMessage("image uploaded successfully");
    }

    const requestBody = {
      name,
      email,
      password,
      mobileNumber,
      address,
      country,
      profileImage: imageUrl,
    };

    const response = await fetch(`${process.env.API}/user/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    if (!response.ok) {
      setIsSuccess(false);
      setServerMessage(data?.err);
    } else {
      setIsSuccess(true);
      setServerMessage(data?.msg);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          maxWidth: 1300,
          margin: "0 auto",
          padding: 2,
          overflow: "hidden",
          //  backgroundColor: "rgba(31, 15, 15, 0.6)",
          marginTop: "29px",
          padding: "40px",
          color: "white",
        }}
      >
        {profileImagePreview && (
          <Box
            sx={{
              order: { xs: 2, sm: 1 },
              flex: { xs: "none", sm: 1 },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {profileImagePreview && (
              <Box mt={2} textAlign="center">
                <div className="image-container">
                  <img
                    src={profileImagePreview}
                    alt="Profile Preview"
                    className="profile-image"
                  />
                </div>
              </Box>
            )}
          </Box>
        )}

        <Box
          sx={{
            order: { xs: 1, sm: 2 },
            flex: { xs: 1, sm: 2 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: "#8A12FC",
            }}
            variant="h4"
            component="h1"
            gutterBottom
          >
            Update Profile
          </Typography>
          {serverMessage && (
            <Alert severity={isSuccess ? "success" : "error"}>
              {serverMessage}
            </Alert>
          )}
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
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
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
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
            label="Mobile Number"
            variant="outlined"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
            fullWidth
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
            label="Address"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
            fullWidth
            multiline
            rows={3}
            InputLabelProps={{
              style: { color: "#8A12FC" },
            }}
            sx={{
              mb: 3,
              textarea: { color: "#8A12FC" },
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
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="country-select-label" sx={{ color: "black" }}>
              Country
            </InputLabel>
            <Select
              labelId="country-select-label"
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              error={!!errors.country}
              sx={{
                color: "#8A12FC",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#8A12FC",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#8A12FC",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#8A12FC",
                },
              }}
            >
              {countries.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
            {errors.country && (
              <Typography variant="caption" color="error">
                {errors.country}
              </Typography>
            )}
          </FormControl>
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
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
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            fullWidth
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
            variant="contained"
            component="label"
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
            Upload Profile Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          <Button
            type="submit"
            variant="contained"
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
            Update Profile
          </Button>
        </Box>
        <style jsx>{`
          .image-container {
            width: 280px;
            height: 280px;
            border-radius: 50%;
            overflow: hidden;
            margin-top: 50px;
            display: inline-block;
            padding: 5px;
            background: linear-gradient(
              45deg,
              rgba(238, 130, 238, 1),
              rgba(255, 192, 203, 1),
              rgba(255, 165, 0, 1)
            );
            background-size: 200% 200%;
            animation: gradientAnimation 2s ease infinite;
          }
          .profile-image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
          @keyframes gradientAnimation {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
      </Box>
    </>
  );
}
