"use client";
import { signOut } from "next-auth/react";
import { Button, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function LogOut() {
  const { t } = useTranslation("component/dashboard/user/logout");

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
          {t("logout", "Logout")}
        </Button>
      </Box>
    </>
  );
}
