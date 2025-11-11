// components/Navbar.js
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";

import HotelHubLogo from "./HotelHubLogo";

const Navbar = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [anchorEl, setAnchorEI] = React.useState(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation("component/nav/navbar");

  const handleMenu = (event) => {
    setAnchorEI(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEI(null);
  };

  const navLinks = [
    { key: "about", path: "/about" },
    { key: "restaurant", path: "/restaurant" },
    { key: "gallery", path: "/gallery" },
    { key: "allblogs", path: "/allblogs" },
    { key: "allrooms", path: "/allrooms" },
    { key: "contact", path: "/contact" },
  ];

  return (
    <AppBar
      position="static"
      style={{ backgroundColor: "white", color: "black" }}
    >
      <Box
        sx={{
          margin: "0 auto",
          width: "80%",
          maxWidth: "1070px",
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link href="/" passHref>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    fontWeight: "bold",
                  }}
                >
                  <HotelHubLogo />
                </Box>
              </Link>
            </Typography>

            {isMobile ? (
              <>
                <IconButton
                  sx={{ zIndex: 1400 }}
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleMenu}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                >
                  {navLinks.map((link) => (
                    <MenuItem key={link.key} onClick={handleClose}>
                      <Link href={link.path} passHref>
                        <Box
                          component="p"
                          sx={{
                            textDecoration: "none",
                            color: "inherit",
                            fontWeight: "bold",
                          }}
                        >
                          {t(link.key)}
                        </Box>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Box display="flex" alignItems="center">
                {navLinks.map((link) => (
                  <Button color="inherit" key={link.key}>
                    <Link
                      href={link.path}
                      passHref
                      sx={{
                        textDecoration: "none",
                        color: "inherit",
                        fontWeight: "bold",
                      }}
                    >
                      <Box
                        component="p"
                        sx={{
                          textDecoration: "none",
                          color: "inherit",
                          fontWeight: "bold",
                        }}
                      >
                        {t(link.key)}
                      </Box>
                    </Link>
                  </Button>
                ))}

                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    marginLeft: "20px",
                  }}
                >
                  {t("book_now")}
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Navbar;
