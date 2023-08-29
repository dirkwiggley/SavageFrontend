//https://www.youtube.com/watch?v=Q_Wtwnrdudc
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

const BASIC_RULES = "https://www.youtube.com/embed/Q_Wtwnrdudc";
const BASIC_COMBAT = "https://www.youtube.com/embed/Zh1326prL7s"
const BASIC_CHARACTER_CREATION = "https://www.youtube.com/embed/bJCsIeqDgr0";

function About() {
  const { t, i18n } = useTranslation();

  const [auth, setAuth] = useAuthContext();
  const [roles, setRoles] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [videoURL, setVideoURL] = useState<string>(BASIC_RULES);

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
    let newURL = "";
    switch (videoURL) {
      case BASIC_RULES:
        newURL = BASIC_COMBAT;
        break;
      case BASIC_COMBAT:
        newURL = BASIC_CHARACTER_CREATION;
        break;
      default:
        newURL = BASIC_RULES;
    }
    setVideoURL(newURL);
    event.stopPropagation();
  };

  const getIFrame = () => {
    return (
      <iframe
        width="345"
        height="202"
        src={videoURL}
        title="Savage Worlds"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    )
  }

  const getHead = () => {
    switch (videoURL) {
      case BASIC_RULES:
        return "about.head_rules";
      case BASIC_COMBAT:
        return "about.head_combat";
      default:
        return "about.head_creation";
    }
  }

  const getBody = () => {
    switch (videoURL) {
      case BASIC_RULES:
        return "about.body_rules";
      case BASIC_COMBAT:
        return "about.body_combat";
      default:
        return "about.body_creation";
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
              {getIFrame()}
              <CardContent sx={{ bgcolor: "rgba(255,255,255,0.5)" }}>
                <Typography gutterBottom variant="h5" component="div">
                  {t(getHead())}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(getBody())}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={(e) => handleClick(e)} size="small">
                  <Typography color="text.primary">{t('about.action')}</Typography>
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default About;
    