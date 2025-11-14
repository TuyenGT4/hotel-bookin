import * as React from "react";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";

import Hotel from "@/component/dashboard/admin/hotel/Hotel";
import DashBoard from "@/component/dashboard/admin/dashboard/Dashboard";
import HotelHubLogo from "@/component/nav/HotelHubLogo";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import Sale from "@/component/dashboard/admin/sale/Sale";
import { signOut } from "next-auth/react";
import Profile from "@/component/dashboard/admin/profile/Profile";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Toolbar,
  AppBar,
  IconButton,
  Grid,
  Collapse,
  alpha,
} from "@mui/material";

import Team from "@/component/dashboard/admin/team/Team";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import QuickreplyIcon from "@mui/icons-material/Quickreply";

import SnapBooking from "@/component/dashboard/admin/snapbooking/snapbooking";
import ManageRoomCategories from "@/component/dashboard/admin/manageroomcategories/ManageRoomCategoriesTable";

import TeamList from "@/component/dashboard/admin/teamlist/Team";
import Booking from "@/component/dashboard/admin/booking/Booking";

import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import Category from "@/component/dashboard/admin/category/Category";
import BookIcon from "@mui/icons-material/Book";
import Blog from "@/component/dashboard/admin/blog/BlogForm";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import BlogList from "@/component/dashboard/admin/bloglist/BlogList";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Tổng quan",
    icon: <DashboardIcon />,
    color: "#6366F1", // Indigo
  },
  {
    segment: "orders",
    title: "Danh sách đơn",
    icon: <ShoppingCartIcon />,
    color: "#EC4899", // Pink
  },
  {
    segment: "profile",
    title: "Hồ sơ cá nhân",
    icon: <PersonOutlineIcon />,
    color: "#10B981", // Gray
  },

  {
    segment: "team",
    title: "Nhóm",
    icon: <GroupAddIcon />,
    color: "#32a8a8", // Gray
  },

  {
    segment: "teamlist",
    title: "Danh sách nhóm",
    icon: <MarkunreadMailboxIcon />,
    color: "#360be3", // Gray
  },

  {
    segment: "snapbooking",
    title: "Đặt nhanh",
    icon: <QuickreplyIcon />,
    color: "#32a8a8", // Gray
  },

  {
    segment: "manageroomcategories",
    title: "Danh mục phòng",
    icon: <ManageHistoryIcon />,
    color: "#10B981", // Gray
  },

  {
    kind: "divider",
  },

  {
    kind: "header",
    title: "Phân tích",
  },
  {
    segment: "reports",
    title: "Báo cáo",
    icon: <BarChartIcon />,
    color: "#10B981", // Emerald
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon />,
        color: "#3B82F6", // Blue
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
        color: "#F59E0B", // Amber
      },
    ],
  },

  {
    segment: "category",
    title: "Danh mục",
    icon: <LayersIcon />,
    color: "#8B5CF6", // Violet
  },

  {
    segment: "blog",
    title: "Blog",
    icon: <BookIcon />,
    color: "#F59E0B", // Violet
  },

  {
    segment: "bloglist",
    title: "Danh sách blog",
    icon: <FormatListBulletedIcon />,
    color: "#f54287", // Violet
  },
];

const demoTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366F1",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#10B981",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#000",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#111827",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "none",
          boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);
  const [searchParams] = React.useState(new URLSearchParams());

  return {
    pathname,
    searchParams,
    navigate: (path) => setPathname(String(path)),
  };
}

const PageContent = ({ path }) => {
  switch (path) {
    case "/dashboard":
      return (
        <Box
          sx={{
            backgroundColor: "#000",
          }}
        >
          {/* <Typography paragraph>Welcome to your dashboard. Here you can see an overview of your application.</Typography> */}

          <DashBoard />
        </Box>
      );
    case "/orders":
      return (
        <Box>
          <Typography paragraph>View and manage your Booking here.</Typography>

          <Booking />
        </Box>
      );
    case "/reports":
      return (
        <Box>
          <Typography variant="h4" gutterBottom>
            Reports
          </Typography>
          <Typography paragraph>View your reports and analytics.</Typography>
        </Box>
      );
    case "/sales":
      return (
        <Box>
          <Typography variant="h4" gutterBottom>
            Sales Report
          </Typography>
          <Sale />
        </Box>
      );
    case "/traffic":
      return (
        <Box>
          <Typography variant="h4" gutterBottom>
            Hotel Report
          </Typography>
          <Hotel />
        </Box>
      );
    case "/category":
      return (
        <Box>
          <Typography paragraph>
            Manage your third-party integrations.
          </Typography>
          <Category />
        </Box>
      );

    case "/profile":
      return (
        <Box sx={{ backgroundColor: "#000" }}>
          <Profile />
        </Box>
      );

    case "/team":
      return (
        <Box sx={{ backgroundColor: "#000" }}>
          <Team />
        </Box>
      );

    case "/teamlist":
      return (
        <Box sx={{ backgroundColor: "#000" }}>
          <TeamList />
        </Box>
      );

    case "/snapbooking":
      return (
        <Box sx={{ backgroundColor: "#000" }}>
          <SnapBooking />
        </Box>
      );

    case "/manageroomcategories":
      return (
        <Box sx={{ backgroundColor: "#000" }}>
          <ManageRoomCategories />
        </Box>
      );

    case "/blog":
      return (
        <Box sx={{ backgroundColor: "#000" }}>
          <Blog />
        </Box>
      );

    case "/bloglist":
      return (
        <Box sx={{ backgroundColor: "#000" }}>
          <BlogList />
        </Box>
      );

    default:
      return (
        <Box>
          <Typography variant="h4" gutterBottom>
            Page Not Found
          </Typography>
          <Typography>The requested page could not be found.</Typography>
        </Box>
      );
  }
};

const drawerWidth = 280;

function NavigationItem({ item, router, drawerOpen, level = 0 }) {
  const [open, setOpen] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const theme = useTheme();

  const isActive =
    router.pathname === `/${item.segment}` ||
    (hasChildren &&
      item.children.some((child) => router.pathname === `/${child.segment}`));

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else {
      router.navigate(`/${item.segment}`);
    }
  };

  if (item.kind === "header") {
    if (!drawerOpen) return null;
    return (
      <Typography
        variant="subtitle2"
        sx={{
          px: 2,
          py: 1.5,
          mt: level > 0 ? 1 : 0,
          color: "text.secondary",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        {item.title}
      </Typography>
    );
  }

  if (item.kind === "divider") {
    return <Divider sx={{ my: 1, borderColor: "divider" }} />;
  }

  return (
    <React.Fragment>
      <ListItem
        disablePadding
        sx={{
          pl: level * 2,
          "& .MuiListItemButton-root": {
            pl: 2 + level * 2,
            py: 0.75,
            minHeight: 44,
            borderRadius: 1,
            mx: 1,
            justifyContent: drawerOpen ? "initial" : "center",
            "&.Mui-selected": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              "& .MuiListItemIcon-root": {
                color: theme.palette.primary.main,
              },
            },
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          },
        }}
      >
        <ListItemButton
          selected={isActive}
          onClick={handleClick}
          sx={{
            "& .MuiListItemIcon-root": {
              minWidth: 0,
              mr: drawerOpen ? 2 : "auto",
              justifyContent: "center",
              color: isActive ? theme.palette.primary.main : item.color,
            },
            "& .MuiListItemText-root": {
              opacity: drawerOpen ? 1 : 0,
              transition: "opacity 0.2s ease",
              "& span": {
                fontWeight: isActive ? 600 : 500,
                fontSize: "0.875rem",
                color: isActive ? theme.palette.primary.main : "inherit",
              },
            },
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
          {drawerOpen &&
            hasChildren &&
            (open ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            ))}
        </ListItemButton>
      </ListItem>
      {hasChildren && drawerOpen && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => (
              <NavigationItem
                key={child.segment}
                item={child}
                router={router}
                drawerOpen={drawerOpen}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
}

function CustomDashboardLayout({ navigation, router, window }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopOpen, setDesktopOpen] = React.useState(true);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopDrawerToggle = () => {
    setDesktopOpen(!desktopOpen);
  };

  const handleLogout = () => {
    // This is where you would typically call the Next-Auth signOut function

    // In a real app, you would do something like:
    signOut({ callbackUrl: "/login" });
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#000",
        color: "#fff",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          minHeight: "72px !important",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {desktopOpen && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 700 }}
            >
              <HotelHubLogo />
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={handleDesktopDrawerToggle}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <ChevronLeftIcon
            sx={{
              transform: desktopOpen ? "rotate(0deg)" : "rotate(180deg)",
              transition: theme.transitions.create("transform", {
                duration: theme.transitions.duration.shortest,
              }),
            }}
          />
        </IconButton>
      </Toolbar>

      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        <List sx={{ width: "100%" }}>
          {navigation.map((item, index) => (
            <NavigationItem
              key={item.segment || `${item.kind}-${index}`}
              item={item}
              router={router}
              drawerOpen={desktopOpen}
            />
          ))}
        </List>
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            px: 2,
            py: 1.5,
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: desktopOpen ? 2 : "auto",
              justifyContent: "center",
              color: theme.palette.error.main,
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{
              opacity: desktopOpen ? 1 : 0,
              transition: "opacity 0.2s ease",
              "& span": {
                color: theme.palette.error.main,
                fontWeight: 500,
                fontSize: "0.875rem",
              },
            }}
          />
        </ListItemButton>
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          display: desktopOpen ? "block" : "none",
        }}
      >
        <Box
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 2,
            p: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Upgrade to Pro
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Unlock all features
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#000",
          color: "#fff",
          width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : 72}px)` },
          ml: { sm: `${desktopOpen ? drawerWidth : 72}px` },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              color: "text.primary",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 600 }}
          >
            {router.pathname === "/dashboard" && "Dashboard"}
            {router.pathname === "/orders" && "Booking List"}
            {router.pathname === "/profile" && "Admin Profile"}

            {router.pathname === "/team" && "Team Members"}

            {router.pathname === "/teamlist" && "Team Members List"}

            {router.pathname === "/snapbooking" && "Snap Booking"}

            {router.pathname === "/manageroomcategories" &&
              "manage room categories"}

            {router.pathname === "/reports" && "Reports"}
            {router.pathname === "/sales" && "Sales Report"}
            {router.pathname === "/traffic" && "Traffic Report"}
            {router.pathname === "/category" && "Category"}
            {router.pathname === "/blog" && "Blog"}
            {router.pathname === "/bloglist" && "BlogList"}
            {![
              "/dashboard",
              "/orders",
              "/profile",
              "/reports",
              "/sales",
              "/traffic",
              "/integrations",
              "/team",
              "/teamlist",
              "/snapbooking",
              "/manageroomcategories",
              "/category",
              "/blog",
              "/bloglist",
            ].includes(router.pathname) && "Page Not Found"}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: theme.palette.grey[200],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>JD</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          backgroundColor: "#000",
          color: "#fff",

          width: { sm: desktopOpen ? drawerWidth : 72 },
          flexShrink: { sm: 0 },
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: desktopOpen ? drawerWidth : 72,
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          backgroundColor: "#000",
          color: "#fff",
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : 72}px)` },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: 72 }} />
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            minHeight: "calc(100vh - 72px)",
            borderRadius: 3,
            p: 3,
          }}
        >
          <PageContent path={router.pathname} />
        </Box>
      </Box>
    </Box>
  );
}

export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const router = useDemoRouter("/dashboard");
  const demoWindow = window ? window() : undefined;

  return (
    <ThemeProvider theme={demoTheme}>
      <CustomDashboardLayout
        navigation={NAVIGATION}
        router={router}
        window={demoWindow}
      />
    </ThemeProvider>
  );
}
