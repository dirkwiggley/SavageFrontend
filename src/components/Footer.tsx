import { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import { useAuthStore } from "./AuthStore";
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";

import { otherColors } from "../theme";
import { useAuthContext } from "./AuthStore";

const paperStyle = {
  bgcolor: "background.darkestBlue",
  color: "#FFFFFF",
  borderRadius: 0,
  width: "100vw",
  bottom: 0,
  position: "absolute",
};

const NonMobileBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: 1,
  alignItems: "center",
  bottom: 0,
  position: "fixed",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

function Footer() {
  const [ auth, setAuth ] = useAuthContext();

  const [login, setLogin] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (auth) {
      try {
        let login = auth.login;
        let nickname = auth.nickname;
        setLogin(login);
        setNickname(nickname);
      } catch (err) {
        console.error(err);
        setLogin(null);
        setNickname(null);
      }
    } else if (auth === "") {
      setLogin("");
      setNickname("");
    }
  }, [auth, setLogin, setNickname]);

  const out = `${t('footer.user')}: ${login} (${nickname})`;

  return (
    <NonMobileBox>
      <footer>
        <Box sx={{ flexGrow: 1 }}>
          <Paper sx={{ ...paperStyle, bgcolor: otherColors.darkestBlue }}>
            <Box sx={{ ml: 2 }}>{login ? out : "-"}</Box>
          </Paper>
        </Box>
      </footer>
    </NonMobileBox>
  );
}

export default Footer;
