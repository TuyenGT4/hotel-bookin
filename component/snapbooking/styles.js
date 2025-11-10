import { styled } from "@mui/system";
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Skeleton,
  keyframes 
} from "@mui/material";

// Gradient animation keyframes
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Root container
export const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Header
export const Header = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 700,
}));

// Image with hover effect
export const StyledImage = styled("img")({
  width: "100%",
  height: "600px",
  objectFit: "cover",
  borderRadius: 8,
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

// Custom button
export const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
}));

// Skeleton Loading Component
// Colorful Loading Component
export const ColorfulLoader = () => (
    <RootContainer maxWidth="xl">
      {/* Animated Title Skeleton */}
      <Box textAlign="center" mb={8}>
        <Box
          sx={{
            width: 400,
            height: 70,
            mx: 'auto',
            borderRadius: 2,
            background: 'linear-gradient(270deg, #FF3CAC, #784BA0, #2B86C5)',
            backgroundSize: '600% 600%',
            animation: `${gradientAnimation} 3s ease infinite`,
          }}
        />
      </Box>
  
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Box>
            <Skeleton 
              variant="rounded" 
              height={50} 
              width="90%" 
              sx={{ 
                mb: 3,
                bgcolor: 'primary.light',
                transform: 'none', // Disables default wave animation
              }} 
            />
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                variant="text"
                height={30}
                width={i === 2 ? "80%" : "100%"}
                sx={{
                  mb: 1.5,
                  bgcolor: i % 2 ? 'secondary.light' : 'primary.light',
                }}
              />
            ))}
            <Box
              sx={{
                width: 180,
                height: 50,
                mt: 3,
                borderRadius: 1,
                background: 'linear-gradient(90deg, #FF3CAC, #2B86C5)',
                backgroundSize: '200% 200%',
                animation: `${gradientAnimation} 2s ease infinite`,
              }}
            />
          </Box>
        </Grid>
  
        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: '100%',
              height: 600,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #8A12FC, #FF3CAC, #2B86C5)',
              backgroundSize: '300% 300%',
              animation: `${gradientAnimation} 4s ease infinite`,
            }}
          />
        </Grid>
      </Grid>
    </RootContainer>
  );
// Error Component
export const ErrorMessage = ({ error }) => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="100vh"
    bgcolor="error.light"
    p={4}
  >
    <Typography variant="h6" color="error.dark">
      ⚠️ {error}
    </Typography>
  </Box>
);

// Main Title Component
export const MainTitle = () => (
  <Typography
    variant="h3"
    component="h1"
    align="center"
    gutterBottom
    sx={{
      my: 8,
      fontWeight: 900,
      background: "linear-gradient(90deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    Snap Booking ✨
  </Typography>
);