// components/Testimonial.js
import React from 'react';
import { Container, Box, Grid, Typography, Avatar } from '@mui/material';
import Right from "./Right"
const Testimonial = () => {
    return (

        <Container maxWidth="xl"     >

        <Box sx={{ padding: '2rem', textAlign: 'center' }}>
            <Typography variant="overline" sx={{ color: '#FF6F61' }}>
                TESTIMONIAL
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '2rem' }}>
                Our Latest Testimonials and What Our Client Says
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Box
                        component="img"
                        src="/images/hotel14.jpg"
                        alt="Client"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 2,
                            boxShadow: 1,
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6} >
                    {/* <Typography
                        variant="body1"
                        sx={{ fontStyle: 'italic', marginBottom: '1rem' }}
                    >
                        "This is one of the best & quality full hotels in the world that will help you to make a good market. This is one of the best & quality full hotels in the world that will help you to make an excellent study market."
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Avatar src="/images/hotel2.jpg" alt="2Khan" sx={{ marginRight: '1rem' }} />
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>2Khan</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>2Usa</Typography>
                        </Box>
                    </Box> */}


                        <Right/>


                </Grid>
            </Grid>
        </Box>

        </Container>
    );
};

export default Testimonial;