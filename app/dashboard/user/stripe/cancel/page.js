"use client"

// pages/failure.js
import React from 'react';
import { useRouter } from 'next/navigation'
import { Box, Typography, Button } from '@mui/material';
import { FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Failure = () => {
  const router = useRouter();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#212121"
      textAlign="center"
      color="white"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaTimesCircle color="#f44336" size="130" />
      </motion.div>
      <Typography variant="h4" gutterBottom>
        Payment Failed
      </Typography>
      <Typography variant="body1" gutterBottom>
        Unfortunately, we couldn't process your payment. Please try again.
      </Typography>
      <Button
        variant="contained"
   
        onClick={() => router.push('/all-courses')}
        sx={{
            bgcolor: "purple",
            ":hover": { bgcolor: "darkviolet" },
            whiteSpace: "nowrap",
            padding: "12px 44px",
            fontSize: "1.6rem",
          }}

      >
        Try Again
      </Button>
    </Box>
  );
};

export default Failure;