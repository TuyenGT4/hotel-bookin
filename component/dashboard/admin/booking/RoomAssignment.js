"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import { toast } from "react-toastify";

const RoomAssignment = ({ booking }) => {
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [currentRoom, setCurrentRoom] = useState(null);

  const [availableRooms, setAvailableRooms] = useState([]);

  const [selectedRoom, setSelectedRoom] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  const fetchAssignedRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API}/admin/roomsnumber/getrooms/${booking._id}`
      );

      if (!response.ok) {
        throw new Error("FAILED TO FETCH ROOMS");
      }

      const data = await response.json();

      setRooms(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const queryParams = new URLSearchParams({
        roomId: booking?.rooms_id?._id,
        roomType: booking?.rooms_id?.roomtype_id?._id,
      }).toString();

      const response = await fetch(
        `${process.env.API}/admin/roomsnumber/available/${queryParams}`
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error || "Failed  to fetch available rooms");
      }

      const data = await response.json();
      setAvailableRooms(data);
    } catch (error) {
      console.log("error fetching available rooms", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (booking?._id) {
      fetchAssignedRooms();
    }
  }, [booking]);

  const handleOpenDialog = (room = null) => {
    setCurrentRoom(room);
    fetchAvailableRooms();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentRoom(null);
    setSelectedRoom("");
  };

  const handleAssignRoom = async () => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/roomsnumber/assignroom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "applivation/json",
          },

          body: JSON.stringify({
            bookingId: booking._id,
            roomsId: booking?.rooms_id?._id,
            roomNumber: selectedRoom,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.message);
      } else {
        toast.success(data?.message);
      }

      fetchAssignedRooms();
      handleCloseDialog();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      const queryParams = new URLSearchParams({
        bookingId: booking?._id,
        roomsId: booking?.rooms_id?._id,
        roomNumber: roomId,
      }).toString();

      const response = await fetch(
        `${process.env.API}/admin/roomsnumber/remove/${queryParams}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error("Failed to  delete room");
      } else {
        toast.success(data?.message);
      }
      fetchAssignedRooms();
    } catch (error) {
      setError(error.message);
    }
  };



   if(!booking)  return null

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          Room Assignments
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          disabled={rooms.length >= booking.number_of_rooms}
        >
          Assign Room
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room Number</TableCell>
                <TableCell>Room Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <TableRow key={room._id}>
                    <TableCell>{room.room_number_id?.room_no}</TableCell>
                    <TableCell>{booking.rooms_id.roomtype_id.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={room.status || "Assigned"}
                        color={
                          room.status === "Occupied" ? "success" : "default"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenDialog(room)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteRoom(room._id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No rooms assigned yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Assign/Edit Room Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {currentRoom ? "Edit Room Assignment" : "Assign New Room"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, minWidth: 300 }}>
            <TextField
              select
              label="Select Room"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              fullWidth
            >
              {availableRooms.map((room) => (
                <MenuItem key={room._id} value={room._id}>
                  {room?.room_no}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAssignRoom}
            disabled={!selectedRoom}
            variant="contained"
          >
            {currentRoom ? "Update" : "Assign"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomAssignment;
