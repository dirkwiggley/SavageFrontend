import { useEffect, useState } from "react";
import { useAuthContext } from "./AuthStore";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2";

function About() {
  const [auth, setAuth] = useAuthContext();
  const [roles, setRoles] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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

  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );

  const handleClick = () => {
    window.open("https://www.merriam-webster.com/dictionary/excellent");
  };

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
            <Card variant="outlined" sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Word of the Day
                </Typography>
                <Typography variant="h5" component="div">
                  ex{bull}cel{bull}lent
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  adjective
                </Typography>
                <Typography variant="body2">
                  very good of its kind.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
                <Typography sx={{mt: 2}} variant="body2">
                  * For the demo, login as
                </Typography>
                <Typography variant="body2">
                  admin/admin or user/user *
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClick}
                >
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default About;
