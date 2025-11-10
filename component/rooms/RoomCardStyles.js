import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const RoomCardContainer = styled(Box)({
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'row',
    '@media (max-width: 600px)': {
        flexDirection: 'column',
    },
});

export const RoomImage = styled('img')({
    width: '55%',
    height: 'auto',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
    },
    '@media (max-width: 600px)': {
        width: '100%',
    },
});

export const RoomContent = styled(Box)({
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
});

export const RoomDetails = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    '@media (max-width: 600px)': {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
});