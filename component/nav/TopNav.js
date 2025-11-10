import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageIcon from "@mui/icons-material/Language";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import Link from "next/link";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: session } = useSession();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { i18n, t } = useTranslation();

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };

  const handleClick = () => {
    router.push(`/dashboard/${session?.user?.role}`);
  };

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem>
          <LanguageIcon sx={{ mr: 1 }} />
          <Select
            value="English"
            variant="standard"
            disableUnderline
            sx={{ color: "black" }}
          >
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Spanish">Spanish</MenuItem>
          </Select>
        </ListItem>
        <ListItem>
          <Button color="inherit" startIcon={<AccountCircleIcon />}>
            Login
          </Button>
        </ListItem>
        <ListItem>
          <Button color="inherit" startIcon={<AccountCircleIcon />}>
            Register
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "red" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LanguageIcon sx={{ mr: 1 }} />
          <Select
            value={i18n.language || "vi"}
            onChange={handleLanguageChange}
            variant="standard"
            disableUnderline
            sx={{ color: "white" }}
          >
            <MenuItem value="vi">{t("vietnamese", "Vietnamese")}</MenuItem>
            <MenuItem value="en">{t("english", "English")}</MenuItem>
          </Select>
        </Box>
        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              sx={{ zIndex: 1400 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
              {drawer}
            </Drawer>
          </>
        ) : (
          <Box
            sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
          >
            <HomeIcon sx={{ mr: 1 }} />
            <Typography variant="body1" sx={{ color: "white", mr: 2 }}>
              "The Yolk's On You Manor" 127.0.0.0.1
            </Typography>
            <PhoneIcon sx={{ mr: 1 }} />
            <Typography variant="body1" sx={{ color: "white", mr: 2 }}>
              +1 222-363-5354
            </Typography>

            {session?.user ? (
              <img
                onClick={handleClick}
                src={session?.user?.image || "/images/pic1.png"}
                alt="User Avatar"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  position: "relative",
                  zIndex: 2,
                  cursor: "pointer", // This makes the hand pointer appear on hover
                }}
              />
            ) : (
              <>
                <Button color="inherit" startIcon={<AccountCircleIcon />}>
                  <Link href="/login" passHref>
                    <Box
                      component="span"
                      sx={{ textDecoration: "none", color: "white" }}
                    >
                      Login
                    </Box>
                  </Link>
                </Button>
                <Button color="inherit" startIcon={<AccountCircleIcon />}>
                  <Link href="/register">
                    <Box
                      component="span"
                      sx={{ textDecoration: "none", color: "white" }}
                    >
                      Register
                    </Box>
                  </Link>
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
