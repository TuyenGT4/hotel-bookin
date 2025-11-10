// components/Bookingdetails/ImageSlider.js
import React, { useState } from 'react';
import { Box, IconButton, useTheme, Typography } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const ImageSlider = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();

  // If no images are provided, show a placeholder
  if (!images || images.length === 0) {
    return (
      <Box 
        sx={{ 
          width: '100%', 
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.grey[200],
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Typography variant="h6" color="textSecondary">
          No images available
        </Typography>
      </Box>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        width: '100%', 
        height: '600px', 
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      {/* Main Image */}
      <Box
        component="img"
        src={images[currentIndex]}
        alt={`Gallery image ${currentIndex + 1}`}
        sx={{
          width: '100%',
           height: '600px', 
          objectFit: 'cover',
          display: 'block'
        }}
      />
      
      {/* Navigation Arrows - Only show if there are multiple images */}
      {images.length > 1 && (
        <>
          <IconButton
            onClick={prevImage}
            sx={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.3)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
              },
            }}
          >
            <KeyboardArrowLeft fontSize="large" />
          </IconButton>
          
          <IconButton
            onClick={nextImage}
            sx={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.3)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.5)',
              },
            }}
          >
            <KeyboardArrowRight fontSize="large" />
          </IconButton>
        </>
      )}
      
      {/* Dots Indicator - Only show if there are multiple images */}
      {images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? theme.palette.primary.main : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageSlider;