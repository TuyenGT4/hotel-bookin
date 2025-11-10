import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Avatar,
  IconButton,
  Tooltip,
  useMediaQuery,
  Box,
  Button,
} from "@mui/material";
import { Edit, Delete, Add, Preview } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";

import {
  StyledPaper,
  StyledTableHeader,
  StyledHeaderCell,
  AnimatedTableRow,
  PositionChip,
  colors,
  textFieldStyles,
} from "./styles";

import AddManageRoomCategoriesModal from "./AddManageRoomCategoriesModal";
import EditManageRoomCategoriesModal from "./EditManageRoomCategoriesModal";
import DeleteManageCategoriesModal from "./DeleteManageCategoriesModal";

export default function ManageRoomCategoriesTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [roomtype, setRoomType] = useState([]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchroomtype();
    fetchRooms();
  }, []);

  const fetchroomtype = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.API}/admin/roomtype`);

      const data = await response.json();

      setRoomType(data);
    } catch (error) {
      toast.error("failed to fetch rom tpye");
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${process.env.API}/admin/room`);
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      toast.error("Failed to  fetch rooms");
    }
  };

  const getRoomForRoomType = (roomtypeId) => {
    return rooms.find((room) => room.roomtype_id?._id === roomtypeId);
  };

  const handleAddSuccess = (newroomtype) => {
    setRoomType((prev) => [...prev, newroomtype]);
    setOpenAddModal(false);
  };

  const handleEditSuccess = (updatedrooms) => {
    setRoomType((prev) =>
      prev.map((emp) => (emp._id === updatedrooms._id ? updatedrooms : emp))
    );

    setOpenEditModal(false);
  };

  const handleDeleteClick = (rooms) => {
    // const roomData = getRoomForRoomType(rooms._id);
    setCurrentMember(rooms);
    setOpenDeleteModal(true);
  };

  const handleDeleteSuccess = () => {
    fetchroomtype();
    setOpenDeleteModal(false);
  };

  const handleEditClick = (rooms) => {
    const roomData = getRoomForRoomType(rooms._id);

    setCurrentMember(roomData);
    setOpenEditModal(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <StyledPaper sx={{ width: "100%", p: isSmallScreen ? 1 : 3 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddModal(true)}
            sx={{
              backgroundColor: "#8A12FC",
              "&:hover": { backgroundColor: "#7a0eeb" },
            }}
            disabled={loading}
          >
            Add Room Category
          </Button>
        </Box>

        <TableContainer sx={{ maxHeight: "70vh", borderRadius: "12px" }}>
          <Table stickyHeader size={isSmallScreen ? "small" : "medium"}>
            <StyledTableHeader>
              <TableRow>
                {!isSmallScreen && <StyledHeaderCell>Image</StyledHeaderCell>}
                <StyledHeaderCell>Name</StyledHeaderCell>

                <StyledHeaderCell>Actions</StyledHeaderCell>
              </TableRow>
            </StyledTableHeader>
            <TableBody>
              {roomtype &&
                roomtype
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((rooms, index) => { 

                     const  room=getRoomForRoomType(rooms?._id)
                     return (

 <AnimatedTableRow
                      key={rooms?._id || `rooms-${index}`}
                      hover
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {!isSmallScreen && (
                        <TableCell>
                          <Avatar
                            src={room?.image}
                            alt="room"
                            sx={{
                              width: 56,
                              height: 56,
                              border: "3px solid white",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell sx={{ fontWeight: "700", color: "#2d3748" }}>
                        {room?.roomtype_id?.name || "N/A"}
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            gap: isSmallScreen ? "4px" : "8px",
                          }}
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleEditClick(rooms)}
                              sx={{ color: colors.edit }}
                              size={isSmallScreen ? "small" : "medium"}
                              disabled={loading}
                            >
                              <Edit
                                fontSize={isSmallScreen ? "small" : "medium"}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDeleteClick(rooms)}
                              sx={{ color: colors.delete }}
                              size={isSmallScreen ? "small" : "medium"}
                              disabled={loading}
                            >
                              <Delete
                                fontSize={isSmallScreen ? "small" : "medium"}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </AnimatedTableRow>


                     )


                  })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={isSmallScreen ? [5, 10] : [5, 10, 25]}
          component="div"
          count={roomtype.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledPaper>

      {/* Modals - Make sure they can handle the roomData prop */}
      <AddManageRoomCategoriesModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleAddSuccess}
        loading={loading}
        setLoading={setLoading}
      />

      <EditManageRoomCategoriesModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        member={currentMember}
        onSuccess={handleEditSuccess}
        loading={loading}
        setLoading={setLoading}
 fetchRooms={fetchRooms}
      />

      <DeleteManageCategoriesModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        member={currentMember}
        onSuccess={handleDeleteSuccess}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
}
