"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  ModernTableContainer,
  ModernTableHeaderCell,
  ModernTableBodyCell,
  StatusBadge,
  ActionButton,
  DatePill,
  SectionTitle,
  ResponsiveWrapper,
  MobileBookingCard,
  ModernPagination,
  MobileActionContainer,
} from "./bookingTableStyles";
import EditBookingModal from "./EditBookingModal";
import { toast } from "react-toastify";

const formatDate = (dateString) => {
  if (!dateString) return " ";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

const getPaymentStatus = (paymentStatus) => {
  return paymentStatus === "1" ? "Paid" : "Pending";
};

const getStatusBadge = (status) => {
  switch (status) {
    case "active":
      return "Confirmed";

    case "inactive":
      return "Pending";
    case "cancelled":
      return "Cancelled";

    default:
      return status;
  }
};

const BookingTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEI] = useState(null);

  const [page, setPage] = useState(0);
  const [currentBooking, setCurrentBooking] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditBooking, setCurrentEditBooking] = useState(null);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [bookings, setBookings] = useState([]);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const headers = [
    "SI",
    "Booking Code ",
    "Booking Date",
    "Customer",
    "Check IN/Out",
    "Total Rooms ",
    "Guests",
    "Payment",
    "Status",
    "Action",
  ];

  const paginatedBookings = bookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${process.env.API}/admin/booking`);
        if (!response.ok) {
          throw new Error("failed to fetch bookingd");
        }

        const data = await response.json();

        setBookings(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));

    setPage(0);
  };

  const handleMenuOpen = (event, booking) => {
    setAnchorEI(event.currentTarget);
    setCurrentBooking(booking);
  };

  const handleMobileMenuOpen = (event, booking) => {
    setMobileMenuAnchorEl(event.currentTarget);
    setCurrentBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEI(null);
    setMobileMenuAnchorEl(null);

    setCurrentBooking(null);
  };

  const handleEditClick = (booking) => {
    setCurrentEditBooking(booking);

    setEditModalOpen(true);
  };

  const handleSaveBooking = async (updatedBooking) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/booking/${updatedBooking._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedBooking),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error("Failed to update booking");
      }

      if (data?.success) {
        toast.success(data?.message);
      }

      setBookings(
        bookings.map((b) => (b._id === updatedBooking._id ? updatedBooking : b))
      );
    } catch (error) {
      console.log("error updating booking", err);
    }
  };

  if (loading) {
    return (
      <ResponsiveWrapper>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      </ResponsiveWrapper>
    );
  }

  if (error) {
    return (
      <ResponsiveWrapper>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <p>Error: {error}</p>
        </Box>
      </ResponsiveWrapper>
    );
  }

  if (isMobile) {
    return (
      <>
        <ResponsiveWrapper>
          {paginatedBookings.length > 0 ? (
            paginatedBookings.map((booking, index) => (
              <MobileBookingCard key={booking._id}>
                <div>
                  <span>Sl</span>
                  <span>{page * rowsPerPage + index + 1}</span>
                </div>
                <div>
                  <span>Booking Code</span>
                  <span>{booking.code}</span>
                </div>
                <div>
                  <span>Booking Date</span>
                  <span>{formatDate(booking.createdAt)}</span>
                </div>
                <div>
                  <span>Customer</span>
                  <span>{booking.name}</span>
                </div>
                <div>
                  <span>Check IN/Out</span>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <DatePill type="checkIn">
                      {formatDate(booking.check_in)}
                    </DatePill>
                    <DatePill type="checkOut">
                      {formatDate(booking.check_out)}
                    </DatePill>
                  </Box>
                </div>
                <div>
                  <span>Total Rooms</span>
                  <span>{booking.number_of_rooms}</span>
                </div>
                <div>
                  <span>Guests</span>
                  <span>{booking.person}</span>
                </div>
                <div>
                  <span>Payment</span>
                  <StatusBadge
                    status={getPaymentStatus(booking.payment_status)}
                  >
                    {getPaymentStatus(booking.payment_status)}
                  </StatusBadge>
                </div>
                <div>
                  <span>Status</span>
                  <StatusBadge status={booking.status}>
                    {getStatusBadge(booking.status)}
                  </StatusBadge>
                </div>
                <MobileActionContainer>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMobileMenuOpen(e, booking)}
                    sx={{ ml: "auto" }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={mobileMenuAnchorEl}
                    open={
                      Boolean(mobileMenuAnchorEl) &&
                      currentBooking?._id === booking._id
                    }
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleEditClick(booking);
                        handleMenuClose();
                      }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                  </Menu>
                </MobileActionContainer>
              </MobileBookingCard>
            ))
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <p>No bookings found</p>
            </Box>
          )}

          <ModernPagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={bookings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ResponsiveWrapper>

        <EditBookingModal
          booking={currentEditBooking}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveBooking}
        />
      </>
    );
  }

  return (
    <>
      <ResponsiveWrapper>
        <SectionTitle variant="h6">Booking List</SectionTitle>
        <ModernTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <ModernTableHeaderCell key={index}>
                    {header}
                  </ModernTableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking, index) => (
                  <TableRow key={booking._id} hover>
                    <ModernTableBodyCell>
                      {page * rowsPerPage + index + 1}
                    </ModernTableBodyCell>
                    <ModernTableBodyCell>{booking.code}</ModernTableBodyCell>
                    <ModernTableBodyCell>
                      {formatDate(booking.createdAt)}
                    </ModernTableBodyCell>
                    <ModernTableBodyCell>{booking.name}</ModernTableBodyCell>
                    <ModernTableBodyCell>
                      <Box display="flex" gap={1} flexDirection="column">
                        <DatePill type="checkIn">
                          {formatDate(booking.check_in)}
                        </DatePill>
                        <DatePill type="checkOut">
                          {formatDate(booking.check_out)}
                        </DatePill>
                      </Box>
                    </ModernTableBodyCell>
                    <ModernTableBodyCell>
                      {booking.number_of_rooms}
                    </ModernTableBodyCell>
                    <ModernTableBodyCell>{booking.person}</ModernTableBodyCell>
                    <ModernTableBodyCell>
                      <StatusBadge
                        status={getPaymentStatus(booking.payment_status)}
                      >
                        {getPaymentStatus(booking.payment_status)}
                      </StatusBadge>
                    </ModernTableBodyCell>
                    <ModernTableBodyCell>
                      <StatusBadge status={booking.status}>
                        {getStatusBadge(booking.status)}
                      </StatusBadge>
                    </ModernTableBodyCell>
                    <ModernTableBodyCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, booking)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={
                          Boolean(anchorEl) &&
                          currentBooking?._id === booking._id
                        }
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            handleEditClick(booking);
                            handleMenuClose();
                          }}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                      </Menu>
                    </ModernTableBodyCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <ModernTableBodyCell colSpan={headers.length} align="center">
                    No bookings found
                  </ModernTableBodyCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ModernPagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={bookings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ModernTableContainer>
      </ResponsiveWrapper>


        <EditBookingModal
          booking={currentEditBooking}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveBooking}
        />
    </>
  );
};

export default BookingTable;
