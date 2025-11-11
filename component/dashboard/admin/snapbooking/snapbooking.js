"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function PromoCardEditor() {
  const { t } = useTranslation("promo"); // namespace promo.json

  const [form, setForm] = useState({
    shortTitle: "",
    mainTital: "",
    shortDesc: "",
    linkUrl: "",
    photo: null,
    existingPhotoUrl: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState({
    text: "",
    isError: false,
  });

  useEffect(() => {
    const fetchPromoData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.API}/admin/bookarea`);

        if (!response.ok) {
          throw new Error(t("fetch_error", "Failed to fetch promo data"));
        }

        const data = await response.json();

        if (data) {
          setForm({
            shortTitle: data?.shortTitle || "",
            mainTital: data?.mainTital || "",
            shortDesc: data?.shortDesc || "",
            linkUrl: data?.linkUrl || "",
            photo: null,
            existingPhotoUrl: data?.photoUrl || "",
          });

          if (data?.photoUrl) {
            setImagePreview(data?.photoUrl);
          }
        }
      } catch (error) {
        console.log("error fetching promo data", error);
        setServerMessage({
          text: t("load_error_message", "Failed to load promo data"),
          isError: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromoData();
  }, [t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, photo: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          t("upload_error", "Failed to upload image to Cloudinary")
        );
      }

      const data = await response.json();
      return data?.secure_url;
    } catch (error) {
      console.log("cloudinary upload error", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setServerMessage({ text: "", isError: false });

    try {
      let imageUrl = form.existingPhotoUrl;
      if (form.photo) {
        imageUrl = await uploadImageToCloudinary(form.photo);
      }

      const requestBody = {
        shortTitle: form.shortTitle,
        mainTital: form.mainTital,
        shortDesc: form.shortDesc,
        linkUrl: form.linkUrl,
        photoUrl: imageUrl,
      };

      const response = await fetch(`${process.env.API}/admin/bookarea`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || t("save_error", "Failed to save promo")
        );
      }

      const result = await response.json();

      setServerMessage({
        text:
          result.message || t("update_success", "Promo updated successfully"),
        isError: false,
      });

      setForm((prev) => ({
        ...prev,
        existingPhotoUrl: imageUrl,
        photo: null,
      }));
    } catch (error) {
      setServerMessage({
        text:
          error.message || t("general_error", "An error occurred while saving"),
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        mt: 4,
      }}
    >
      <Typography variant="h6" mb={2}>
        {t("snap_booking", "Snap Booking")}
      </Typography>

      {serverMessage.text && (
        <Alert
          severity={serverMessage.isError ? "error" : "success"}
          sx={{ mb: 2 }}
        >
          {serverMessage.text}
        </Alert>
      )}

      <Stack spacing={2}>
        <TextField
          name="shortTitle"
          label={t("short_title", "Short Title")}
          value={form.shortTitle}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            style: { color: "#8A12FC" },
          }}
          sx={{
            mb: 3,
            input: { color: "white" },
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
          name="mainTitle"
          label={t("main_title", "Main Title")}
          value={form.mainTitle}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            style: { color: "#8A12FC" },
          }}
          sx={{
            mb: 3,
            input: { color: "white" },
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
          name="shortDesc"
          label={t("short_description", "Short Description")}
          value={form.shortDesc}
          onChange={handleChange}
          rows={5}
          fullWidth
          InputLabelProps={{
            style: { color: "#8A12FC" },
          }}
          sx={{
            mb: 3,
            input: { color: "white" },
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
          name="linkUrl"
          label={t("link_url", "Link URL")}
          value={form.linkUrl}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            style: { color: "#8A12FC" },
          }}
          sx={{
            mb: 3,
            input: { color: "white" },
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

        {imagePreview && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t("image_preview", "Image Preview")}:
            </Typography>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: "4px",
              }}
            />
          </Box>
        )}

        <Button
          variant="contained"
          component="label"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#8A12FC",
            "&:hover": { backgroundColor: "#7a0ae8" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#8A12FC" },
              "&:hover fieldset": { borderColor: "#8A12FC" },
              "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
            },
          }}
        >
          {imagePreview
            ? t("change_photo", "Change Photo")
            : t("upload_photo", "Upload Photo")}
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#8A12FC",
            "&:hover": { backgroundColor: "#7a0ae8" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#8A12FC" },
              "&:hover fieldset": { borderColor: "#8A12FC" },
              "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
            },
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t("update_snap_booking", "Update Snap Booking")
          )}
        </Button>
      </Stack>
    </Box>
  );
}
