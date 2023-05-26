import React, { ChangeEventHandler } from "react";
import { useEffect, useState, useRef } from 'react';
import { useAuthContext } from "./AuthStore";
import { useNavigate } from 'react-router-dom';
import styled from "@emotion/styled";
import { Grid, Paper, Typography, TextField, Button, Link as Muilink, TypographyTypeMap, AlertColor, Alert, Snackbar } from "@mui/material";

import MUITypography, { TypographyProps } from "@mui/material/Typography";
import { OverridableComponent } from "@mui/material/OverridableComponent";

import API, { authHelper } from '../api';

const StyledGrid = styled(Grid)`
  justifyContent: "center",
  minHeight: "90vh",
`;

const StyledPaper = styled(Paper)`
  justifyContent: "center",
  minHeight: "25vh",
  minWidth: "45vw",
  padding: "50px",
`;

const ErrTypography: OverridableComponent<TypographyTypeMap> = React.forwardRef(function Typography<
  D extends React.ElementType
>(props: TypographyProps<D>, ref: React.Ref<HTMLSpanElement> | null) {
  return <MUITypography ref={ref} {...props} />;
}) as OverridableComponent<TypographyTypeMap>;
const ErrMsgTypography = styled(Typography)`
  color: "red",
  fontSize: "20",
  fontWeight: "600",
`;

const OffscreenTypography = styled(Typography)`
    display: "none"
`;

function ResetPwd() {
  const errRef = useRef<React.ForwardedRef<HTMLSpanElement> | null | undefined>();

  const [auth, setAuth] = useAuthContext();
  const [roles, setRoles] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarType, setSnackbarType] = useState<AlertColor>("error");
  const [snackbarMsg, setSnackbarMsg] = useState<string>("");

  let navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      try {
        let isAdmin = roles ? roles.includes("ADMIN") : false;
        setIsAdmin(isAdmin);
        setUserId(auth.id?.toString());
      } catch (err) {
        console.error(err);
        setRoles([]);
        setIsAdmin(false);
      }
    }
  }, [auth]);

  const changePassword: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newPwd = event.target.value;
    setPassword(newPwd);
    if (newPwd !== confirmPassword) {
      setErrMsg("Password must match Confirmation Password");
    } else {
      setErrMsg("");
    }
  }

  const changeConfirmPassword: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newConfPwd = event.target.value;
    setConfirmPassword(newConfPwd);
    if (password !== newConfPwd) {
      setErrMsg("Password must match Confirmation Password");
    } else {
      setErrMsg("");
    }
  }

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    authHelper(() => API.resetPassword(userId, password)).then((response: any) => {
      if (response === "SUCCESS") {
        navigate('/login/true');
      } else {
        setSnackbarType("error");
        setSnackbarMsg("Reset Failure");
        setOpenSnackbar(true);
      }
    }).catch((err: { response: { status: number; }; }) => {
      if (!err?.response) {
        setErrMsg('No Server Response');
        setSnackbarType("error");
        setSnackbarMsg("No Server Response");
        setOpenSnackbar(true);
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
    });
  }

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  }

  const getSnackbar = () => {
    return (
      <Snackbar anchorOrigin={{ "vertical": "top", "horizontal": "center" }} open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarType} sx={{ width: '100%' }}>{snackbarMsg}</Alert>
      </Snackbar>
    );
  }

  // const EMT = styled('span')<typeof Typography>(
  //   {
  //     color: "red",
  //     fontSize: "20",
  //     fontWeight: "600",
  //   },
  //   props => ({
  //     ref: errRef,
  //     aria-live: "assertive",
  //   })
  // )
  return (
    <>
      {getSnackbar()}
      <Grid container spacing={0} justifyContent="center" direction="row">
        <Grid item sx={{ mt: 25 }}>
          <StyledGrid container direction="column" justifyContent="center" spacing={2} >
            <StyledPaper variant="elevation" elevation={2} >
              <Grid item>
                {errMsg ? <ErrMsgTypography /*ref={errRef}*/ aria-live="assertive" >{errMsg}</ErrMsgTypography> : <OffscreenTypography /*ref={errRef}*/ aria-live="assertive" />}
              </Grid>
              <Grid item>
                <Typography component="h1" variant="h5">Reset Password</Typography>
              </Grid>
              <Grid item>
                <form onSubmit={handleSubmit}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <TextField
                        id="password"
                        type="password"
                        placeholder="Password"
                        variant="outlined"
                        value={password}
                        onChange={changePassword}
                        required
                        sx={{ width: "100%" }} />
                    </Grid>
                    <Grid item>
                      <TextField
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        variant="outlined"
                        value={confirmPassword}
                        onChange={changeConfirmPassword}
                        required
                        sx={{ width: "100%" }} />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={errMsg !== ""}
                        sx={{ width: "100%" }} >Submit</Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </StyledPaper >
          </StyledGrid >
        </Grid >
      </Grid >
    </>
  );
}

export default ResetPwd;