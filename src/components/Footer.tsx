import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useAuthStore } from "./AuthStore";
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";

import { otherColors } from "../theme";
import { useAuthContext } from "./AuthStore";

const paperStyle = {
  bgcolor: "background.otherBackground",
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

  const getUserTypography = () => {
    if (login === "nobody") {
      return <Typography variant="h6" component="span" sx={{ mr: 2 }}>{`${t('footer.notloggedIn')}`}</Typography>;
    } else {
      return <Typography variant="h6" component="span" sx={{ mr: 2 }}>{`${t('footer.user')}: ${login} (${nickname})`}</Typography>;
    }
  }

  return (
    <NonMobileBox>
      <footer>
        <Box sx={{ flexGrow: 1 }}>
          <Paper sx={{ ...paperStyle, bgcolor: otherColors.otherBackground }}>
            <Box sx={{ ml: 2 }}>{login ? getUserTypography() : "-"}</Box>
          </Paper>
        </Box>
      </footer>
    </NonMobileBox>
  );
}

export default Footer;
