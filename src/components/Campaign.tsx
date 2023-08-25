import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FormControl,
  Box,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  Stack,
  InputLabel,
  Typography,
  SelectChangeEvent,
  Snackbar,
  Alert,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  Grid,
} from "@mui/material"
import { styled } from '@mui/material/styles'
import { useTranslation } from "react-i18next"

import { useAuthContext } from "./AuthStore"
import API, { authHelper, isUserInterface } from '../api'
import { UserInterface } from "../types";
import { AlertColor } from '@mui/material/Alert'
import { MobileBox, NonMobileBox } from './MobileBox'
import { otherColors as oColors, otherColors } from "../theme"

export interface PlayerInterface {
  id: number; // When dealing with a User
  playerid?: number; // When dealing with a player
  nickname: string;
}

const StackItem = styled(Box)(({ theme }) => ({
  selected: oColors.paperColor,
  padding: theme.spacing(1),
  textAlign: 'left',
  or: theme.palette.text.secondary,
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: oColors.primaryMain,
  width: '90%',
  justify: 'center',
  textAlign: 'center',
  typography: {
    fontFamily: [
      'Caprasimo',
      'arial',
    ].join(','),
  },
}))

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: oColors.primaryLight,
    color: 'black',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #000000',
  },
}))

export interface CampaignInterface {
  id: number,
  name: string,
  ownerid: number,
  ownernickname: string,
  hindrances: number,
  attributes: number,
  skills: number,
  players?: Array<PlayerInterface>,
}

const Users = () => {
  const { t, i18n } = useTranslation()
  const inputRef = useRef(null)
  
  const [auth] = useAuthContext()
  const [users, setUsers] = useState<Array<PlayerInterface>>([])
  const [userIds, setUserIds] = useState<Array<number>>([])
  const [campaigns, setCampaigns] = useState<Array<CampaignInterface>>([])
  const [campaignId, setCampaignId] = useState<number>(0)
  const [campaignName, setCampaignName] = useState("")
  const [ownerId, setOwnerId] = useState(0)
  const [ownerNickname, setOwnerNickname] = useState("")
  const [hindrances, setHindrances] = useState(0)
  const [attributes, setAttributes] = useState(0)
  const [skills, setSkills] = useState(0)
  const [players, setPlayers] = useState<Array<PlayerInterface> | undefined>([])
  const [playerIds, setPlayerIds] = useState<Array<number>>([])
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [snackbarType, setSnackbarType] = useState<AlertColor>("error")
  const [snackbarMsg, setSnackbarMsg] = useState<string>("")
  const [showCampaignNameInput, setShowCampaignNameInput] = useState<boolean>(false)

  let navigate = useNavigate()
  const ADD_NEW = -1
  
  function isUserArray(obj: any): obj is Array<UserInterface> {
    if (Array.isArray(obj) && (obj.length === 0 || isUserInterface(obj[0])))
      return true
    return false
  }

  const copyPlayerIds = (players: Array<PlayerInterface>) => {
    const newPlayerIds:number[] = []
    players.forEach(player => {
      newPlayerIds.push(player.playerid ? player.playerid : player.id)
    });
    setPlayerIds(newPlayerIds)
  }

  const getCampaigns = (alternateCampaignName?: string) => {
    authHelper(API.getCampaigns).then(response => {
      if (API.isCampaignArray(response)) {
        setCampaigns(response);
        response.forEach(campaign => {
          if (campaign.name === alternateCampaignName ? alternateCampaignName : campaignName) {
            setCampaignId(campaign.id)
            setCampaignName(campaign.name)
            setOwnerId(campaign.ownerid)
            setOwnerNickname(campaign.ownernickname)
            setHindrances(campaign.hindrances)
            setAttributes(campaign.attributes)
            setSkills(campaign.skills)
            if (campaign.players) {
              setPlayers(campaign.players)
              copyPlayerIds(campaign.players)
            } else {
              setPlayers([])
              setPlayerIds([])
            }
          }
        }
      )
    }})
  }

  useEffect(() => {
    getCampaigns("SWADE")
  }, [])

  useEffect(() => {
    if (!auth || auth.login === "nobody") {
      navigate("/login/true")
    }

    authHelper(API.getUsers).then(response => {
      getUsers()
    }).catch(err => {
      console.error(err)
    });
  }, [auth, navigate])

  const getUsers = () => {
    authHelper(API.getUsers).then(response => {
      if (isUserArray(response)) {
        const newUsers: Array<PlayerInterface> = []
        const newUserIds: Array<number> = []
        response.forEach(element => {
          const elem = {id: element.id, nickname: element.nickname };
          newUsers.push(elem);
          newUserIds.push(element.id);
        });
        setUsers(newUsers);
        setUserIds(newUserIds);
      }
    }).catch(err => {
      console.error(err);
    });
  }

  const resetCampaign = () => {
    const defaultCampaign = campaigns.find(campaign => campaignName === "SWADE");
    if (defaultCampaign) {
      setCampaignId(defaultCampaign.id);
      setCampaignName(defaultCampaign.name);
      setOwnerId(defaultCampaign.ownerid);
      setOwnerNickname(defaultCampaign.ownernickname);
      setHindrances(defaultCampaign.hindrances);
      setAttributes(defaultCampaign.attributes);
      setSkills(defaultCampaign.skills);
      setPlayers([]);
      setPlayerIds([]);
    } else {
      setSnackbarType("error");
      const msg = t('campaign.dataerror');
      setSnackbarMsg(msg);
      setOpenSnackbar(true);
    }
  }

  const handleSelectCampaign = (event: SelectChangeEvent<unknown>) => {
    const selectedId: number= event.target.value as number;
    setCampaignId(selectedId);
    if (selectedId === ADD_NEW) {
      resetCampaign();
      setCampaignName("New Campaign");
      setShowCampaignNameInput(true);
    } else {
      authHelper(() => API.getCampaignById(Number(selectedId)))
        .then(response => {
          setCampaignId(response.data.id)
          setCampaignName(response.data.name)
          setOwnerId(response.data.ownerid)
          setOwnerNickname(response.data.ownernickname)
          setHindrances(response.data.hindrances)
          setAttributes(response.data.attributes)
          setSkills(response.data.skills)
          setPlayers(response.data.players)
          copyPlayerIds(response.data.players)
        }).catch(err => {
          setSnackbarType("error")
          const msg = t('campaign.dataerror')
          setSnackbarMsg(msg)
          setOpenSnackbar(true)
          resetCampaign()
        });
    }
  }

  const getCleanPlayers = (): PlayerInterface[] => {
    const cleanPlayers: PlayerInterface[] = []
    if (players) {
      players.forEach(player => {
        const id = player.playerid ? player.playerid : player.id
        const user = users.find(user => user.id === id)
        let nickname = "default"
        if (user) {
          nickname = user.nickname
        }
        cleanPlayers.push({id: id, nickname: nickname})
      });
    }
    return cleanPlayers
  }

  const handleUpdate = () => {
    const cleanPlayers = getCleanPlayers()
    let campaignInfo: CampaignInterface = {
      id: campaignId, 
      name: campaignName, 
      ownerid: ownerId, 
      ownernickname: ownerNickname, 
      hindrances: hindrances, 
      attributes:attributes,
      skills: skills,
      players: cleanPlayers
    }
    if (campaignId === ADD_NEW) {
      authHelper(() => API.createCampaign(campaignInfo))
      .then(response => {
        setSnackbarType("success");
        const msg = t('campaign.success');
        setSnackbarMsg(msg);
        setOpenSnackbar(true);
        resetCampaign();
        setShowCampaignNameInput(false);
        getCampaigns();
      }).catch(error => {
          setSnackbarType("error");
          const msg = t('campaign.dataerror');
          setSnackbarMsg(msg);
          setOpenSnackbar(true);
          resetCampaign();
      })
    } else {
      authHelper(() => API.updateCampaign(campaignInfo))
      .then(response => {
        setSnackbarType("success");
        const msg = t('campaign.success');
        setSnackbarMsg(msg);
        setOpenSnackbar(true);
        setShowCampaignNameInput(false);
        getCampaigns();
      }).catch(error => {
        setSnackbarType("error");
        const msg = t('campaign.dataerror');
        setSnackbarMsg(msg);
        setOpenSnackbar(true);
        resetCampaign();
    })}
  }

  const getCampaignItems = () => {
    const camps: Array<ReactElement<any, any>> = [<MenuItem key="addNew" value={ADD_NEW}>Add New</MenuItem>];
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
    } else {
      setSnackbarType("error");
      const msg = t('user.inputerror');
      setSnackbarMsg(msg);
      setOpenSnackbar(true);
    }
  }

  const handleChangePlayers = (event: SelectChangeEvent<Array<Number>>) => {
    const clickedId = Number(event.target.value);
  
    // Redo selected
    const preCount = playerIds ? playerIds.length : 0;
    const newPlayerList = players ? players?.filter(player => player.id !== clickedId) : [];
    const postCount = newPlayerList ? newPlayerList.length : 0;
    if (postCount < preCount) {
      // remove from list
      setPlayers(newPlayerList);
      copyPlayerIds(newPlayerList);
    } else {
      // Add new user
      const addUser = users.find(user => user.id === clickedId)
      if (addUser) {
        newPlayerList.push(addUser);
        setPlayers(newPlayerList);
        copyPlayerIds(newPlayerList);
      }
    }
  };

  const getUserName = (userId: number): string => {
    const user = users?.find(user => user.id === userId);
    if (user) {
      return user.nickname;
    } else {
      return "";
    }
  }

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

  const isASCII = (str: string) => {
    return /^[\x00-\x7F]*$/.test(str);
  }

  const textEntered = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;
    if (e.key === "Escape") {
      setCampaignName("SWADE");
      const swadeId = campaigns.find(campaign => campaign.name === "SWADE");
      if (swadeId) {
        setCampaignId(swadeId.id);
        setPlayerIds([]);
        setPlayers([]);
      }
      setShowCampaignNameInput(false);
    } else if (e.key === "Enter") {
      setCampaignId(ADD_NEW);
      const campaignName = value;
      setCampaignName(campaignName);
      const newOwnerId = auth ? auth.id : 0;
      setOwnerId(newOwnerId);
      const ownerNickname = auth ? auth.nickname : "";
      setOwnerNickname(ownerNickname);
    } else if (e.key === "Backspace") {
      if (value.length > 0) setCampaignName(value.substring(0, value.length-1));
    } else if (e.key.length === 1 && isASCII(value+e.key)) {
      setCampaignName(value+e.key);
    }
  };

  const editorClicked = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const getCampaignNameElement = () => {
    if (showCampaignNameInput) {
      return (
        <CustomTooltip title="While selected escape to close">
          <TextField
            id="campaignNameInput"
            label={t('campaign.campaignname')}
            InputLabelProps={{ shrink: true }}
            autoComplete="off"
            value={campaignName}
            onKeyUp={(e) => textEntered(e as React.KeyboardEvent<HTMLInputElement>)}
            onClick={(e) => editorClicked(e)}
            autoFocus
          />
        </CustomTooltip>
      );
    } else {
      return (
        <>
          <InputLabel id="select-label">{t('campaign.selectcampaign')}</InputLabel>
          <Select
            ref={inputRef}
            labelId="select-label"
            id="select-campaign"
            value={campaigns?.length > 0 ? campaignId : ""}
            onChange={(evt) => handleSelectCampaign(evt)}
          >
            {getCampaignItems()}
          </Select>
        </>        
      )
    }
  }

  const getGenericPage = () => {
    return (
      <Box
        display="flex"
        justifyContent="Center"
        sx={{
          minWidth: '50%',
          mt: 3
        }}
      >
        {getSnackbar()}
        <StyledPaper square={false} >
          <Stack spacing={0}>
            <StackItem><Typography variant="h5" component="span" sx={{ mr: 2 }}>{t('campaign.title')}</Typography></StackItem>
            <StackItem>
              <FormControl variant="filled" fullWidth>
                {getCampaignNameElement()}
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
                  disabled={campaignName==="SWADE"}
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
                  disabled={campaignName==="SWADE"}
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
                  disabled={campaignName==="SWADE"}
                  onChange={(evt) => handleInputChange(evt, "skills")} />
              </FormControl>
            </StackItem>
            <StackItem>
              <Typography>{t('campaign.players')}</Typography>
              <FormControl variant="filled" fullWidth sx={{bgcolor: oColors.primaryMain, color: oColors.primaryMain}}>
                <Select
                  id="select-players"
                  onChange={handleChangePlayers}
                  multiple={true}
                  variant="filled"
                  value={playerIds}
                  disabled={campaignName==="SWADE"}
                  native
                  >
                    {userIds.map(userId => (
                      <option key={userId} value={userId}>
                        {getUserName(userId)}
                      </option>
                    ))}
                </Select>
              </FormControl>
            </StackItem>
            <StackItem>
                <Button disabled={campaignName==="SWADE"} variant="contained" sx={{ width: "100%", bgcolor: otherColors.primaryLight }} onClick={handleUpdate}>{t('campaign.save')}</Button>
            </StackItem>
          </Stack>
        </StyledPaper>
      </Box>
    );
  }

  return (
    <>
      <MobileBox>
        {getGenericPage()}
      </MobileBox>
      <NonMobileBox>
        <Grid container>
          <Grid item xs></Grid>
          <Grid item xs={3}>
            {getGenericPage()}
          </Grid>
          <Grid item xs></Grid>
        </Grid>
      </NonMobileBox>
    </>
  );
}

export default Users;