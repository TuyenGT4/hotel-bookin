import { styled } from "@mui/system";

import { Box } from "@mui/material"; // Add this import


export const selectStyles = {
  width: '100%',
  '& .MuiInputBase-root': {
    height: '56px', // Match the height of your other fields
  },
};

export const BackgroundContainer = styled("div")({
  backgroundImage: "url(/images/hotel9.jpg)",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  height: "100vh",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  opacity: 0.9,
});

export const TransparentBox = styled(Box)({
  backgroundColor: "white",
  padding: "50px",
  borderRadius: "8px",
  zIndex: 2222222222221,
  marginTop: "250px",
});

export const TransparentBoxx = styled(Box)({
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  zIndex: 2222222222221,
  color: "black",
});