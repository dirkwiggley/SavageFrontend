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

const SelectCampaign = () => {
  const { t, i18n } = useTranslation()
  const inputRef = useRef(null)
  
  const [auth, setAuth] = useAuthContext()
  const [campaigns, setCampaigns] = useState<Array<CampaignInterface>>([])
  const [campaignId, setCampaignId] = useState<number>(0)
  const [campaignName, setCampaignName] = useState<string>("")
  const [ownerId, setOwnerId] = useState<number>(0)
  const [playerIds, setPlayerIds] = useState<number[]>([])
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [snackbarType, setSnackbarType] = useState<AlertColor>("error")
  const [snackbarMsg, setSnackbarMsg] = useState<string>("")

  let navigate = useNavigate()
  const ADD_NEW = -1
  
  const copyPlayerIds = (players: Array<PlayerInterface>) => {
    const newPlayerIds:number[] = []
    players.forEach(player => {
      newPlayerIds.push(player.playerid ? player.playerid : player.id)
    });
    return newPlayerIds
  }

  const getCampaigns = (selectedCampaignName?: string) => {
    authHelper(API.getCampaigns).then(response => {
      if (API.isCampaignArray(response)) {
        setCampaigns(response);
        response.forEach(campaign => {
          if (campaign.name === selectedCampaignName ? selectedCampaignName : campaignName) {
            setCampaignId(campaign.id)
            setCampaignName(campaign.name)
            setOwnerId(campaign.ownerid)
            if (campaign.players) {
              setPlayerIds(copyPlayerIds(campaign.players))
            } else {
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
  }, [])

  const resetCampaign = () => {
    const defaultCampaign = campaigns.find(campaign => campaignName === "SWADE")
    if (defaultCampaign) {
      setCampaignId(defaultCampaign.id)
      setCampaignName(defaultCampaign.name)
      setOwnerId(defaultCampaign.ownerid)
      setPlayerIds([])
    } else {
      setSnackbarType("error")
      const msg = t('campaign.dataerror')
      setSnackbarMsg(msg)
      setOpenSnackbar(true)
    }
  }

  const handleSelectCampaign = (event: SelectChangeEvent<unknown>) => {
    const selectedId: number= event.target.value as number
    setCampaignId(selectedId)
    authHelper(() => API.getCampaignById(Number(selectedId)))
      .then(response => {
        setCampaignId(response.data.id)
        setCampaignName(response.data.name)
        setOwnerId(response.data.ownerid)
        setPlayerIds(copyPlayerIds(response.data.players))
      }).catch(err => {
        setSnackbarType("error")
        const msg = t('campaign.dataerror')
        setSnackbarMsg(msg)
        setOpenSnackbar(true)
        resetCampaign()
      })

      if (auth && selectedId) {
        const selectedCampaign = campaigns.find(campaign => campaign.id === selectedId)
        if (selectedCampaign) auth.campaignname = selectedCampaign.name
        auth.campaignid = selectedId
        auth.campaignname = selectedCampaign?.name
        setAuth(auth)
        authHelper(() => API.updateUser(auth))
        .then(result => {
          if (result === "SUCCESS") {
            setSnackbarType("success")
            const msg = t('user.updatesuccess')
            setSnackbarMsg(msg)
            setOpenSnackbar(true)
          } else {
            throw new Error()
          }
        }).catch(err => {
          setSnackbarType("error")
          const msg = t('user.updatefailure')
          setSnackbarMsg(msg)
          setOpenSnackbar(true)
        });
      }
  }

  const getPlayers = (): number[] => {
    campaigns.forEach(campaign => {
      if (campaign.id === campaignId) {
        if (campaign.players)
          return copyPlayerIds(campaign.players)
      }
    })
    return []
  }

  const getCampaignItems = () => {
    // const camps: Array<ReactElement<any, any>> = [<MenuItem key="addNew" value={ADD_NEW}>Add New</MenuItem>];
    const camps: Array<ReactElement<any, any>> = [];
    campaigns.forEach(campaign => {
      camps.push(<MenuItem key={campaign.id} value={campaign.id}>{campaign.name}</MenuItem>);
    });
    return camps
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
              </FormControl>
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

export default SelectCampaign;