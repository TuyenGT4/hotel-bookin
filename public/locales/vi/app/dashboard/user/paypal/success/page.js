"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const Success = () => {
  const router = useRouter();

  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;

    hasRunRef.current = true;
    const varifyPayment = async () => {
      if (!typeof window !== "undefined") {
        const query = new URLSearchParams(window.location.search);

        const token = query.get("token");

        if (token) {
          try {
            const response = await fetch(
              `${process.env.API}/user/payment/paypalpayment/paypalvarify/${token}`
            );

            const data = await response.json();

            if (!response.ok) {
              router.push("/dashboard/user/paypal/cancel");
            } else {
              router.push("/dashboard/user");
            }
          } catch (error) {
            console.log("error", error);
           router.push("/dashboard/user/paypal/cancel");
          }
        }
      }
    };

    varifyPayment();
  }, [router]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaCheckCircle color="#4caf50" size="120" />
      </motion.div>
      <Typography variant="h4" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Thank you for your subscription. Now Everything is free.
      </Typography>

      <Button
        type="submit"
        variant="contained"
        onClick={() => router.push("/dashboard/user")}
        sx={{
          bgcolor: "purple",
          ":hover": { bgcolor: "darkviolet" },
          whiteSpace: "nowrap",
          padding: "12px 44px",
          fontSize: "1.6rem",
        }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default Success;
