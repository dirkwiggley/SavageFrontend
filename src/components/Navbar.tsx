import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Link as MaterialLink } from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import { useTranslation, Trans } from "react-i18next";

import { useAuthContext } from "./AuthStore";
import API from "../api";

import { otherColors, theme } from "../theme";
import { MobileBox, NonMobileBox } from "./MobileBox";

export default function MenuAppBar() {
  const { t, i18n } = useTranslation();

  const [auth, setAuth] = useAuthContext();
  const [anchorEl, setAnchorEl] = useState<Element | undefined>();
  const [roles, setRoles] = useState<string[] | undefined>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [menuType, setMenuType] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      try {
        let roles = auth.roles;
        let isAdmin = roles.includes("ADMIN");
        setRoles(roles);
        setIsAdmin(isAdmin);
      } catch (err) {
        console.error(err);
        setRoles([]);
        setIsAdmin(false);
      }
    }
  }, [auth]);

  const handleAppMenu = (event: React.SyntheticEvent) => {
    setMenuType("APP_MENU");
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenu = (event: React.SyntheticEvent) => {
    setMenuType("USER_MENU");
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const handleLogin = () => {
    handleClose();
    navigate("/login/true");
  };

  const handleLogout = () => {
    if (auth) {
      handleClose();
      navigate("/exit");
      setAuth?.(null);
      setRoles([]);
      setIsAdmin(false);
      API.logoutApi(auth.id);
    }
  };

  const handleProfile = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    handleClose();
    navigate("/profile");
  };

  const handleHome = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    handleClose();
    navigate("/home");
  };

  const handleAbout = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    handleClose();
    navigate("/about");
  };
 
  const handleUsers = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    handleClose();
    navigate("/users");
  };

  const handleSetLang = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    handleClose();
    navigate("/locales");
  }

  const handleCampaign = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    handleClose();
    navigate("/campaigns");
  }

  const handleCombatTracker = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    handleClose();
    navigate("/combattracker");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ boxShadow: 0 }}>
        <Toolbar sx={{ bgcolor: otherColors.otherBackground }}>
          <MobileBox onClick={handleAppMenu}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl) && menuType === "APP_MENU"}
                onClose={handleClose}
              >
                <MenuItem onClick={handleHome}>{t('navbar.home')}</MenuItem>
                {roles && roles.length > 0 ? (
                  <MenuItem onClick={handleAbout}>{t('navbar.about')}</MenuItem>
                ) : null}
                {roles && roles.length > 0 ? (
                  <MenuItem onClick={handleCampaign}>{t('navbar.campaign')}</MenuItem>
                ) : null}
                {roles && roles.length > 0 ? (
                  <MenuItem onClick={handleCombatTracker}>Combat Tracker</MenuItem>
                ) : null}
                {roles && roles.length > 0 ? (
                  <MenuItem onClick={handleUsers}>{t('navbar.users')}</MenuItem>
                ) : null}
                {roles && roles.length > 0 ? (
                  <MenuItem onClick={handleProfile}>{t('navbar.profile')}</MenuItem>
                ) : null}
              </Menu>
            </Box>
          </MobileBox>
          <Typography variant="h6" component="span" color="white" sx={{ mr: 2, fontWeight: "bold" }}>
            App
          </Typography>
          <NonMobileBox>
            <MaterialLink
              component={RouterLink}
              to="/home"
              sx={{ 
                flexGrow: 1, 
                ml: 1, 
                mr: 1, 
                color: "#FFFFFF",
                fontWeight: "bold",
              }}
            >
              <Typography variant="h6" component="span" sx={{ mr: 2 }}>{t('navbar.home')}</Typography>
            </MaterialLink>
            <MaterialLink
              component={RouterLink}
              to="/about"
              sx={{ 
                flexGrow: 1, 
                ml: 1, 
                mr: 1, 
                color: "#FFFFFF",
                fontWeight: "bold",
              }}
            >
              <Typography variant="h6" component="span" sx={{ mr: 2 }}>{t('navbar.about')}</Typography>
            </MaterialLink>
            {isAdmin ? (
              <MaterialLink
                component={RouterLink}
                to="/users"
                sx={{ 
                  flexGrow: 1, 
                  ml: 1, 
                  mr: 1, 
                  color: "#FFFFFF",
                  fontWeight: "bold",
                }}
              >
                <Typography variant="h6" component="span" sx={{ mr: 2 }}>{t('navbar.users')}</Typography>
              </MaterialLink>
            ) : null}
            {isAdmin ? (
              <MaterialLink
                component={RouterLink}
                to="/campaigns"
                sx={{ 
                  flexGrow: 1, 
                  ml: 1, 
                  mr: 1, 
                  color: "#FFFFFF",
                  fontWeight: "bold",
                }}
              >
                <Typography variant="h6" component="span" sx={{ mr: 2 }}>{t('navbar.campaign')}</Typography>
              </MaterialLink>
            ) : null}
            {isAdmin ? (
              <MaterialLink
                component={RouterLink}
                to="/dbeditor"
                sx={{ 
                  flexGrow: 1, 
                  ml: 1, 
                  mr: 1, 
                  color: "#FFFFFF",
                  fontWeight: "bold",
                }}
              >
                <Typography variant="h6" component="span" sx={{ mr: 2 }}>{t('navbar.dbeditor')}</Typography>
              </MaterialLink>
            ) : null}
            {roles && roles.length > 0 ? (
              <MaterialLink
                component={RouterLink}
                to="/profile"
                sx={{ 
                  flexGrow: 1, 
                  ml: 1, 
                  mr: 1, 
                  color: "#FFFFFF",
                  fontWeight: "bold",
                }}
              >
                <Typography variant="h6" component="span" sx={{ mr: 2 }}>{t('navbar.profile')}</Typography>
              </MaterialLink>
            ) : null}
          </NonMobileBox>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleUserMenu}
            color="info"
          >
            <AccountCircle />
          </IconButton>
          <Box>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl) && menuType === "USER_MENU"}
              onClose={handleClose}
            >
              {!roles || roles.length === 0 ? (
                <MenuItem onClick={handleLogin}>{t('navbar.login')}</MenuItem>
              ) : null}
              {roles && roles.length > 0 ? (
                <MenuItem onClick={handleLogout}>{t('navbar.logout')}</MenuItem>
              ) : null}
              {roles && roles.length > 0 ? (
                <MenuItem onClick={handleProfile}>{t('navbar.profile')}</MenuItem>
              ) : null}
              <MenuItem onClick={handleSetLang}>{t('navbar.setlang')}</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}



