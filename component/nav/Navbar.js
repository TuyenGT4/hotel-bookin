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

import HotelHubLogo from "./HotelHubLogo";
const Navbar = () => {
  const isMobile = useMediaQuery("(max-width:600px");

  const [anchorEl, setAnchorEI] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEI(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEI(null);
  };

  const navLinks = [
   
    "About",
    "Restaurant",
    "Gallery",
    "allblogs",
    "AllRooms",
    "Contact",
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
                  {/* <img src="/logo.png" alt="HotelHub" style={{ height: '40px', marginRight: '10px' }} /> */}
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
                    <MenuItem key={link} onClick={handleClose}>
                      <Link href={`/${link.toLowerCase()}`} passHref>
                        <Box
                          component="p"
                          sx={{
                            textDecoration: "none",
                            color: "inherit",
                            fontWeight: "bold",
                          }}
                        >
                          {link}
                        </Box>
                      </Link>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Box display="flex" alignItems="center">
                {navLinks.map((link) => (
                  <Button color="inherit" key={link}>
                    <Link href={`/${link.toLowerCase()}`} passHref 
                    
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
                        {link}
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
                  Book Now
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
