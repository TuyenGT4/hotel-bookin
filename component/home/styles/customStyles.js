export const datePickerStyles = {
  '& input[type="date"]': {
    paddingTop: "10px",
  },
};

export const selectStyles = {
  width: "100%",
  "& .MuiInputBase-root": {
    height: "56px", // Match the height of your other fields
  },
};

export const dateLabelStyles = {
  shrink: true,
  style: { color: "#333" },
};

export const buttonStyles = {
  backgroundColor: "red",
  "&:hover": {
    backgroundColor: "red",
  },
};

export const transparentBoxStyles = (isSmallScreen) => ({
  p: 2,
  borderRadius: 1,
  marginTop: isSmallScreen ? "520px" : "20px",
});

export const formContainerStyles = (isSmallScreen) => ({
  display: "flex",
  alignItems: "center",
  gap: 2,
  flexDirection: isSmallScreen ? "column" : "row",
});
