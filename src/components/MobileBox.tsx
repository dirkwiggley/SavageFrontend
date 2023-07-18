import { Box, styled } from "@mui/material";

export const MobileBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
        display: "none",
    },
}));

export const NonMobileBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flex: 1,
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
        display: "none",
    },
}));