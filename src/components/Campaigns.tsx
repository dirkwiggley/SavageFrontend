import { Box, Button, Grid, Paper, Stack, Typography, styled } from "@mui/material";
import { MobileBox, NonMobileBox } from "./MobileBox";
import { otherColors as oColors } from "../theme";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import EditCampaign from "./EditCampaign";
import SelectCampaign from "./SelectCampaign";

import { useState } from "react";

const StackItem = styled(Box)(({ theme }) => ({
    selected: oColors.paperColor,
    padding: theme.spacing(1),
    textAlign: 'left',
    or: theme.palette.text.secondary,
}))

const EDIT_CAMPAIGN = "editCampaign";
const SELECT_CAMPAIGN = "selectCampaign";
const NULL = "null";

const Campaigns = () => {
    const [bodyType, setBodyType] = useState<string>("");
    const [selectedCampaign, setSelectedCampaign] = useState<string>("");
    
    const navigate = useNavigate();

    const editCampaigns = () => {
        setBodyType(EDIT_CAMPAIGN)
    }

    const nada = () => {
        setBodyType(NULL)
    }

    const selectCampaign = () => {
        setBodyType(SELECT_CAMPAIGN)
    }

    const editDocuments = () => {

    }

    const viewDocuments = () => {

    }

    const editCharacters = () => {

    }

    const getButtons = () => {
        return (
            <Paper sx={{minHeight: "90vh", maxHeight: "100vh", bgcolor:"rgb(0,0,0,0.2)"}} component={Stack} direction="column" justifyContent="center">
            <Button variant="contained" sx={{mt: 1, mb: 1}} onClick={selectCampaign}><Typography color="black">Select Campaign</Typography></Button>
            <Button variant="contained" sx={{mt: 1, mb: 1}} onClick={editCampaigns}><Typography color="black">Edit Campaigns</Typography></Button>
            <Button variant="contained" sx={{mt: 1, mb: 1}} onClick={editDocuments}><Typography color="black">Edit Documents</Typography></Button>
            <Button variant="contained" sx={{mt: 1, mb: 1}} onClick={viewDocuments}><Typography color="black">View Documents</Typography></Button>
            <Button variant="contained" sx={{mt: 1, mb: 1}} onClick={editCharacters}><Typography color="black">Edit Characters</Typography></Button>
            <Button variant="contained" sx={{mt: 1, mb: 1}} onClick={nada}><Typography color="black">Nothing</Typography></Button>
            </Paper>
        );
    }

    const getBody = () => {
        switch (bodyType) {
            case EDIT_CAMPAIGN:
                return <EditCampaign />
            case SELECT_CAMPAIGN:
                return <SelectCampaign />
            case NULL:
                return null;
            default:
                return null;
        }
    }

    return (
        <>
            <MobileBox>
            </MobileBox>
            <NonMobileBox>
                <Grid container alignItems="center">
                    <Grid item xs={2}>{getButtons()}</Grid>
                    <Grid item xs={10}>{getBody()}</Grid>
                </Grid>
            </NonMobileBox>
        </>
    )
}

export default Campaigns;