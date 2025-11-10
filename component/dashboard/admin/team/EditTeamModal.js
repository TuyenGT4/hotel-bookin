import React, { useState, useEffect } from "react";
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

export default function EditTeamModal({
  open,
  onClose,
  member,
  onSuccess,
  loading,
  setLoading,
}) {
  const [editedMember, setEditedMember] = useState({
    name: "",
    position: "",
    image: null,
    previewImage: "",
  });

  useEffect(() => {
    if (member) {
      setEditedMember({
        name: member.name,
        position: member.position,
        image: null,
        previewImage: member.image,
      });
    }
  }, [member]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditedMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setEditedMember((prev) => ({
          ...prev,
          image: file,
          previewImage: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleUpdateMember = async () => {
    if (!editedMember.name || !editedMember.position) {
      toast.error("Please fil all required fields");
    }

    try {
      setLoading(true);

      let imageUrl = member.image;

      if (editedMember.image && typeof editedMember.image !== "string") {
        const imageData = new FormData();

        imageData.append("file", editedMember.image);
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

      const response = await fetch(
        `${process.env.API}/admin/team/${member._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editedMember.name,
            position: editedMember.position,
            image: imageUrl,
          }),
        }
      );

      const updatedEmployee = await response.json();

      onSuccess(updatedEmployee);
      toast.success("Team member updated successfully");
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-team-modal">
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
          Edit Team Member
        </h2>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={editedMember.name}
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
            value={editedMember.position}
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
              id="edit-image-upload"
              sx={{ display: "none" }}
              disabled={loading}
            />
            <label htmlFor="edit-image-upload">
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
                Change Image
              </Button>
            </label>
            {(editedMember.previewImage || member?.image) && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Avatar
                  src={editedMember.previewImage || member?.image}
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
              onClick={handleUpdateMember}
              sx={{
                backgroundColor: "#8A12FC",
                "&:hover": { backgroundColor: "#7a0eeb" },
              }}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Member"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
