import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useTranslation, Trans } from "react-i18next";

import { useState, useEffect, MouseEvent } from "react";
import { useAuthContext } from "./AuthStore";
import Grid from "@mui/material/Grid";

function Home() {
  const { t, i18n } = useTranslation();

  const [auth, setAuth] = useAuthContext();
  const [roles, setRoles] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showiFrame, setShowiFrame] = useState<boolean>(false);

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
  }, [auth, setRoles, setIsAdmin]);

  const handleClick = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    setShowiFrame(!showiFrame);
    event.stopPropagation();
  };

  const showVideo = () => {
    if (showiFrame) {
      return (
        <iframe
          width="345"
          height="202"
          src="https://www.youtube.com/embed/efTGgfel3mw"
          title="Savage Worlds"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      )
    } else {
      return (
        <CardMedia
          component="img"
          width="345"
          height="202"
          image="/SW_LOGO_FP_2018.png"
          alt="Savage Worlds Logo"
        />
      )
    }
  }

  return (
    <Box overflow="hidden" sx={{ minHeight: "91vh" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "85vh",
              maxWidth: "100vw",
            }}
          >
            <Card sx={{ maxWidth: 345, bgcolor: "rgba(255,255,255,0.5)" }}>
              {showVideo()}
              <CardContent sx={{ bgcolor: "rgba(255,255,255,0.5)" }}>
                <Typography gutterBottom variant="h5" component="div">
                  {t('home.head')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.body1')}
                  {t('home.body2')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={(e) => handleClick(e)} size="small">
                  <Typography color="text.primary">{t('home.action')}</Typography>
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
