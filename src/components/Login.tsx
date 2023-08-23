import { useRef, useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import { Grid, Paper, Typography, TextField, Button, Link as Muilink, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

import API from '../api';
import { useAuthContext, instanceofUserInfo, convertToUserInfo, defaultUserInfo } from './AuthStore';
import { UserInterface } from "../types";

const StyledGrid = styled(Grid, {
  name: "StyledGrid",
  slot: "Wrapper"
})({
  justifyContent: "center",
  minHeight: "90vh",
  maxWidth: "100vw",
});

const StyledPaper = styled(Paper, {
  name: "StyledPaper",
  slot: "Wrapper"
})({
  justifyContent: "center",
  minHeight: "22vh",
  padding: "50px",
  borderRadius: "20px",
  background: "rgba(255,255,255,1.0)",//"transparent",
  backdropFilter: "blur(15px)",
});

const ErrMsgTypography = styled(Typography, {
  name: "ErrMsgTypoghraphy",
  slot: "Wrapper"
})({
  color: "red",
  fontSize: "20",
  fontWeight: "600",
});

const OffscreenTypography = styled(Typography, {
  name: "OffscreenTypography",
  slot: "Wrapper"
})({
    display: "none"
});

function Login() {  
  const [ auth, setAuth ] = useAuthContext();

  const { t, i18n } = useTranslation();
  const { showLogin } = useParams(); 

  const userRef = useRef(null);
  const errRef = useRef(null);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [show, setShow] = useState<boolean>(showLogin === "true");

  let navigate = useNavigate();

  useEffect(() => {
    const loginElement = document.getElementById("login");
    loginElement?.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [login, password]);

  const clickEvent = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
  }

  const changeLogin = (event: ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
    setErrMsg("");
  }


  const changePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrMsg("");
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    API.loginApi(login, password)
      .then(response => {
        // Set Context
        let userInfo: UserInterface | null = null;
        if (instanceofUserInfo(response)) {
          userInfo = convertToUserInfo(response);
          if (userInfo && userInfo.locale) i18n.changeLanguage(userInfo.locale.slice(0, 2));
        }

        if (userInfo?.resetpwd) {
          // We need to keep the userId for the reset
          let defaultUser = defaultUserInfo;
          defaultUser.id = userInfo.id;
          // We need to invalidate the login data if the user needs to reset their password
          setAuth(defaultUser);
        } else {
          setAuth(userInfo);
        }
        setLogin('');
        setPassword('');
        setShow(false);
        if (userInfo?.resetpwd) {
          navigate("/resetpassword"); 
        } else {
          navigate("/home");
        }
      }).catch(err => {
        if (!err?.response) {
          setErrMsg(t('login.noserverresponse') as string);
        } else if (err.response?.status === 400) {
          setErrMsg(t('login.incorrectusernameorpassword') as string);
        } else if (err.response?.status === 401) {
          setErrMsg(t('login.unauthorized') as string);
        } else {
          setErrMsg(t('login.loginfailed') as string);
        }
      });
  }

  const out = show ?
  (
    <Grid container spacing={0} justifyContent="center" direction="row" >
      <Grid item >
        <StyledGrid container direction="column" justifyContent="center" spacing={2} >
          <Grid item >
            <Box style={{width:"20%", height:"20%", backgroundImage: "../assets/background2.jpg" }} />
          </Grid>
          <StyledPaper variant="elevation" elevation={2} >
            <Grid item>
              {errMsg === "" ? <OffscreenTypography ref={errRef} aria-live="assertive" /> : <ErrMsgTypography ref={errRef} aria-live="assertive" >{errMsg}</ErrMsgTypography>}
            </Grid>
            <Grid item>
              <Typography component="h1" variant="h5">{t('login.signin')}</Typography>
            </Grid>
            <Grid item>
              <form onSubmit={handleSubmit}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <TextField
                      id="login"
                      type="login"
                      placeholder={t('login.login') as string}
                      variant="outlined"
                      value={login}
                      onClick={clickEvent}
                      onChange={changeLogin}
                      required
                      autoFocus={true} />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="pwd"
                      type="password"
                      placeholder={t('login.password') as string}
                      variant="outlined"
                      value={password}
                      onClick={clickEvent}
                      onChange={changePassword}
                      required />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{ width: "100%", bgcolor: "background.otherBackground" }} >{t('login.submit')}</Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item>
              <Muilink href="#" variant="body2" sx={{ color: "black" }}>{t('login.forgotpassword')}</Muilink>
            </Grid>
          </StyledPaper >
        </StyledGrid >
      </Grid >
    </Grid >
   ) :
    null;

  return out
    
}
export default Login;