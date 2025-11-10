"use client";
import { signOut } from "next-auth/react";
import { Button, Box } from "@mui/material";

export default function LogOut() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={handleLogout}
        >
Logout


        </Button>
      </Box>
    </>
  );
}
