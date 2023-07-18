import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#2F8F9D",
      light: "#3BACB6"
    },
    secondary: {
      main: "#3BACB6",
      light: "#82DBD8"
    },
  },
  typography: {
    fontFamily: [
      'DM Serif Text',
      'serif',
    ].join(','),
  },
});

export const otherColors = {
    // background: {
    //   medium: "#3BACB6",
    //   light: "#82DBD8",
      // darkestBlue: "#2155CD",
      darkestBlue: "#D2B48C",
    //   darkerBlue: "#0AA1DD",
    //   lightBlue: "#79DAE8",
    //   lightestBlue: "#E8F9FD",
    //   white: "#FFFFFF",
    //   lightGray: "#EEEEEE",
    // },
}
