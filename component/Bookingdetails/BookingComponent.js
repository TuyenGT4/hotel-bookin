// components/BookingComponent.js
"use client";

import { useState, useEffect } from "react";

import {
  Container,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  ListItemIcon,
  Alert,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { Paper, Chip, Divider, Rating } from "@mui/material";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import SeaViewIcon from "@mui/icons-material/BeachAccess";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HotelIcon from "@mui/icons-material/Hotel";
import SendIcon from "@mui/icons-material/Send";
import { Suspense } from "react";
import Rooms from "@/component/rooms/Rooms";
import {
  bookingStyles,
  globalStyles,
  pricingSummaryStyles,
} from "./BookingComponentStyles";
import BookingSkeletonLoader from "./BookingSkeletonLoader";
import { useSearchParams } from "next/navigation";
import { format, parseISO, isAfter } from "date-fns";
import ImageSlider from "./ImageSlider";
import { useTranslation } from "react-i18next";

const PLACEHOLDER_IMAGE = "/images/hotel17.jpg";

const BookingComponent = ({ content, loading, setLoading }) => {
  const { t } = useTranslation("component/Bookingdetails/BookingComponent");
  const searchParams = useSearchParams();
  const roomData = content?.[0];
  const originalPrice = parseFloat(roomData?.price);
  const today = new Date().toISOString().split("T")[0];
  const roomId = searchParams?.get("search") || "";
  const initialCheckIn = searchParams?.get("checkIn") || today;
  const initialCheckOut = searchParams?.get("checkOut") || "";
  const initialGuests = searchParams?.get("guests") || "1";
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [rooms, setRooms] = useState("1");
  const [dateError, setDateError] = useState(null);
  const [roomError, setRoomError] = useState(null);
  const availableRooms = roomData?.room_numbers?.length || 0;
  const isRoomAvailable = availableRooms > 0;
  const [pricingData, setPricingData] = useState({
    subtotal: 0,
    discountPercent: 0,
    discountAmount: 0,
    total: 0,
  });

  useEffect(() => {
    if (availableRooms > 0 && parseInt(rooms) > availableRooms) {
      setRoomError(t("room_limit", `Only ${availableRooms} rooms available`));
    } else {
      setRoomError(null);
    }
  }, [rooms, availableRooms, t]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const todayDate = new Date(today);
      if (checkInDate < todayDate) {
        setDateError(t("checkin_past", "Check-in date cannot be in the past"));
        return;
      }
      if (checkOutDate <= checkInDate) {
        setDateError(
          t("checkout_error", "Check-out date must be after check-in date")
        );
        return;
      }
      setDateError(null);
    }
  }, [checkIn, checkOut, today, t]);

  useEffect(() => {
    const fetchUpdatedData = async () => {
      if (!roomId || dateError || roomError) return;
      try {
        setLoading(true);
        const query = new URLSearchParams({
          roomId,
          checkIn,
          checkOut,
          guests,
          rooms,
        }).toString();
        const res = await fetch(`${process.env.API}/user/rooms/${query}`);
        const data = await res.json();
        setPricingData({
          subtotal: data.subtotal || 0,
          discountPercent: data.discountPercent || 0,
          discountAmount: data.discountAmount || 0,
          total: data.total || 0,
        });
      } catch (error) {
        console.log("Failed to fetch updated room data:", error);
      } finally {
        setLoading(false);
      }
    };
    const debounceTimer = setTimeout(fetchUpdatedData, 500);
    return () => clearTimeout(debounceTimer);
  }, [roomId, checkIn, checkOut, guests, rooms, dateError, roomError]);

  useEffect(() => {
    if (!content) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [content, setLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append("roomId", roomId);
    params.append("checkIn", checkIn);
    params.append("checkOut", checkOut);
    params.append("guests", guests);
    params.append("rooms", rooms);
    window.location.href = `/checkout?${params.toString()}`;
  };

  if (loading) {
    return <BookingSkeletonLoader />;
  }

  return (
    <Suspense
      fallback={<div>{t("loading_room", "Loading room details...")}</div>}
    >
      <Container maxWidth="xl" sx={bookingStyles.container}>
        <Grid container spacing={2} mt={5}>
          <Grid item xs={12} md={4} sx={bookingStyles.bookingFormContainer}>
            <form onSubmit={handleSubmit}>
              <Typography variant="h6" sx={bookingStyles.bookingFormTitle}>
                {t("booking_sheet", "Booking Sheet")}
              </Typography>
              <TextField
                label={t("check_in", "Check In")}
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
                inputProps={{
                  min: today,
                }}
                error={!!dateError}
              />
              <TextField
                label={t("check_out", "Check Out")}
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
                inputProps={{
                  min: checkIn || today,
                }}
                error={!!dateError}
                helperText={dateError || " "}
              />

              <TextField
                label={t("num_persons", "Number of Persons")}
                select
                fullWidth
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                margin="normal"
                error={parseInt(guests) > (roomData?.total_adult || 1)}
                helperText={
                  parseInt(guests) > (roomData?.total_adult || 1)
                    ? t(
                        "max_persons",
                        `Maximum ${roomData?.total_adult} persons allowed`
                      )
                    : " "
                }
              >
                {Array.from(
                  { length: Math.min(8, roomData?.total_adult || 8) },
                  (_, i) => i + 1
                ).map((option) => (
                  <MenuItem key={option} value={option.toString()}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label={t("num_rooms", "Number of Rooms")}
                select
                fullWidth
                value={isRoomAvailable ? rooms : "0"}
                onChange={(e) => setRooms(e.target.value)}
                margin="normal"
                disabled={!isRoomAvailable}
              >
                {isRoomAvailable ? (
                  Array.from(
                    { length: Math.min(6, availableRooms) },
                    (_, i) => i + 1
                  ).map((option) => (
                    <MenuItem key={option} value={option.toString()}>
                      {option}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="0">
                    {t("no_rooms", "No rooms available")}
                  </MenuItem>
                )}
              </TextField>

              <Box sx={{ mt: 2, mb: 2 }}>
                {isRoomAvailable ? (
                  <Typography variant="body2" color="text.secondary">
                    {t("room_availability", "Room availability")}:{" "}
                    {availableRooms}{" "}
                    {availableRooms === 1
                      ? t("room", "room")
                      : t("rooms", "rooms")}
                  </Typography>
                ) : (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {t("unavailable_rooms", "Rooms currently unavailable")}
                  </Alert>
                )}
              </Box>

              {loading ? (
                <Box sx={pricingSummaryStyles.container}>
                  <Typography sx={pricingSummaryStyles.title}>
                    {t("loading_pricing", "Loading pricing...")}
                  </Typography>
                </Box>
              ) : (
                <Box sx={pricingSummaryStyles.container}>
                  <Typography sx={pricingSummaryStyles.title}>
                    {t("pricing_summary", "Pricing Summary")}
                  </Typography>

                  <Box sx={pricingSummaryStyles.row}>
                    <Typography sx={pricingSummaryStyles.label}>
                      {t("subtotal", "Subtotal")}:
                    </Typography>
                    <Typography sx={pricingSummaryStyles.value}>
                      {pricingData.subtotal.toFixed(2)} VND
                    </Typography>
                  </Box>

                  {pricingData.discountPercent > 0 && (
                    <>
                      <Box sx={pricingSummaryStyles.row}>
                        <Typography sx={pricingSummaryStyles.label}>
                          {t("discount", "Discount")} (
                          {pricingData.discountPercent}%):
                        </Typography>
                        <Typography sx={pricingSummaryStyles.discountValue}>
                          - {pricingData.discountAmount.toFixed(2)} VND
                        </Typography>
                      </Box>
                    </>
                  )}

                  <Divider sx={pricingSummaryStyles.divider} />

                  <Box sx={pricingSummaryStyles.totalRow}>
                    <Typography sx={pricingSummaryStyles.totalLabel}>
                      {t("total", "Total")}:
                    </Typography>
                    <Typography sx={pricingSummaryStyles.totalValue}>
                      {pricingData.total.toFixed(2)} VND
                    </Typography>
                  </Box>
                </Box>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={bookingStyles.bookNowButton}
                disabled={!!dateError || !isRoomAvailable || loading}
              >
                {isRoomAvailable
                  ? t("book_now", "Book Now")
                  : t("unavailable", "Unavailable")}
              </Button>
            </form>
          </Grid>

          <Grid item xs={12} md={8}>
            <ImageSlider images={roomData?.gallery_images} />
            <Box sx={bookingStyles.roomCard}>
              <Typography
                variant="h4"
                gutterBottom
                sx={bookingStyles.roomTitle}
              >
                {roomData?.roomtype_id?.name}
              </Typography>

              <Box sx={bookingStyles.priceContainer}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t("price", "Price")}:
                </Typography>
                <Chip
                  label={`${originalPrice} VND/${t("night", "Night")}`}
                  color="primary"
                  sx={bookingStyles.originalPriceChip}
                />
              </Box>

              <Box sx={bookingStyles.descriptionBox}>
                <Typography variant="body1" sx={bookingStyles.descriptionText}>
                  {roomData?.short_desc}
                </Typography>

                <Typography
                  variant="body1"
                  sx={bookingStyles.longDescriptionText}
                >
                  {roomData?.description}
                </Typography>
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <List dense>
                    {roomData?.facilities
                      .slice(0, Math.ceil(roomData?.facilities.length / 2))
                      .map((facility, index) => (
                        <ListItem key={index} sx={bookingStyles.amenityItem}>
                          <ListItemIcon
                            sx={{ minWidth: 36, color: "primary.main" }}
                          >
                            <CheckCircleOutlineIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={facility}
                            primaryTypographyProps={{ fontWeight: 500 }}
                          />
                        </ListItem>
                      ))}
                  </List>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <List dense>
                    {roomData?.facilities
                      .slice(Math.ceil(roomData?.facilities.length / 2))
                      .map((facility, index) => (
                        <ListItem key={index} sx={bookingStyles.amenityItem}>
                          <ListItemIcon
                            sx={{ minWidth: 36, color: "primary.main" }}
                          >
                            <CheckCircleOutlineIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={facility}
                            primaryTypographyProps={{ fontWeight: 500 }}
                          />
                        </ListItem>
                      ))}
                  </List>
                </Grid>
              </Grid>

              <Box sx={bookingStyles.amenitiesContainer}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={bookingStyles.facilitiesTitle}
                >
                  {t("room_facilities", "Room Facilities")}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {roomData?.facilities.map((facility, index) => (
                    <Chip
                      key={index}
                      label={facility}
                      size="small"
                      sx={bookingStyles.facilityChip}
                    />
                  ))}
                </Box>
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={bookingStyles.detailCard}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      <Box component="span" sx={{ color: "primary.main" }}>
                        {t("room", "Room")}
                      </Box>{" "}
                      {t("details", "Details")}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PeopleOutlineIcon
                        sx={{ mr: 1, color: "primary.main" }}
                      />
                      <Typography variant="body1">
                        {t("adults", "Adults")}: {roomData?.total_adult},{" "}
                        {t("children", "Children")}: {roomData?.total_child}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <SquareFootIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        {t("size", "Size")}: {roomData?.size} m²
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={bookingStyles.detailCard}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      <Box component="span" sx={{ color: "primary.main" }}>
                        {t("view", "View")} &
                      </Box>{" "}
                      {t("bed", "Bed")}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <VisibilityIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        {t("view", "View")}: {roomData?.view}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <HotelIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="body1">
                        {t("bed_style", "Bed Style")}: {roomData?.bed_style}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={bookingStyles.reviewSection}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={bookingStyles.reviewTitle}
                >
                  {t("client_reviews", "Clients Review and Ratings")}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Rating
                    name="client-rating"
                    defaultValue={4.5}
                    precision={0.5}
                    icon={
                      <LocalHotelIcon
                        fontSize="inherit"
                        sx={{ color: "primary.main" }}
                      />
                    }
                    emptyIcon={
                      <LocalHotelIcon
                        fontSize="inherit"
                        sx={{ color: "action.disabled" }}
                      />
                    }
                  />
                  <Typography
                    variant="body2"
                    sx={{ ml: 1, color: "text.secondary" }}
                  >
                    (4.5/5 {t("from_reviews", "from 128 reviews")})
                  </Typography>
                </Box>

                <TextField
                  label={t("write_review", "Write your review here...")}
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  sx={bookingStyles.reviewTextField}
                />

                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  sx={bookingStyles.submitReviewButton}
                >
                  {t("submit_review", "Submit Review")}
                </Button>
              </Box>
            </Box>

            <style jsx global>
              {globalStyles}
            </style>
          </Grid>
        </Grid>

        <Rooms />
      </Container>
    </Suspense>
  );
};

export default BookingComponent;
