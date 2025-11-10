// components/ServiceComponent.js
import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Button } from '@mui/material';

const services = [
    {
        title: 'Hotel Room Reservation into the Desire Places',
        description: 'You can easily reserve a hotel room in a good place as you want. This will be able to make good feelings. This will be really effective for us and all & all of the customers & clients.',
        buttonText: 'Read More',
    },
    {
        title: 'Resort Reservation Into the Good and Suitable Place',
        description: 'You can easily reserve a hotel room in a good place as you want. This will be able to make good feelings. This will be really effective for us and all & all of the customers & clients.',
        buttonText: 'Read More',
    },
    {
        title: 'Weeding Hall Reservation in the Suitable and Good Place',
        description: 'You can easily reserve a hotel room in a good place as you want. This will be able to make good feelings. This will be really effective for us and all & all of the customers & clients.',
        buttonText: 'Read More',
    },
    {
        title: 'Conference Room Reservation in the Suitable and Good Place',
        description: 'You can easily reserve a hotel room in a good place as you want. This will be able to make good feelings. This will be really effective for us and all & all of the customers & clients.',
        buttonText: 'Read More',
    },
];

const ServiceComponent = () => {
    return (
        <Container maxWidth="xl"     >
            <Typography variant="h4" m={8} component="h1" align="center" gutterBottom>
             Service List
            </Typography>
            <Grid container spacing={3}>
                {services.map((service, index) => (
                    <Grid item xs={12} sm={6} md={6} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {service.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {service.description}
                                </Typography>
                                <Button size="small" 
                                variant="contained"
                              
                                    sx={{
                                        marginTop:"20px",
                                      backgroundColor: 'red',
                                        '&:hover': { backgroundColor: 'red' }
                                    }}

                                 >
                                    {service.buttonText}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ServiceComponent;