import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Link as Muilink, Button } from "@mui/material";
import { styled } from '@mui/material/styles';
// import { useTranslation } from "react-i18next";
import { useAuthContext } from "./AuthStore";
// import { getLanguageFromId } from "./Locales";
import API from '../api';
import SocketController from "../SocketController";
import { UserInterface } from "../types.js";
  
const StyledPaper = styled(Paper)(({ theme }) => ({
  justifyContent: "center",
  minHeight: "20vh",
  padding: "50px",
  backgroundColor: "background.scissors",
}));

const CombatTracker = () => {
  const NO_TRACKER_SELECTED = 0;
  
  const [auth, setAuth] = useAuthContext();

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsId, setWsId] = useState<number>(0);
  const [socketController, setSocketController] = useState<SocketController | null>(null);
  const [currentTrackerId, setCurrentTrackerId] = useState<number>(NO_TRACKER_SELECTED);

  let navigate = useNavigate();

  useEffect(() => {
    if (!auth || auth.login === "nobody") {
      navigate("/login/true");
    }
  }, [auth, navigate]);

  const handleSubmit = () => {

  }

  const getSocketController = () : SocketController => {
    let sc: SocketController | null = socketController;
    if (!sc) {
      sc = new SocketController();
      setSocketController(sc);
    }
    return sc;
  }

  const handleCreateWebSocket = () => {
    const sc = getSocketController();
    sc.createWebSocket(auth as UserInterface);
  }

  const handleCreateTracker = () => {
    const sc = getSocketController();
    const data = { name: "First Tracker", gamemaster_id: auth?.id, gamemaster_name: auth?.nickname };
    sc.createTracker(data);
  }

  const handleJoinTracker = () => {
    const sc = getSocketController();
    const GET_A_REAL_TRACKER_ID = 1;
    setCurrentTrackerId(GET_A_REAL_TRACKER_ID);
    const authId = (auth && auth.id) ? auth.id : 0;
    const nickname = (auth && auth.nickname) ? auth.nickname : "";
    sc.joinTracker(GET_A_REAL_TRACKER_ID, authId, nickname);
  }

  const handleRemoveUserFromTracker = () => {
    if (currentTrackerId !== NO_TRACKER_SELECTED) {
      const sc = getSocketController();
      const authId = (auth && auth.id) ? auth.id : 0;
      sc.removeUserFromTracker(currentTrackerId, authId);
    }
  }

  const handleGetTrackers = () => {
    const sc = getSocketController();
    sc.getTrackers();
  }

  const handleGetTrackerUsers = () => {
    const sc = getSocketController();
    sc.getTrackerUsers(1);
  }

  // Test of getting a specific web socket on the server side
  const handleSendMessage = () => {
    if (auth && auth.id) {
      API.sendWSMsg(auth.id, 2, "Howdy")
      .then(response => {
        console.log(response, null, 2);
      });
    }
  }
  
  return (
    <Grid container spacing={0} justifyContent="center" direction="row">
      <Grid item >
        <Grid container direction="column" justifyContent="center" spacing={2} sx={{
          justifyContent: "center",
          minHeight: "90vh"
        }} >
          <StyledPaper variant="elevation" elevation={2} sx={{ bgcolor: "background.lightestBlue" }}>
            <Grid item>
              <Typography component="h1" variant="h5">COMBAT TRACKER</Typography>
            </Grid>
            <Grid item>
              <Button  sx={{mt:2, width: "100%"}} variant="contained" color="primary" onClick={handleCreateWebSocket}>Create Web Socket</Button>
            </Grid>
            <Grid item>
              <Button sx={{mt:2, width: "100%"}} variant="contained" color="primary" onClick={handleCreateTracker}>Create Tracker</Button>
            </Grid>
            <Grid item>
              <Button sx={{mt:2, width: "100%"}} variant="contained" color="primary" onClick={handleJoinTracker}>Join Tracker</Button>
            </Grid>
            <Grid item>
              <Button sx={{mt:2, width: "100%"}} variant="contained" color="primary" onClick={handleRemoveUserFromTracker}>Leave Tracker</Button>
            </Grid>
            <Grid item>
              <Button sx={{mt:2, width: "100%"}} variant="contained" color="primary" onClick={handleGetTrackers}>Get Trackers</Button>
            </Grid>
            <Grid item>
              <Button sx={{mt:2, width: "100%"}} variant="contained" color="primary" onClick={handleGetTrackerUsers}>Get Tracker Users</Button>
            </Grid>
            <Grid item>
              <Button sx={{mt:2, width: "100%"}} variant="contained" color="primary" onClick={handleSendMessage}>Send Message</Button>
            </Grid>
          </StyledPaper >
        </Grid >
      </Grid >
    </Grid >);
}

export default CombatTracker;