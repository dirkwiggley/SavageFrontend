import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormControl,
  Box,
  Paper,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Select,
  MenuItem,
  Stack,
  InputLabel,
  Typography,
  SelectChangeEvent,
  Snackbar,
  Alert,
  Autocomplete
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { useTranslation } from "react-i18next";
import { UserInterface } from '../types';

import { useAuthContext } from "./AuthStore";
import API, { authHelper, RoleType, isRole, isUserInterface } from '../api';
import { getLanguageFromId } from "./Locales";

import { AlertColor } from '@mui/material/Alert';

const PAPER_COLOR = "#99d6ff";
const LIGHT_PAPER_COLOR = "#a8e6f0";

const StackItem = styled(Box)(({ theme }) => ({
  // backgroundColor: PAPER_COLOR,
  selected: PAPER_COLOR,
  padding: theme.spacing(1),
  textAlign: 'left',
  or: theme.palette.text.secondary,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: PAPER_COLOR,
  width: '90%',
  justify: 'center',
  textAlign: 'center'
}));

const Users = () => {
  const { t, i18n } = useTranslation();

  const [auth, setAuth] = useAuthContext();
  const [users, setUsers] = useState<JSX.Element[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [login, setLogin] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [roles, setRoles] = useState<string[] | null>(null);
  const [locale, setLocale] = useState<string>("enUS");
  const [active, setActive] = useState<boolean>(false);
  const [resetpwd, setResetpwd] = useState<boolean>(false);
  const [refreshtoken, setRefreshToken] = useState<string | undefined>("");
  const [rolesList, setRolesList] = useState<string[] | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarType, setSnackbarType] = useState<AlertColor>("error");
  const [snackbarMsg, setSnackbarMsg] = useState<string>("");

  let navigate = useNavigate();

  function isRolesArray(obj: any): obj is Array<RoleType> {
    if (Array.isArray(obj) && (obj.length === 0 || isRole(obj[0])))
      return true;
    return false;
  }

  function isUserArray(obj: any): obj is Array<UserInterface> {
    if (Array.isArray(obj) && (obj.length === 0 || isUserInterface(obj[0])))
      return true;
    return false;
  }

  useEffect(() => {
    if (!auth || auth.login === "nobody") {
      navigate("/login/true");
    }
    
    const admin = auth ? auth.roles.includes('ADMIN') : false;
    if (!admin) {
      navigate("/home");
    } else {
      if (auth) {
        const resetPwd = (auth.resetpwd === false) ? false : true;
        setUserId(auth.id.toString());
        setLogin(auth.login);
        setNickname(auth.nickname);
        setEmail(auth.email);
        setRoles(auth.roles);
        setLocale(auth.locale);
        setActive(auth.active);
        setResetpwd(resetPwd);
        setRefreshToken(auth.refreshtoken);
      }
    }

    authHelper(API.getRoles).then(response => {
      if (isRolesArray(response)) {
        const newRoles: string[] = [];
        response.forEach(element => {
          newRoles.push(element.name);
        });
        if (newRoles.length > 1) {
          setRolesList(newRoles);
        } else {
          setRolesList(null);
        }
      }
    }).catch(err => {
      console.error(err);
    });

    authHelper(API.getUsers).then(response => {
      if (isUserArray(response)) {
        const newUsers: JSX.Element[] = [];
        response.forEach(element => {
          const elem = <MenuItem key={element.id} value={element.id}>{element.login}({element.nickname})</MenuItem>;
          newUsers.push(elem);
        });
        if (admin) {
          newUsers.push(<MenuItem key="add" value="add">{t('user.addauser')}</MenuItem>);
        }
        setUsers(newUsers);
      }
    }).catch(err => {
      console.error(err);
    });
  }, [auth, navigate, t]);

  const isAdmin = () => {
    return auth ? auth.roles.includes('ADMIN') : false;
  }

  const getUsersAndUpdateSelect = () => {
    authHelper(API.getUsers).then(response => {
      if (isUserArray(response)) {
        const newUsers = [];
        response.forEach(element => {
          newUsers.push(<MenuItem key={element.id} value={element.id}>{element.login}({element.nickname})</MenuItem>);
        });
        if (isAdmin()) {
          newUsers.push(<MenuItem key="add" value="add">{t('user.addauser')}</MenuItem>);
        }
        setUsers(newUsers);
      }
    }).catch(err => {
      console.error(err);
    });
  }

  const resetUser = (id = "") => {
    setUserId(id);
    setLogin("");
    setNickname("");
    setEmail("");
    setRoles(null);
    setLocale("enUS");
    setActive(false);
    setResetpwd(true);
    setRefreshToken("");
  }

  const handleSelectUser = (event: SelectChangeEvent<unknown>) => {
    const selectedId: string = event.target.value as string;
    setUserId(selectedId);
    if (selectedId === "add") {
      resetUser("add");
    } else {
      authHelper(() => API.getUser(Number(selectedId)))
        .then(response => {
          setLogin(response.login);
          setNickname(response.nickname);
          setEmail(response.email);
          setRoles(response.roles);
          setLocale(response.locale);
          setActive(response.active);
          setResetpwd(response.resetpwd);
          setRefreshToken(response.refreshtoken);
        }).catch(err => {
          setSnackbarType("error");
          const msg = t('user.erroruserdata');
          setSnackbarMsg(msg);
          setOpenSnackbar(true);
          resetUser();
        });
    }
  }

  const handleActive = () => {
    setActive(!active);
  }

  const handleResetpwd = () => {
    setResetpwd(!resetpwd);
  }

  const handleChangeRoles = (role: string) => {
    let filtered: string[] = [];
    let newRoles: string[] = [];
    if (roles) {
      newRoles = [...roles];
    }
    if (newRoles.includes(role)) {
      newRoles.forEach(element => {
        if (element !== role) {
          filtered.push(element)
        }
      });
      setRoles(filtered);
    } else {
      filtered = [...newRoles];
      filtered.push(role);
      setRoles(filtered);
    }
  }

  const handleUpdate = () => {
    const newRoles: string[] = roles ? roles : [];
    let userInfo: UserInterface = {
      id: Number(userId),
      login: login,
      nickname: nickname,
      email: email,
      roles: newRoles,
      locale: locale,
      active: active,
      resetpwd: resetpwd,
      refreshtoken: refreshtoken,
    }
    authHelper(() => API.updateUser(userInfo))
      .then(result => {
        if (result === "SUCCESS") {
          setSnackbarType("success");
          const msg = t('user.updatesuccess');
          setSnackbarMsg(msg);
          setOpenSnackbar(true);
          if (userInfo.id === auth?.id) {
            setAuth(userInfo);
          };
        } else {
          setSnackbarType("error");
          const msg = t('user.updatefailure');
          setSnackbarMsg(msg);
          setOpenSnackbar(true);
        }
        getUsersAndUpdateSelect();
      }).catch(err => {
        setSnackbarType("error");
        const msg = t('user.updatefailure');
        setSnackbarMsg(msg);
        setOpenSnackbar(true);
      });
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, elementName: string) => {
    // let element: HTMLElement | null = document.getElementById(elementName);
    // let value = element?.value;
    let value = event.target.value;
    if (elementName === "loginInput") {
      setLogin(value);
      getUsersAndUpdateSelect();
    } else if (elementName === "nicknameInput") {
      setNickname(value);
      getUsersAndUpdateSelect();
    } else if (elementName === "emailInput") {
      setEmail(value);
    } else {
      setSnackbarType("error");
      const msg = t('user.inputerror');
      setSnackbarMsg(msg);
      setOpenSnackbar(true);
    }
  }

  const getLoginInput = () => {
    if (userId === "add") {
      return (
        <TextField
          id="loginInput"
          label={t('user.login')}
          InputLabelProps={{ shrink: true }}
          autoComplete="off"
          value={login}
          onChange={(evt) => handleInputChange(evt, "loginInput")} />
      );
    } else {
      return (
        <TextField id="loginInput" variant="filled" value={login} label={t('user.login')}></TextField>
      );
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  }

  const getSnackbar = () => {
    return (
      <Snackbar anchorOrigin={{ "vertical": "top", "horizontal": "center" }} open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarType} sx={{ width: '100%'}}>{snackbarMsg}</Alert>
      </Snackbar>
    );
  }

  const isCheckedRole = (option: string): boolean => {
    if (!jsRoles) {
      return true;
    } else if (jsRoles.includes(option)) {
      return true;
    }
    return false;
  }

  let jsRolesList: string[] = [];
  if (rolesList) {
    jsRolesList = rolesList;
  }
  let jsRoles: string[] = [];
  if (roles) {
    jsRoles = roles;
  }

  const getLang = () => {

  }

  return (
    <Box
      display="flex"
      justifyContent="Center"
      sx={{
        width: '90%',
        mt: 1
      }}>
      {getSnackbar()}
      <StyledPaper square={false} >
        <Stack spacing={0}>
          <StackItem><h3>{t('user.title')}</h3></StackItem>
          <StackItem>
            <FormControl variant="filled" fullWidth>
              <InputLabel id="select-label">{t('user.user')}</InputLabel>
              <Select
                labelId="select-label"
                id="select-user"
                value={users?.length > 0 ? userId : ""}
                onChange={(evt) => handleSelectUser(evt)}
              >
                {users}
              </Select>
            </FormControl>
          </StackItem>
          <StackItem>
            <FormControl variant="filled" fullWidth>
              {getLoginInput()}
            </FormControl>
          </StackItem>
          <StackItem>
            <FormControl variant="filled" fullWidth>
              <TextField
                id="nicknameInput"
                label={t('user.nickname')}
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                value={nickname}
                onChange={(evt) => handleInputChange(evt, "nicknameInput")} />
            </FormControl>
          </StackItem>
          <StackItem>
            <FormControl variant="filled" fullWidth>
              <TextField
                id="emailInput"
                label={t('user.email')}
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                value={email}
                onChange={(evt) => handleInputChange(evt, "emailInput")} />
            </FormControl>
          </StackItem>
          <StackItem>
            <FormControl variant="filled" fullWidth>
              <TextField
                id="localeInput"
                label={t('user.locale')}
                InputLabelProps={{ shrink: true }}
                autoComplete="off"
                value={getLanguageFromId(locale)}
                disabled />
            </FormControl>
          </StackItem>
          <StackItem>
            <StyledPaper sx={{ backgroundColor: LIGHT_PAPER_COLOR, width: "100%" }}>
              <Typography sx={{ display: "flex", ml: 2, pt: 2 }} >
                {t('user.roles')}
              </Typography>
              <FormControl sx={{ width: "100%", ml: 2 }}>
                {jsRolesList.map((option) => (
                  <FormGroup key={option}>
                    {/* Is this option in the users roles? */}
                    <FormControlLabel control={<Checkbox checked={isCheckedRole(option)} />} label={option} onChange={() => handleChangeRoles(option)} />
                  </FormGroup>
                ))}
              </FormControl>
            </StyledPaper>
          </StackItem>
          <StackItem>
            <StyledPaper sx={{ backgroundColor: "#a8e6f0", width: "100%" }}>
              <Stack>
                <StackItem>
                  <Typography sx={{ p: 0, ml: 1 }}>
                    {t('user.misc')}
                  </Typography>
                </StackItem>
                <StackItem>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox id="active" checked={active} onClick={handleActive} sx={{ p: 0, ml: 2 }} />} label={t('user.active')} />
                  </FormGroup>
                </StackItem>
                <StackItem>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox id="resetpassword" checked={resetpwd} onClick={handleResetpwd} sx={{ p: 0, ml: 2 }} />} label={t('user.resetpwd')} />
                  </FormGroup>
                </StackItem>
              </Stack>
            </StyledPaper>
          </StackItem>
          <StackItem>
            <Button variant="contained" onClick={handleUpdate}>{t('user.update')}</Button>
          </StackItem>
        </Stack>
      </StyledPaper>
    </Box>
  );
}

export default Users;