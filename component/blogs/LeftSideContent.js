import { Box, Grid, Typography, IconButton } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';

export const LeftSideContent = ({  

  title,
            description,
            image,
            views,
            postedDate,

 }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box
          component="img"
          src={image}
          alt="Main"
          sx={{
            width: 800,
            height: 400,
            marginRight: '10px',
            objectFit: 'cover',
            borderRadius: '4px',
          }}
        />
      </Grid>
      
      <Grid item xs={12} container spacing={2}>
        <Grid item style={{ display: 'flex' }}>
          <IconButton aria-label="Verified">
            <VerifiedUserIcon style={{ color: '#ff531a' }} />
          </IconButton>
          <Typography variant="body2" sx={{ marginTop: 1 }}>Verified</Typography>
        </Grid>
        <Grid item style={{ display: 'flex' }}>
          <IconButton aria-label="Add to Favorites">
            <FavoriteIcon style={{ color: '#ff531a' }} />
          </IconButton>
          <Typography variant="body2" sx={{ marginTop: 1 }}>Add to Favorites</Typography>
        </Grid>
        <Grid item style={{ display: 'flex' }}>
          <IconButton aria-label="Views">
            <VisibilityIcon style={{ color: '#ff531a' }} />
          </IconButton>
          <Typography variant="body2" sx={{ marginTop: 1 }}>100 views</Typography>
        </Grid>
        <Grid item style={{ display: 'flex' }}>
          <Typography variant="body2" sx={{ marginTop: 1 }}>open</Typography>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>

    <Grid item xs={12}>
  <Typography 
    variant="body1"
    sx={{
      whiteSpace: 'pre-line', // Preserves line breaks
      lineHeight: 1.6, // Better readability
      mb: 3, // Bottom margin
      textAlign: 'justify', // Clean alignment
    }}
  >
    {description}
  </Typography>
</Grid>
      <Grid item xs={12}>
        <Typography variant="body1">Login to leave a comment.</Typography>
      </Grid>
    </Grid>
  );
};