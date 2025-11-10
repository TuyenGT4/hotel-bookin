import { styled } from "@mui/material/styles";
import { Paper, TableHead, TableCell, TableRow, Chip } from "@mui/material";
import { motion } from "framer-motion";

// Vibrant color palette
export const colors = {
  headerBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  rowHover: "linear-gradient(90deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)",
  engineer: "#4caf50",
  designer: "#2196f3",
  manager: "#ff9800",
  executive: "#f44336",
  other: "#9c27b0",
  liked: "#e91e63",
  edit: "#3f51b5",
  delete: "#ff5252",
  addButton: "#667eea",
};

// Modal style
export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
};

// Styled components
export const StyledPaper = styled(Paper)({
  background: "linear-gradient(45deg, #f5f7fa 0%, #e0e5f0 100%)",
  borderRadius: "16px",
  boxShadow: "0 12px 40px rgba(102, 126, 234, 0.2)",
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.3)",
});

export const StyledTableHeader = styled(TableHead)({
  background: colors.headerBg,
});

export const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  color: "white !important",
  fontWeight: "800 !important",
  fontSize: theme.breakpoints.down("sm") ? "12px !important" : "16px !important",
  fontFamily: '"Poppins", sans-serif !important',
  textTransform: "uppercase",
  letterSpacing: "1px",
  padding: theme.breakpoints.down("sm") ? "8px !important" : "16px !important",
}));

export const AnimatedTableRow = motion(
  styled(TableRow)({
    background: "transparent",
    transition: "all 0.3s ease",
    "&:hover": {
      background: colors.rowHover,
      transform: "translateY(-2px)",
      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
    },
    "&:nth-of-type(odd)": {
      background: "rgba(245, 247, 250, 0.6)",
    },
  })
);

export const PositionChip = styled(Chip)(({ position, theme }) => {
  let bgColor;
  if (position.includes("Engineer")) bgColor = colors.engineer;
  else if (position.includes("Designer")) bgColor = colors.designer;
  else if (position.includes("Manager") || position.includes("Lead"))
    bgColor = colors.manager;
  else if (position.includes("CEO") || position.includes("CTO"))
    bgColor = colors.executive;
  else bgColor = colors.other;

  return {
    backgroundColor: bgColor,
    color: "white !important",
    fontWeight: "700",
    fontSize: theme.breakpoints.down("sm") ? "10px" : "12px",
    padding: "4px 8px",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    height: theme.breakpoints.down("sm") ? "24px" : "auto",
  };
});