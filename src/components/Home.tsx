import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2";

import { useTranslation, Trans } from "react-i18next";

import { useState, useEffect } from "react";
import { useAuthContext } from "./AuthStore";

const lngs: any = {
  en: { nativeName: 'English' },
  de: { nativeName: 'Deutsch' }
};

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

  const handleClick = () => {
    setShowiFrame(!showiFrame);
  };

  const showVideo = () => {
    if (showiFrame) {
      return (
        <iframe
          width="345"
          height="202"
          src="https://www.youtube.com/embed/odM92ap8_c0"
          title="Godzilla vs. Kong – Official Trailer"
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
          image="/godzilla.png"
          alt="green iguana"
        />
      )
    }
  }

  return (
    <Box pt={3} overflow="hidden">
      <Grid2 container spacing={2}>
        <Grid2 xs={12}>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Card sx={{ maxWidth: 345 }}>
              {showVideo()}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {t('home.head')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.body1')}
                  {t('home.body2')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={handleClick} size="small">
                  {t('home.action')}
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Grid2>
        {/* <Grid2 xs={12}>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {Object.keys(lngs).map((lng) => (
              <button key={lng} style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(lng)}>
                {lngs[lng].nativeName}
              </button>
            ))}
          </Box>
        </Grid2> */}
      </Grid2>
    </Box>
  );
}

export default Home;
