"use client"


import { Box, Grid, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
 import Booking from "./Booking"
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const stats = [
    { title: 'Total Hotel', count: 120 },
    { title: 'Active Hotel', count: 80 },
    { title: 'Pending Hotel', count: 20 },
    { title: 'Total Hotel', count: 250 },
];



export default function Dashboard() {
    const [colors, setColors] = useState([]);

    useEffect(() => {
        setColors(stats.map(() => getRandomColor()));
    }, []);

    return (

<>
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Grid container spacing={2}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Box
                            sx={{
                                backgroundColor: colors[index],
                                boxShadow: 3,
                                borderRadius: 1,
                                padding: 2,
                                textAlign: 'center',
                            }}
                        >

                            <Typography variant="h6" component="div">
                                {stat.count}
                            </Typography>
                            <Typography variant="body2" component="div">
                                {stat.title}
                            </Typography>

                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
<Booking/>

</>

    );
};

