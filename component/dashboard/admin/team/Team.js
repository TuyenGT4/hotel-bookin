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
import { Edit, Delete, Add } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import {
  StyledPaper,
  StyledTableHeader,
  StyledHeaderCell,
  AnimatedTableRow,
  PositionChip,
  colors,
} from "./styles";
import AddTeamModal from "./AddTeamModal";
 import EditTeamModal from "./EditTeamModal";
import DeleteTeamModal from "./DeleteTeamModal";

export default function TeamTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [openAddModal, setOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${process.env.API}/admin/team`);

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      toast.error("Failed to fetch team member");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (employee) => {
    setCurrentMember(employee);
    setOpenDeleteModal(true);
  };

  const handleEditClick = (employee) => {
    setCurrentMember(employee);
    setOpenEditModal(true);
  };

  const handleEditSuccess = (updatedMember) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp._id === updatedMember._id ? updatedMember : emp))
    );

    setOpenEditModal(false);
  };

  const handleAddSuccess = (newMember) => {
    setEmployees((prev) => [...prev, newMember]);
    setOpenAddModal(false);
  };

  const handleDeleteSuccess = (deletedId) => {
    setEmployees((prev) => prev.filter((emp) => emp._id !== deletedId));
    setOpenDeleteModal(false);
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
            Add Team Member
          </Button>
        </Box>

        <TableContainer
          sx={{
            maxHeight: "70vh",
            borderRadius: "12px",
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(102,126,234,0.5)",
              borderRadius: "4px",
            },
          }}
        >
          <Table
            stickyHeader
            aria-label="modern employee table"
            size={isSmallScreen ? "small" : "medium"}
          >
            <StyledTableHeader>
              <TableRow>
                {!isSmallScreen && <StyledHeaderCell>Profile</StyledHeaderCell>}
                <StyledHeaderCell>Name</StyledHeaderCell>
                <StyledHeaderCell>Position</StyledHeaderCell>
                <StyledHeaderCell>Actions</StyledHeaderCell>
              </TableRow>
            </StyledTableHeader>
            <TableBody>
              {employees &&
                employees
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((employee) => (
                    <AnimatedTableRow
                      key={employee?._id}
                      hover
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {!isSmallScreen && (
                        <TableCell>
                          <Avatar
                            src={employee.image}
                            alt={employee.name}
                            sx={{
                              width: 56,
                              height: 56,
                              border: "3px solid white",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell
                        sx={{
                          fontWeight: "700",
                          color: "#2d3748",
                          fontSize: isSmallScreen ? "14px" : "16px",
                          padding: isSmallScreen ? "8px" : "16px",
                        }}
                      >
                        {employee.name}
                      </TableCell>
                      <TableCell>
                        <PositionChip
                          position={employee.position}
                          label={
                            isSmallScreen
                              ? employee.position.split(" ").pop()
                              : employee.position
                          }
                        />
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
                              onClick={() => handleEditClick(employee)}
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
                              onClick={() => handleDeleteClick(employee)}
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
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={isSmallScreen ? [5, 10] : [5, 10, 25]}
          component="div"
          count={employees?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                color: "#4a5568",
                fontWeight: "600",
                fontSize: isSmallScreen ? "12px" : "14px",
              },
            "& .MuiSvgIcon-root": {
              color: "#667eea",
            },
          }}
        />
      </StyledPaper>

      <AddTeamModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleAddSuccess}
        loading={loading}
        setLoading={setLoading}
      />

      <EditTeamModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        member={currentMember}
        onSuccess={handleEditSuccess}
        loading={loading}
        setLoading={setLoading}
      />

      <DeleteTeamModal
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
