import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { toast } from "react-toastify";

import { textFieldStyles } from "./styles";

const RoomNumbersTable = ({
  setEditedMember,
  editedMember,
  handleInputChange,
  handleAddRoomNumberSubmit,
}) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [roomToDelete, setRoomToDelete] = useState(null);

  const handleOpenEditModal = (room) => {
    setCurrentRoom(room);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setCurrentRoom(null);
  };

  const handleSaveRoom = async () => {
    const response = await fetch(
      `${process.env.API}/admin/room/roomno/${currentRoom._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentRoom),
      }
    );

    const updatedRooms = editedMember.room_numbers.map((room) =>
      room._id === currentRoom._id ? currentRoom : room
    );

    setEditedMember({
      ...editedMember,
      room_numbers: updatedRooms,
    });

    toast.success("room no  updated successfully");

    handleCloseEditModal();
  };

  const handleRoomChange = (e) => {
    setCurrentRoom({
      ...currentRoom,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenDeleteConfirm = (room) => {
    setRoomToDelete(room);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setRoomToDelete(null);
  };

  const handleConfirmDelete = async () => {
    const resposne = await fetch(
      `${process.env.API}/admin/room/roomno/${roomToDelete?._id}`,
      {
        method: "DELETE",
      }
    );

    const updatedRooms = editedMember.room_numbers.filter(
      (room) => room._id !== roomToDelete._id
    );

    setEditedMember({
      ...editedMember,
      room_numbers: updatedRooms,
    });
      handleCloseDeleteConfirm();
  };

  return (
    <div>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Room Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editedMember.room_numbers?.map((room) => (
              <TableRow key={room._id || room.roomNumber}>
                <TableCell>{room.room_no}</TableCell>
                <TableCell>
                  {room.status === 1 ? "Active" : "Inactive"}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEditModal(room)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteConfirm(room)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Room Modal */}
      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Edit Room</h2>

          {currentRoom && (
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Room Number"
                name="room_no"
                value={currentRoom.room_no || ""}
                onChange={handleRoomChange}
                variant="outlined"
                size="small"
                {...textFieldStyles} // Spread the styles here
              />

              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={currentRoom.status || 0}
                  onChange={handleRoomChange}
                  label="Status"
                >
                  <MenuItem value={0}>Inactive</MenuItem>
                  <MenuItem value={1}>Active</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button onClick={handleCloseEditModal} sx={{ mr: 2 }}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSaveRoom}>
                  Save
                </Button>
              </Box>
            </Stack>
          )}
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Confirm Delete</h2>
          <p>
            Are you sure you want to delete room {roomToDelete?.roomNumber}?
          </p>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={handleCloseDeleteConfirm} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Add New Room Section */}
      <Box sx={{ mt: 3 }}>
        <h3>Add New Room Number</h3>
        <input
          type="hidden"
          name="room_id"
          value={editedMember.room_id || ""}
        />
        <input
          type="hidden"
          name="room_type_id"
          value={editedMember.roomtype_id || ""}
        />
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Room Number"
            name="roomNumber"
            value={editedMember.roomNumber}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
            {...textFieldStyles} // Spread the styles here
          />
        </Stack>

        <FormControl fullWidth size="small" sx={{ mt: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={editedMember.status}
            onChange={handleInputChange}
            label="Status"
          >
            <MenuItem value={0}>Inactive</MenuItem>
            <MenuItem value={1}>Active</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => {
            if (editedMember.roomNumber) {
              const newRoom = {
                _id: Date.now().toString(), // temporary ID
                roomNumber: editedMember.roomNumber,
                status: editedMember.status,
              };

              setEditedMember({
                ...editedMember,
                room_numbers: [...(editedMember.room_numbers || []), newRoom],
                roomNumber: "",
                status: 0,
              });

              handleAddRoomNumberSubmit();
            }
          }}
        >
          Add Room
        </Button>
      </Box>
    </div>
  );
};

export default RoomNumbersTable;
