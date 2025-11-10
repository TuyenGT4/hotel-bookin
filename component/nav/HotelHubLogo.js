// components/XpointLogo.js
import { Box, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/system";

// Hiệu ứng ánh sáng nhẹ
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const subtlePulse = keyframes`
  0% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.02); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
`;

const StyledTypography = styled(Typography)(() => ({
  background: "linear-gradient(90deg, #C5A253, #F5E6A1, #C5A253)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundSize: "200% auto",
  fontSize: "1.8rem",
  fontFamily: "'Playfair Display', serif",
  letterSpacing: "2px",
  fontWeight: 600,
  marginRight: "2px",
  animation: `${shimmer} 5s linear infinite, ${subtlePulse} 4s ease-in-out infinite`,
  textShadow: "0 0 8px rgba(245, 230, 161, 0.25)",
  userSelect: "none",
}));

const XpointLogo = () => {
  const logoText = "Serenova";

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      {logoText.split("").map((char, index) => (
        <StyledTypography key={index}>{char}</StyledTypography>
      ))}
    </Box>
  );
};

export default XpointLogo;
