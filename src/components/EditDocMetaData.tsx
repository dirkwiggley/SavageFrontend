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

export interface DocumentListInterface {
  id: number,
  ownerid: number,
  campaignid: number,
  title: string,
  description?: string,
}

export interface DocumentInterface {
  id: number,
  ownerid: number,
  campaignid: number,
  title: string,
  description: string,
  read?: number[],
  write?: number[],
  delete?: number[],
}

const ADD_NEW: number = -1;

interface MetaDataPropsInterface {
  campaignId: number,
  documentId: number
}

const EditDocMetaData = (props: MetaDataPropsInterface) => {
  const { t, i18n } = useTranslation()
  const inputRef = useRef(null)
  
  const [auth] = useAuthContext()
  const [users, setUsers] = useState<Array<PlayerInterface>>([])
  const [userIds, setUserIds] = useState<Array<number>>([])
  const [campaignId, setCampaignId] = useState<number>(props.campaignId)
  const [campaignName, setCampaignName] = useState<string>("")
  const [description, setDescription] = useState("")
  const [ownerId, setOwnerId] = useState(0)
  const [documentId, setDocumentId] = useState<number>(props.documentId)
  const [title, setTitle] = useState("")
  const [read, setRead] = useState<Array<number>>([])
  const [write, setWrite] = useState<Array<number>>([])
  const [del, setDel] = useState<Array<number>>([])
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [snackbarType, setSnackbarType] = useState<AlertColor>("error")
  const [snackbarMsg, setSnackbarMsg] = useState<string>("")

  let navigate = useNavigate()
  const ADD_NEW = -1
  
  function isUserArray(obj: any): obj is Array<UserInterface> {
    if (Array.isArray(obj) && (obj.length === 0 || isUserInterface(obj[0])))
      return true
    return false
  }

  const getDocumentInfo = () => {
    authHelper(() => API.getDocument(documentId)).then(response => {
      setTitle(response.title)
      setOwnerId(response.ownerid)
      setDescription(response.desc ? response.desc : "")
    })
  }

  useEffect(() => {
    authHelper(() => API.getCampaignById(campaignId)).then(response => {
      setCampaignName(response.data.name)
    })
    getDocumentInfo()
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

  const resetDocument = (newCampaign: boolean = false) => {
    if (auth !== null) {
      setOwnerId(auth.id)
      setDocumentId(0)
    }
    setCampaignId(0);
    setTitle("");
    setDescription("");
    setRead([]);
    setWrite([]);
    setDel([]);
  }

  const handleSelectDocument = (event: SelectChangeEvent<unknown>) => {
    const selectedId: number= event.target.value as number
    if (selectedId === ADD_NEW) {
      const newDocument = true
      resetDocument()
    } else {
      authHelper(() => API.getDocument(Number(selectedId)))
        .then(response => {
          setDocumentId(response.data.id)
          setCampaignId(response.data.id)
          setOwnerId(response.data.ownerid)
          setTitle(response.data.title)
          setRead(response.data.read)
          setWrite(response.data.write)
          setDel(response.data.del)
        }).catch(err => {
          setSnackbarType("error")
          const msg = t('documentmetadata.error')
          setSnackbarMsg(msg)
          setOpenSnackbar(true)
          resetDocument()
        });
    }
  }


  const handleUpdate = () => {
    let documentInfo: DocumentInterface = {
      id: documentId, 
      title: title,
      ownerid: ownerId, 
      campaignid: campaignId,
      description: description, 
      read: read,
      write: write,
      delete: del
    }
    authHelper(() => API.createDocument(documentInfo))
    .then(response => {
      setSnackbarType("success")
      const msg = t('documentmetadata.success')
      setSnackbarMsg(msg)
      setOpenSnackbar(true)
    }).catch(error => {
        setSnackbarType("error")
        const msg = t('documentmetadata.error')
        setSnackbarMsg(msg)
        setOpenSnackbar(true)
    })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, elementName: string) => {
    let value = event.target.value;
    if (elementName === "title") {
      setTitle(value)
    } else if (elementName === "description") {
      setDescription(value)
    } else if (elementName === "read") {
      // setRead(value)
    } else if (elementName === "write") {
      // setWrite(value)
    } else if (elementName === "del") {
      // setDel(value)
    } else {
      setSnackbarType("error");
      const msg = t('user.inputerror');
      setSnackbarMsg(msg);
      setOpenSnackbar(true);
    }
  }

  const handleChangePermissions = (event: SelectChangeEvent<Array<Number>>) => {
    const clickedId = Number(event.target.value);
  
    // // Redo selected
    // const preCount = playerIds ? playerIds.length : 0;
    // const newPlayerList = players ? players?.filter(player => player.id !== clickedId) : [];
    // const postCount = newPlayerList ? newPlayerList.length : 0;
    // if (postCount < preCount) {
    //   // remove from list
    //   setPlayers(newPlayerList);
    //   copyPlayerIds(newPlayerList);
    // } else {
    //   // Add new user
    //   const addUser = users.find(user => user.id === clickedId)
    //   if (addUser) {
    //     newPlayerList.push(addUser);
    //     setPlayers(newPlayerList);
    //     copyPlayerIds(newPlayerList);
    //   }
    // }
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
            <StackItem><Typography variant="h5" component="span" sx={{ mr: 2 }}>{t('documentmetadata.title')}</Typography></StackItem>
            <StackItem>
              <FormControl variant="filled" fullWidth>
                <TextField
                  id="campaignNameInput"
                  label={t('campaign.campaignname')}
                  InputLabelProps={{ shrink: true }}
                  value={campaignName}
                  autoFocus
                  disabled={true}
                />
              </FormControl>
            </StackItem>
            <StackItem>
              <FormControl variant="filled" fullWidth>
                <TextField
                  id="titleInput"
                  label={t('documentmetadata.documenttitle')}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  value={title}
                  disabled={false}
                  onChange={(evt) => handleInputChange(evt, "title")}
                />
              </FormControl>
            </StackItem>
            <StackItem>
              <FormControl variant="filled" fullWidth>
                <TextField
                  id="descriptionInput"
                  label={t('documentmetadata.description')}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  value={description}
                  disabled={false}
                  onChange={(evt) => handleInputChange(evt, "description")} />
              </FormControl>
            </StackItem>
            <StackItem>
              <FormControl variant="filled" fullWidth>
                <TextField
                  id="readInput"
                  label={t('documentmetadata.read')}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  value={read}
                  disabled={false}
                  onChange={(evt) => handleInputChange(evt, "read")} />
              </FormControl>
            </StackItem>
            <StackItem>
              <FormControl variant="filled" fullWidth>
              <TextField
                  id="writeInput"
                  label={t('documentmetadata.write')}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  value={read}
                  disabled={false}
                  onChange={(evt) => handleInputChange(evt, "write")} />
              </FormControl>
            </StackItem>
            <StackItem>
              <FormControl variant="filled" fullWidth sx={{bgcolor: oColors.primaryMain, color: oColors.primaryMain}}>
              <TextField
                  id="deleteInput"
                  label={t('documentmetadata.delete')}
                  InputLabelProps={{ shrink: true }}
                  autoComplete="off"
                  value={read}
                  disabled={false}
                  onChange={(evt) => handleInputChange(evt, "delete")} />
              </FormControl>
            </StackItem>
            <StackItem>
                <Button disabled={false} variant="contained" sx={{ width: "100%", bgcolor: otherColors.primaryLight }} onClick={handleUpdate}>{t('documentmetadata.save')}</Button>
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

export default EditDocMetaData;