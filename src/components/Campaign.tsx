import { blueGrey } from '@mui/material/colors';
import React, { ReactElement, useEffect, useState } from 'react';
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
  Autocomplete,
  Grid,
  ListItemText
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { useTranslation } from "react-i18next";

import { useAuthContext } from "./AuthStore";
import API, { authHelper, RoleType, isRole, isUserInterface } from '../api';
import { UserInterface } from "../types";
import { AlertColor } from '@mui/material/Alert';
import { MobileBox, NonMobileBox } from './MobileBox';
import { otherColors as oColors } from "../theme";

export interface PlayerInterface {
  id: number;
  nickname: string;
}

const StackItem = styled(Box)(({ theme }) => ({
  // backgroundColor: PAPER_COLOR,
  selected: oColors.paperColor,
  padding: theme.spacing(1),
  textAlign: 'left',
  or: theme.palette.text.secondary,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  //backgroundColor: PAPER_COLOR,
  backgroundColor: "rgba(210, 180, 140, 0.5)",
  width: '90%',
  justify: 'center',
  textAlign: 'center',
  typography: {
    fontFamily: [
      'Caprasimo',
      'arial',
    ].join(','),
  },
}));

export interface CampaignInterface {
  id: number,
  name: string,
  ownerId: number,
  ownernickname: string,
  hindrances: number,
  attributes: number,
  skills: number,
  source: string,
  players?: Array<PlayerInterface>,
}

const Users = () => {
  const { t, i18n } = useTranslation();

  const [auth, setAuth] = useAuthContext();
  const [users, setUsers] = useState<Array<PlayerInterface>>([]);
  const [campaigns, setCampaigns] = useState<Array<CampaignInterface>>([])
  const [campaignId, setCampaignId] = useState(0);
  const [campaignName, setCampaignName] = useState("");
  const [ownerId, setOwnerId] = useState(0);
  const [ownerNickname, setOwnerNickname] = useState("");
  const [hindrances, setHindrances] = useState(0);
  const [attributes, setAttributes] = useState(0);
  const [skills, setSkills] = useState(0);
  const [players, setPlayers] = useState<Array<PlayerInterface>>([]);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarType, setSnackbarType] = useState<AlertColor>("error");
  const [snackbarMsg, setSnackbarMsg] = useState<string>("");

  let navigate = useNavigate();

  function isUserArray(obj: any): obj is Array<UserInterface> {
    if (Array.isArray(obj) && (obj.length === 0 || isUserInterface(obj[0])))
      return true;
    return false;
  }

  useEffect(() => {
    authHelper(API.getCampaigns).then(response => {
      if (API.isCampaignArray(response)) {
        setCampaigns(response);
        response.forEach(campaign => {
          if (campaign.name === "SWADE") {
            setCampaignId(campaign.id);
            setCampaignName(campaign.name);
            setOwnerId(campaign.ownerId);
            setOwnerNickname(campaign.ownernickname);
            setHindrances(campaign.hindrances);
            setAttributes(campaign.attributes);
            setSkills(campaign.skills);
            if (campaign.players) {
              setPlayers(campaign.players);
            } else {
              setPlayers([]);
            }
          }
        }
      )
    }})
  }, []);

  useEffect(() => {
    if (!auth || auth.login === "nobody") {
      navigate("/login/true");
    }

    const admin = auth ? auth.roles.includes('ADMIN') : false;

    authHelper(API.getUsers).then(response => {
      getPlayersAndUpdateSelect()
    }).catch(err => {
      console.error(err);
    });
  }, [auth, navigate]);

  const isAdmin = () => {
    return auth ? auth.roles.includes('ADMIN') : false;
  }

  const getPlayersAndUpdateSelect = () => {
    authHelper(API.getUsers).then(response => {
      if (isUserArray(response)) {
        const newUsers: Array<PlayerInterface> = [];
        response.forEach(element => {
          const elem = {id: element.id, nickname: element.nickname };
          newUsers.push(elem);
        });
        setUsers(newUsers);
      }
    }).catch(err => {
      console.error(err);
    });
  }

  const resetCampaign = () => {

  }

  const handleSelectCampaign = (event: SelectChangeEvent<unknown>) => {
    const selectedId: number = event.target.value as number;
    const NONE = 0;
    const ADD = -1;
    setCampaignId(selectedId);
    if (selectedId === ADD) {
      resetCampaign();
    } else {
      authHelper(() => API.getCampaignById(Number(selectedId)))
        .then(response => {
          setCampaignId(response.id);
          setCampaignName(response.campaignname);
          setOwnerId(response.ownerid);
          setOwnerNickname(response.ownernickname);
          setHindrances(response.hindrances);
          setAttributes(response.attributes);
          setSkills(response.skills);
          setPlayers(response.players);
        }).catch(err => {
          setSnackbarType("error");
          const msg = t('user.erroruserdata');
          setSnackbarMsg(msg);
          setOpenSnackbar(true);
          resetCampaign();
        });
    }
  }


  const handleUpdate = () => {

  }

  const handleCopy = () => {

  }

  const getCampaigns = () => {
    const camps: Array<ReactElement<any, any>> = [<MenuItem key="addNew" value="addNew">Add New</MenuItem>];
    campaigns.forEach(campaign => {
      camps.push(<MenuItem key={campaign.id} value={campaign.id}>{campaign.name}</MenuItem>);
    });
    return camps
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, elementName: string) => {
    let value = event.target.value;
    if (elementName === "campaignName") {
      setCampaignName(value);
    } else if (elementName === "hindrances") {
      setHindrances(Number(value));
    } else if (elementName === "attributes") {
      setAttributes(Number(value));
    } else if (elementName === "skills") { 
      setSkills(Number(value));
    } else if (elementName === "players") {
      const players = JSON.parse(value);
      setPlayers(players);
      getPlayersAndUpdateSelect();
    } else {
      setSnackbarType("error");
      const msg = t('user.inputerror');
      setSnackbarMsg(msg);
      setOpenSnackbar(true);
    }
  }

  const handleChangePlayers = (event: SelectChangeEvent<typeof Array<PlayerInterface>>) => {
    const {
      target: { value },
    } = event;
    // TODO:
    // setPlayers(
      // On autofill we get a stringified value.
      // typeof value === 'string' ? value.split(',') : value,
    // );
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  }

  const getSnackbar = () => {
    return (
      <Snackbar anchorOrigin={{ "vertical": "top", "horizontal": "center" }} open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarType} sx={{ width: '100%' }}>{snackbarMsg}</Alert>
      </Snackbar>
    );
  }

  const PLAYER_SELECT_ITEM_HEIGHT = 48;
  const PLAYER_SELECT_ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: PLAYER_SELECT_ITEM_HEIGHT * 4.5 + PLAYER_SELECT_ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const isPlayerChecked = (id: number) => {
    const player = players.find(player => player.id === id);
    if (player) return true;
    return false;
  }

  const getGenericPage = () => {
    return (
      <>
        {getSnackbar()}
        <StyledPaper square={false} >
          <Stack spacing={0}>
            <StackItem><Typography variant="h5" component="span" sx={{ mr: 2 }}>{t('campaign.title')}</Typography></StackItem>
            <StackItem>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="select-label">{t('campaign.selectcampaign')}</InputLabel>
                <Select
                  labelId="select-label"
                  id="select-campaign"
                  value={campaigns?.length > 0 ? campaignId : ""}
                  onChange={(evt) => handleSelectCampaign(evt)}
                >
                  {getCampaigns()}
                </Select>
              </FormControl>
            </StackItem>
            <StackItem>
              <FormControl variant="filled" fullWidth>
                <TextField
                  id="ownerNicknameInput"
                  label={t('campaign.ownernickname')}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  value={ownerNickname}
                  disabled={true}
                />
              </FormControl>
            </StackItem>
            <StackItem>
              <FormControl variant="filled" fullWidth>
                <TextField
                  id="hindrancesInput"
                  label={t('campaign.hindrances')}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  value={hindrances}
                  onChange={(evt) => handleInputChange(evt, "hindrances")} />
              </FormControl>
            </StackItem>
            <StackItem>
              <FormControl variant="filled" fullWidth>
                <TextField
                  id="attributesInput"
                  label={t('campaign.attributes')}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  value={attributes}
                  onChange={(evt) => handleInputChange(evt, "attributes")} />
              </FormControl>
            </StackItem>
            <StackItem>
              <FormControl variant="filled" fullWidth>
                <TextField
                  id="skillsInput"
                  label={t('campaign.skills')}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  value={skills}
                  onChange={(evt) => handleInputChange(evt, "skills")} />
              </FormControl>
            </StackItem>
            <StackItem>
              <Typography>{t('campaign.players')}</Typography>
              <FormControl variant="filled" fullWidth>
                <Select
                  id="select-players-checkbox"
                  onChange={handleChangePlayers}
                  // MenuProps={MenuProps}
                  inputProps={{ id: 'select-multiple-native' }}
                  multiple
                  native
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.nickname}
                      </option>
                      // <MenuItem key={user.id} value={user.nickname}>
                      //   <Checkbox checked={isPlayerChecked(user.id)} />
                      //   <ListItemText primary={user.nickname} />
                      // </MenuItem>
                    ))}
                  </Select>
              </FormControl>
            </StackItem>
            <StackItem>
              <Button variant="contained" sx={{ width:"50%" }} onClick={handleCopy}>{t('campaign.copy')}</Button><Button variant="contained" sx={{ width:"50%" }} onClick={handleUpdate}>{t('campaign.update')}</Button>
            </StackItem>
          </Stack>
        </StyledPaper>
      </>
    );
  }

  const getMobileCampaignPage = () => {
    return (
      <Box
        display="flex"
        justifyContent="Center"
        sx={{
          minWidth: '50%',
          mt: 3
        }}>
        {getGenericPage()}
      </Box>
    );
  }

  const getNonMobileCampaignPage = () => {
    return (
      <Box
        display="flex"
        justifyContent="Center"
        sx={{
          minWidth: '50%',
          mt: 3
        }}>
        {getGenericPage()}
      </Box>
    );
  }

  return (
    <>
      <MobileBox>
        {getMobileCampaignPage()}
      </MobileBox>
      <NonMobileBox>
        <Grid container>
          <Grid item xs></Grid>
          <Grid item xs={3}>
            {getNonMobileCampaignPage()}
          </Grid>
          <Grid item xs></Grid>
        </Grid>
      </NonMobileBox>
    </>
  );
}

export default Users;