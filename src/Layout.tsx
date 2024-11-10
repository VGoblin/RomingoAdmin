import * as React from "react";
import { FC } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CalendarViewDay,
  Menu,
  ChevronLeft,
  ChevronRight,
  CorporateFare,
  Settings,
  Shield,
  LocationCity,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const drawerWidth = 240;

export const Layout: FC = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(
    localStorage.getItem("drawerOpen") === "true" ? true : false || false
  );
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    localStorage.setItem("drawerOpen", "true");
    setOpen(true);
  };

  const handleDrawerClose = () => {
    localStorage.setItem("drawerOpen", "false");
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", height: "42px", py: "8px" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar variant="dense" sx={{ py: "8px" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <Menu />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <img
              onClick={() => navigate("/")}
              style={{ maxWidth: "125px", cursor: "pointer" }}
              src="https://storage.googleapis.com/romingo-development-public/images/front-end/Romingo_Logo_Black.svg"
            />
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem button onClick={() => navigate("/bookings")}>
            <ListItemIcon>
              <CalendarViewDay />
            </ListItemIcon>
            <ListItemText primary="Bookings" />
          </ListItem>
          <ListItem button onClick={() => navigate("/hotels")}>
            <ListItemIcon>
              <CorporateFare />
            </ListItemIcon>
            <ListItemText primary="Hotels" />
          </ListItem>
          <ListItem button onClick={() => navigate("/locations")}>
            <ListItemIcon>
              <LocationCity />
            </ListItemIcon>
            <ListItemText primary="Locations" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={() => navigate("/authorizations")}>
            <ListItemIcon>
              <Shield />
            </ListItemIcon>
            <ListItemText primary="Authorizations" />
          </ListItem>
          <ListItem button onClick={() => navigate("/settings")}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};
