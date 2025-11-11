import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Modal,
  TextField,
  Stack,
  Button,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Avatar,
  Checkbox,
  ListItemText,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import RoomNumbersTable from "./RoomNumbersTable";

import { selectStyles, textFieldStyles } from "./styles";

export default function EditManageRoomCategoriesModal({
  open,
  onClose,
  member,
  onSuccess,
  loading,
  setLoading,
  fetchRooms,
}) {
  const { t } = useTranslation(
    "component/dashboard/admin/manageroomcategories/EditManageRoomCategoriesModal"
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fileInputRef = useRef(null);
  const bulkFileInputRef = useRef(null);

  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [editedMember, setEditedMember] = useState({
    name: "",
    total_adult: "",
    total_child: "",
    room_capacity: "",
    image: "",
    price: "",
    size: "",
    view: "",
    bed_style: "",
    discount: 0,
    short_desc: "",
    description: "",
    status: 0,
    roomNumber: "",
    room_id: "",
    roomtype_id: "",
    facilities: [],
    gallery_images: [],
    room_numbers: [],
  });
  const [activeTab, setActiveTab] = useState(0);

  // View options
  const viewOptions = [
    t("view_sea", "Sea View"),
    t("view_garden", "Garden View"),
    t("view_mountain", "Mountain View"),
    t("view_city", "City View"),
    t("view_pool", "Pool View"),
  ];

  // Bed style options
  const bedStyleOptions = [
    t("bed_single", "Single Bed"),
    t("bed_double", "Double Bed"),
    t("bed_king", "King Size Bed"),
    t("bed_queen", "Queen Size Bed"),
    t("bed_twin", "Twin Beds"),
    t("bed_bunk", "Bunk Beds"),
  ];

  // Facility options
  const facilityOptions = [
    t("facility_wifi", "Free WiFi"),
    t("facility_pool", "Swimming Pool"),
    t("facility_ac", "Air Conditioning"),
    t("facility_tv", "TV"),
    t("facility_minibar", "Mini Bar"),
    t("facility_safe", "Safe"),
    t("facility_roomservice", "Room Service"),
    t("facility_breakfast", "Breakfast Included"),
    t("facility_laundry", "Laundry Service"),
    t("facility_parking", "Parking"),
    t("facility_gym", "Gym"),
    t("facility_spa", "Spa"),
    t("facility_pet", "Pet Friendly"),
    t("facility_accessible", "Accessible Room"),
  ];

  useEffect(() => {
    if (member) {
      setEditedMember({
        name: member?.roomtype_id?.name || "",
        total_adult: member?.total_adult || "",
        total_child: member?.total_child || "",
        room_capacity: member?.room_capacity || "",
        image: member?.image || "",
        price: member?.price || "",
        size: member?.size || "",
        view: member?.view || "",
        bed_style: member?.bed_style || "",
        discount: member?.discount || 0,
        short_desc: member?.short_desc || "",
        description: member?.description || "",
        status: member?.status || 0,
        roomNumber: member?.roomNumber || "",
        room_id: member?._id || "",
        roomtype_id: member?.roomtype_id?._id || "",
        facilities: member?.facilities || [],
        gallery_images: member?.gallery_images || [],
        room_numbers: member?.room_numbers || [],
      });
      setSelectedFacilities(member?.facilities || []);
      if (member?.image) {
        setImagePreview(member.image);
      } else {
        setImagePreview("");
      }
    } else {
      setEditedMember({
        name: "",
        total_adult: "",
        total_child: "",
        room_capacity: "",
        image: "",
        price: "",
        size: "",
        view: "",
        bed_style: "",
        discount: 0,
        short_desc: "",
        description: "",
        status: 0,
        roomNumber: "",
        room_id: "",
        roomtype_id: "",
        facilities: [],
        room_numbers: [],
        gallery_images: [],
      });
      setSelectedFacilities([]);
      setImagePreview("");
    }
  }, [member]);

  useEffect(() => {
    if (member?.gallery_images) {
      setUploadedImages(member.gallery_images);
    }
  }, [member]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFacilityChange = (event) => {
    const {
      target: { value },
    } = event;
    const newFacilities = typeof value === "string" ? value.split(",") : value;
    setSelectedFacilities(newFacilities);
    setEditedMember((prev) => ({
      ...prev,
      facilities: newFacilities,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setEditedMember((prev) => ({
          ...prev,
          image: data.secure_url,
        }));
        toast.success(
          t("image_upload_success", "Image uploaded successfully!")
        );
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(t("image_upload_failed", "Failed to upload image"));
      setImagePreview("");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleUpdateMember = async () => {
    if (activeTab === 0 && (!editedMember.name || !member)) {
      toast.error(
        t("fill_required_fields", "Please fill all required room fields")
      );
      return;
    }
    if (activeTab !== 0 && !editedMember.roomNumber) {
      toast.error(t("enter_room_number", "Please enter a room number"));
      return;
    }

    try {
      setLoading(true);

      const endpoint =
        activeTab === 0
          ? `${process.env.API}/admin/room/${member?._id}`
          : `${process.env.API}/admin/room/roomno`;

      const method = activeTab === 0 ? "PUT" : "POST";

      const payload =
        activeTab === 0
          ? editedMember
          : {
              room_id: editedMember.room_id || member._id,
              roomtype_id: editedMember.roomtype_id,
              roomNumber: editedMember.roomNumber,
              status: editedMember.status?.toString() || "0",
            };

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      fetchRooms();
      const result = await response.json();
      onSuccess(result);
      toast.success(
        activeTab === 0
          ? t("room_update_success", "Room updated successfully!")
          : t("room_number_save_success", "Room number saved successfully!")
      );
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        activeTab === 0
          ? t("room_update_failed", "Failed to update room")
          : t("room_number_save_failed", "Failed to save room number")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBulkFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setIsUploading(true);
      setBulkUploadProgress(0);

      const uploadedUrls = [];
      const totalFiles = files.length;
      let processedFiles = 0;

      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "ml_default");

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();
          if (data.secure_url) {
            uploadedUrls.push(data.secure_url);
          }

          processedFiles++;
          setBulkUploadProgress(
            Math.round((processedFiles / totalFiles) * 100)
          );
        } catch (error) {
          console.error("Error uploading image:", file.name, error);
          toast.error(t("upload_failed_file", `Failed to upload ${file.name}`));
        }
      }

      if (uploadedUrls.length) {
        setUploadedImages((prev) => [...prev, ...uploadedUrls]);
        setEditedMember((prev) => ({
          ...prev,
          gallery_images: [...prev.gallery_images, ...uploadedUrls],
        }));
        toast.success(
          t(
            "bulk_upload_success",
            `Uploaded ${uploadedUrls.length} of ${totalFiles} images successfully!`
          )
        );
      }
    } catch (error) {
      console.log("Error in bulk upload:", error);
      toast.error(t("bulk_upload_failed", "Bulk upload failed"));
    } finally {
      setIsUploading(false);
      setBulkUploadProgress(0);
    }
  };

  const triggerBulkFileInput = () => {
    bulkFileInputRef.current.click();
  };

  const removeImage = (index) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    setEditedMember((prev) => ({
      ...prev,
      gallery_images: newImages,
    }));
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-team-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "90%" : 1200,
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: "16px",
          boxShadow: 24,
          p: isMobile ? 2 : 4,
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "12px",
            fontWeight: 700,
            fontSize: isMobile ? "1.25rem" : "1.75rem",
            color: "#1a202c",
          }}
        >
          {t("room_management", "Room Management")}
        </h2>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="room management tabs"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
          >
            <Tab
              label={
                isMobile
                  ? t("categories", "Categories")
                  : t("room_categories", "Room Categories")
              }
            />
            <Tab
              label={
                isMobile
                  ? t("room_no_short", "Room No.")
                  : t("room_number", "Room Number")
              }
            />
          </Tabs>
        </Box>

        <Box sx={{ pt: 3 }}>
          {activeTab === 0 ? (
            <Grid container spacing={3}>
              {/* Row 1 */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t("name", "Name")}
                  name="name"
                  value={editedMember.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  {...textFieldStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t("total_adults", "Total Adults")}
                  name="total_adult"
                  value={editedMember.total_adult}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  type="number"
                  {...textFieldStyles}
                />
              </Grid>

              {/* Row 2 */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t("total_children", "Total Children")}
                  name="total_child"
                  value={editedMember.total_child}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  type="number"
                  {...textFieldStyles}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t("room_capacity", "Room Capacity")}
                  name="room_capacity"
                  value={editedMember.room_capacity}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  {...textFieldStyles}
                />
              </Grid>

              {/* Row 3 */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t("price", "Price")}
                  name="price"
                  value={editedMember.price}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  {...textFieldStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">VND</InputAdornment>
                    ),
                  }}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t("discount", "Discount (%)")}
                  name="discount"
                  value={editedMember.discount}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  type="number"
                  {...textFieldStyles}
                />
              </Grid>

              {/* Row 4 */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t("room_size", "Room Size")}
                  name="size"
                  value={editedMember.size}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  {...textFieldStyles}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {t("sq_ft", "sq ft")}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  size="small"
                  sx={selectStyles.formControl.sx}
                >
                  <InputLabel>{t("view", "View")}</InputLabel>
                  <Select
                    name="view"
                    value={editedMember.view}
                    onChange={handleInputChange}
                    label={t("view", "View")}
                    sx={selectStyles.select.sx}
                  >
                    {viewOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Row 5 */}
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  size="small"
                  sx={selectStyles.formControl.sx}
                >
                  <InputLabel>{t("bed_style", "Bed Style")}</InputLabel>
                  <Select
                    name="bed_style"
                    value={editedMember.bed_style}
                    onChange={handleInputChange}
                    label={t("bed_style", "Bed Style")}
                    sx={selectStyles.select.sx}
                  >
                    {bedStyleOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  size="small"
                  sx={selectStyles.formControl.sx}
                >
                  <InputLabel>{t("status", "Status")}</InputLabel>
                  <Select
                    name="status"
                    value={editedMember.status}
                    onChange={handleInputChange}
                    label={t("status", "Status")}
                    sx={selectStyles.select.sx}
                  >
                    <MenuItem sx={selectStyles.menuItem.sx} value={0}>
                      {t("inactive", "Inactive")}
                    </MenuItem>
                    <MenuItem sx={selectStyles.menuItem.sx} value={1}>
                      {t("active", "Active")}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Row 6 - Facilities */}
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  size="small"
                  sx={selectStyles.formControl.sx}
                >
                  <InputLabel style={selectStyles.inputLabel}>
                    {t("facilities", "Facilities")}
                  </InputLabel>
                  <Select
                    multiple
                    name="facilities"
                    value={selectedFacilities}
                    onChange={handleFacilityChange}
                    label={t("facilities", "Facilities")}
                    renderValue={(selected) => selected.join(", ")}
                    sx={selectStyles.select.sx}
                  >
                    {facilityOptions.map((facility) => (
                      <MenuItem
                        key={facility}
                        value={facility}
                        sx={selectStyles.menuItem.sx}
                      >
                        <Checkbox
                          sx={selectStyles.checkbox.sx}
                          checked={selectedFacilities.indexOf(facility) > -1}
                        />
                        <ListItemText primary={facility} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Row 7 - Image Upload */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {imagePreview && (
                    <Avatar
                      src={imagePreview}
                      alt={t("room_preview", "Room Preview")}
                      sx={{ width: 200, height: 200 }}
                      variant="rounded"
                    />
                  )}
                  <Box>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                    <Button
                      variant="contained"
                      onClick={triggerFileInput}
                      disabled={isUploading || loading}
                      sx={{
                        mb: 2,
                        color: "white",
                        backgroundColor: "#8A12FC",
                        "&:hover": { backgroundColor: "#7a0eeb" },
                      }}
                    >
                      {isUploading
                        ? t("uploading", "Uploading...")
                        : t("upload_image", "Upload Image")}
                    </Button>
                  </Box>
                </Box>
              </Grid>

              {/* Row 8 - Short Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("short_description", "Short Description")}
                  name="short_desc"
                  value={editedMember.short_desc}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  multiline
                  rows={2}
                  {...textFieldStyles}
                />
              </Grid>

              {/* Row 9 - Full Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("full_description", "Full Description")}
                  name="description"
                  value={editedMember.description}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  multiline
                  rows={4}
                  {...textFieldStyles}
                />
              </Grid>

              {/* Bulk Image Upload */}
              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <input
                    type="file"
                    ref={bulkFileInputRef}
                    onChange={handleBulkFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                    multiple
                  />
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    onClick={triggerBulkFileInput}
                    disabled={isUploading || loading}
                    fullWidth
                    sx={{
                      mb: 2,
                      color: "white",
                      backgroundColor: "#8A12FC",
                      "&:hover": { backgroundColor: "#7a0eeb" },
                    }}
                  >
                    {t("bulk_upload_images", "Bulk Upload Images")}
                  </Button>

                  {bulkUploadProgress > 0 && bulkUploadProgress < 100 && (
                    <Box sx={{ width: "100%", mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{t("uploading", "Uploading...")}</span>
                        <span>{bulkUploadProgress}%</span>
                      </Box>
                      <Box
                        sx={{
                          width: "100%",
                          height: 8,
                          bgcolor: "grey.200",
                          borderRadius: 4,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${bulkUploadProgress}%`,
                            height: "100%",
                            bgcolor: "primary.main",
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </Box>
                  )}

                  {uploadedImages.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {uploadedImages.map((img, index) => (
                          <Box
                            key={index}
                            sx={{
                              position: "relative",
                              border: "5px solid #8A12FC",
                              borderRadius: 2,
                              p: 0.5,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                boxShadow: "0 0 0 2px rgba(138, 18, 252, 0.3)",
                                transform: "scale(1.02)",
                              },
                            }}
                          >
                            <Avatar
                              src={img}
                              alt={t(
                                "gallery_preview",
                                `Gallery Preview ${index + 1}`
                              )}
                              sx={{
                                width: 100,
                                height: 100,
                                boxShadow: 1,
                              }}
                              variant="rounded"
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeImage(index)}
                              sx={{
                                position: "absolute",
                                top: -12,
                                right: -12,
                                bgcolor: "#8A12FC",
                                color: "white",
                                border: "2px solid white",
                                boxShadow: 2,
                                "&:hover": {
                                  bgcolor: "#6a0bc7",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease",
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          ) : (
            <>
              <RoomNumbersTable
                editedMember={editedMember}
                setEditedMember={setEditedMember}
                handleInputChange={handleInputChange}
                handleAddRoomNumberSubmit={handleUpdateMember}
              />
            </>
          )}

          {activeTab === 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Button
                fullWidth={isMobile}
                variant="outlined"
                onClick={onClose}
                sx={{ borderRadius: "12px" }}
                disabled={loading}
                size={isMobile ? "small" : "medium"}
              >
                {t("cancel", "Cancel")}
              </Button>
              <Button
                fullWidth={isMobile}
                variant="contained"
                onClick={handleUpdateMember}
                sx={{
                  backgroundColor: "#8A12FC",
                  "&:hover": { backgroundColor: "#7a0eeb" },
                }}
                disabled={loading || isUploading}
                size={isMobile ? "small" : "medium"}
              >
                {loading
                  ? isMobile
                    ? t("saving", "Saving...")
                    : t("saving_changes", "Saving Changes...")
                  : isMobile
                  ? t("save", "Save")
                  : t("save_changes", "Save Changes")}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
