import { styled } from "@mui/material/styles";
import { 
  Paper, 
  TableCell, 
  Button, 
  Typography, 
  Box,
  TablePagination
} from "@mui/material";

export const ModernTableContainer = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
}));

export const ModernTableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  background: theme.palette.grey[50],
  color: theme.palette.text.secondary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontSize: "0.875rem",
  padding: "12px 16px",
}));

export const ModernTableBodyCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: "12px 16px",
  fontSize: "0.875rem",
}));

export const StatusBadge = styled(Typography)(({ theme, status }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "capitalize",
  backgroundColor:
    status === "Pending"
      ? theme.palette.warning.light + "22"
      : theme.palette.success.light + "22",
  color:
    status === "Pending"
      ? theme.palette.warning.dark
      : theme.palette.success.dark,
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  padding: "6px 12px",
  fontSize: "0.75rem",
  boxShadow: "none",
  "&:hover": {
    boxShadow: "none",
  },
}));

export const DatePill = styled(Typography)(({ theme, type }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "0.75rem",
  fontWeight: 500,
  backgroundColor:
    type === "checkIn"
      ? theme.palette.primary.light + "22"
      : theme.palette.secondary.light + "22",
  color:
    type === "checkIn"
      ? theme.palette.primary.dark
      : theme.palette.secondary.dark,
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: "white",
  fontSize: "1.25rem",
}));

export const ResponsiveWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
}));

export const MobileBookingCard = styled(Paper)(({ theme }) => ({
  padding: "16px",
  marginBottom: "12px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  "& > div": {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    "& > span:first-of-type": {
      fontWeight: 500,
      color: theme.palette.text.secondary,
    },
  },
}));

export const ModernPagination = styled(TablePagination)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
    fontSize: "0.8rem",
  },
}));


export const MobileActionContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
  paddingTop: '8px',
});