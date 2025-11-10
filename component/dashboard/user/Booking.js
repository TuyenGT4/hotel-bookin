"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Chip,
  Box,
} from "@mui/material";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.API}/user/booking`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("error", err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";

      case "cancelled":
        return "error";

      default:
        return "default";
    }
  };

  const getPaymentColor = (method) => {
    return method === "paid" ? "success" : "secondary";
  };

  const rowColors = ["#fff0f5", "#f0fff4", "#f0f8ff", "#fffaf0", "#f5f5dc"];

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mt: 3,
          mb: 2,
          fontWeight: "bold",
          background: "linear-gradient(to right, #ec4899, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        🌟 My Bookings
      </Typography>

      {loading ? (
        <Box>
          {[1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              variant="rectangular"
              height={60}
              sx={{ mb: 2, borderRadius: 2 }}
            />
          ))}
        </Box>
      ) : bookings.length === 0 ? (
        <Typography>No bookings found.</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: "linear-gradient(to right, #06b6d4, #3b82f6)",
                }}
              >
                {[
                  "Check In",
                  "Check Out",
                  "Name",
                  "Rooms",
                  "Total Price",
                  "Status",
                  "Payment",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking, index) => (
                <TableRow
                  key={booking._id}
                  sx={{
                    backgroundColor: rowColors[index % rowColors.length],
                    "&:hover": {
                      backgroundColor: "#e0f7fa",
                      transform: "scale(1.01)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <TableCell>{booking.check_in}</TableCell>
                  <TableCell>{booking.check_out}</TableCell>
                  <TableCell>{booking.name}</TableCell>
                  <TableCell>{booking.number_of_rooms}</TableCell>
                  <TableCell>
                    <strong style={{ color: "#16a34a" }}>
                      ${booking.total_price.toFixed(2)}
                    </strong>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={getStatusColor(booking.status)}
                      variant="filled"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.payment_method}
                      color={getPaymentColor(booking.payment_method)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
