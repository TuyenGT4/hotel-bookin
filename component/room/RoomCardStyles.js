import { styled } from '@mui/system';



import { Card, CardMedia, Box, Typography } from '@mui/material';

export const StyledCard = styled(Card)({
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
  }
});

export const StyledCardMedia = styled(CardMedia)({
  transition: 'transform 0.3s',
  filter: 'brightness(0.95)',
  '&:hover': {
    filter: 'brightness(1)',
    transform: 'scale(1.05)'
  }
});

export const DiscountBadge = styled(Box)({
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: '#f44336',
  color: 'white',
  padding: '4px 12px',
  borderRadius: 4,
  fontSize: '0.8rem',
  fontWeight: 'bold'
});

export const QuickViewOverlay = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: 'white',
  textAlign: 'center',
  padding: '8px 0',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 1
  }
});

export const FeatureChip = styled(Box)({
  padding: '4px 8px',
  backgroundColor: '#f5f5f5',
  borderRadius: 4,
  fontSize: '0.75rem'
});

export const BookNowText = styled(Typography)({
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  color: '#1976d2',
  '&:hover': {
    textDecoration: 'underline'
  }
});