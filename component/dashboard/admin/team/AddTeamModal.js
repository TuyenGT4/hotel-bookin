import React, { useState } from "react";
import {
  Box,
  Modal,
  TextField,
  Stack,
  Input,
  Button,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";
import { modalStyle } from "./styles";

export default function AddTeamModal({
  open,
  onClose,
  onSuccess,
  loading,
  setLoading,
}) {
  const [newMember, setNewMember] = useState({
    name: "",
    position: "",
    image: null,
    previewImage: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewMember((prev) => ({
          ...prev,
          image: file,

          previewImage: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.position) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = "";

      if (newMember.image) {
        const imageData = new FormData();
        imageData.append("file", newMember.image);
        imageData.append("upload_preset", "ml_default");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: imageData,
          }
        );

        const data = await response.json();

        imageUrl = data.secure_url;
      }

      const response = await fetch(`${process.env.API}/admin/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newMember.name,
          position: newMember.position,
          image: imageUrl,
        }),
      });

      const data = await response.json();

      onSuccess(data);

      toast.success("Team member added successfully");

      setNewMember({
        name: "",
        position: "",
        image: null,
        previewImage: "",
      });
    } catch (error) {
      console.log("error adding team", error);

      toast.error("Failed to add team member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-team-modal">
      <Box sx={modalStyle}>
        <h2
          style={{
            marginTop: 0,
            marginBottom: "12px",
            fontWeight: 700,
            fontSize: "1.75rem",
            color: "#1a202c",
          }}
        >
          Add New Team Member
        </h2>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={newMember.name}
            onChange={handleInputChange}
            variant="outlined"
            disabled={loading}
            InputLabelProps={{ style: { color: "#8A12FC" } }}
            sx={{
              input: { color: "black" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#8A12FC" },
                "&:hover fieldset": { borderColor: "#8A12FC" },
                "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Position"
            name="position"
            value={newMember.position}
            onChange={handleInputChange}
            variant="outlined"
            disabled={loading}
            InputLabelProps={{ style: { color: "#8A12FC" } }}
            sx={{
              input: { color: "black" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#8A12FC" },
                "&:hover fieldset": { borderColor: "#8A12FC" },
                "&.Mui-focused fieldset": { borderColor: "#8A12FC" },
              },
            }}
          />

          <Box>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="add-image-upload"
              sx={{ display: "none" }}
              disabled={loading}
            />
            <label htmlFor="add-image-upload">
              <Button
                variant="contained"
                component="span"
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: "#8A12FC",
                  "&:hover": { backgroundColor: "#7a0eeb" },
                }}
              >
                Upload Image
              </Button>
            </label>
            {newMember.previewImage && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Avatar
                  src={newMember.previewImage}
                  alt="Preview"
                  sx={{
                    width: 100,
                    height: 100,
                    border: "3px solid white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: "12px" }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddMember}
              sx={{
                backgroundColor: "#8A12FC",
                "&:hover": { backgroundColor: "#7a0eeb" },
              }}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Member"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
