import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  BackgroundContainer,
  TransparentBox,
  TransparentBoxx,
} from "@/component/home/styles/backgroundStyles";
import {
  datePickerStyles,
  dateLabelStyles,
  buttonStyles,
  transparentBoxStyles,
  formContainerStyles,
  selectStyles,
} from "@/component/home/styles/customStyles";
import { useTranslation } from "react-i18next";

export default function Home() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const { t } = useTranslation("component/home/home");

  // State to store form values
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
  });

  const [errors, setErrors] = useState({
    checkInDate: false,
    checkOutDate: false,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  // Handle select changes specifically
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value), // Ensure we store as number
    }));
  };

  // Format date for display and comparison
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Handle form submission
  const handleCheckAvailability = () => {
    let hasErrors = false;
    const newErrors = { checkInDate: false, checkOutDate: false };

    if (!formData.checkInDate) {
      newErrors.checkInDate = true;
      hasErrors = true;
    }

    if (!formData.checkOutDate) {
      newErrors.checkOutDate = true;
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      alert(t("fill_required_fields", "Please fill all required fields"));
      return;
    }

    const checkIn = formatDate(formData.checkInDate);
    const checkOut = formatDate(formData.checkOutDate);

    // Additional validation: check-out must be after check-in
    if (new Date(checkOut) <= new Date(checkIn)) {
      alert(
        t(
          "checkout_after_checkin",
          "Check-out date must be after check-in date"
        )
      );
      setErrors((prev) => ({
        ...prev,
        checkOutDate: true,
      }));
      return;
    }

    router.push(
      `/allrooms?checkIn=${checkIn}&checkOut=${checkOut}&guests=${formData.guests}`
    );
  };

  // Options for guests dropdown
  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Calculate minimum checkout date (checkin date or today)
  const minCheckoutDate =
    formData.checkInDate || new Date().toISOString().split("T")[0];

  return (
    <BackgroundContainer
      sx={{ marginBottom: isSmallScreen ? "300px" : "20px" }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <TransparentBoxx sx={transparentBoxStyles(isSmallScreen)}>
              <Typography variant="h4" component="h1">
                {t("listify_title", "Listify: Discover, Compare, and Choose")}
              </Typography>
              <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                {t(
                  "listify_subtitle",
                  "Your Ultimate Guide to Finding the Best Products, Services, and Deals Online"
                )}
              </Typography>
            </TransparentBoxx>
          </Grid>

          <Grid item xs={12} md={8}>
            <TransparentBox sx={{ p: 2, borderRadius: 1 }}>
              <Box sx={formContainerStyles(isSmallScreen)}>
                {/* Check-in Date */}
                <TextField
                  id="checkInDate"
                  name="checkInDate"
                  label={t("checkin_date", "Check-in Date")}
                  type="date"
                  sx={datePickerStyles}
                  InputLabelProps={{
                    shrink: true,
                    ...dateLabelStyles,
                  }}
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  inputProps={{
                    min: new Date().toISOString().split("T")[0],
                  }}
                  error={errors.checkInDate}
                  helperText={
                    errors.checkInDate
                      ? t("select_checkin", "Please select check-in date")
                      : ""
                  }
                  fullWidth
                />

                {/* Check-out Date */}
                <TextField
                  id="checkOutDate"
                  name="checkOutDate"
                  label={t("checkout_date", "Check-out Date")}
                  type="date"
                  sx={datePickerStyles}
                  InputLabelProps={{
                    shrink: true,
                    ...dateLabelStyles,
                  }}
                  value={formData.checkOutDate}
                  onChange={handleInputChange}
                  inputProps={{
                    min: minCheckoutDate,
                  }}
                  error={errors.checkOutDate}
                  helperText={
                    errors.checkOutDate
                      ? t("select_checkout", "Please select check-out date")
                      : ""
                  }
                  fullWidth
                />

                {/* Guests Select - Fixed with proper handler */}
                <FormControl sx={selectStyles} fullWidth>
                  <InputLabel id="guests-label">
                    {t("num_guests", "Number of Guests")}
                  </InputLabel>
                  <Select
                    labelId="guests-label"
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    label={t("num_guests", "Number of Guests")}
                    onChange={handleSelectChange}
                  >
                    {guestOptions.map((number) => (
                      <MenuItem key={number} value={number}>
                        {number}{" "}
                        {number === 1
                          ? t("guest", "Guest")
                          : t("guests", "Guests")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  sx={buttonStyles}
                  onClick={handleCheckAvailability}
                  fullWidth
                >
                  {t("check_availability", "Check Availability")}
                </Button>
              </Box>
            </TransparentBox>
          </Grid>
        </Grid>
      </Container>
    </BackgroundContainer>
  );
}
