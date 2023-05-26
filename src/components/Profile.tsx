import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Link as Muilink } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useTranslation } from "react-i18next";
import { useAuthContext } from "./AuthStore";
import { getLanguageFromId } from "./Locales";

const StyledPaper = styled(Paper)(({ theme }) => ({
  justifyContent: "center",
  minHeight: "20vh",
  padding: "50px",
  backgroundColor: "background.scissors",
}));

const Profile = () => {
  const { t, i18n } = useTranslation();
  const [auth, setAuth] = useAuthContext();

  const [login, setLogin] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [roles, setRoles] = useState<string[] | null>(null);
  const [locale, setLocale] = useState<string>("")
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  let navigate = useNavigate();

  useEffect(() => {
    if (!auth || auth.login === "nobody") {
      navigate("/login/true");
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (auth) {
      try {
        let isAdmin = roles ? roles.includes("ADMIN") : null;
        setLogin(auth.login);
        setRoles(auth.roles);
        setIsAdmin(isAdmin);
        setNickname(auth?.nickname);
        setEmail(auth?.email);
        setLocale(auth?.locale);
      } catch (err) {
        console.error(err);
        setRoles([]);
        setLocale("");
        setIsAdmin(false);
      }
    }
  }, [auth, setRoles, setIsAdmin]);

  const getRoles = () => {
    return roles ? JSON.stringify(roles) : t('profile.none');
  }

  const handleSubmit = () => {

  }

  return (
    <Grid container spacing={0} justifyContent="center" direction="row">
      <Grid item >
        <Grid container direction="column" justifyContent="center" spacing={2} sx={{
          justifyContent: "center",
          minHeight: "90vh"
        }} >
          <StyledPaper variant="elevation" elevation={2} sx={{ bgcolor: "background.lightestBlue" }}>
            <Grid item>
              <Typography component="h1" variant="h5">{t('profile.profile')}</Typography>
            </Grid>
            <Grid item>
              <form onSubmit={handleSubmit}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <Typography sx={{ mt: 2 }}>{t('profile.login')}: {login}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{t('profile.nickname')}: {nickname}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{t('profile.email')}: {email}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{t('profile.locale')}: {getLanguageFromId(locale)}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{t('profile.roles')}: {getRoles()}</Typography>
                  </Grid>
                  <Grid item>
                      <Typography>{t('profile.locale')}: {locale}</Typography>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </StyledPaper >
        </Grid >
      </Grid >
    </Grid >);
}

export default Profile;