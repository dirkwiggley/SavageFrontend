import { createTheme } from "@mui/material";
// "#2F8F9D",
// "#3BACB6"
export const theme = createTheme({
  palette: {
    primary: {
      main: "rgba(210, 180, 140, 1.0)",
      light: "rgba(230, 200, 160, 1.0)",
    },
    secondary: {
      main: "#3BACB6",
      light: "#82DBD8",
    },
    // error: {
      
    // },
    info: {
      main: "rgba(255,255,255,1.0)",
      light: "rgba(0,0,0,1.0)",
    },
    // warning: {

    // },
    // success: {

    // }
    
  },
  typography: {
    fontFamily: [
      'DM Serif Text',
      'serif',
    ].join(','),
  },
});

// const LIGHT_PAPER_COLOR = "#a8e6f0";

export const otherColors = {
    // background: {
    //   medium: "#3BACB6",
    //   light: "#82DBD8",
      // otherBackground: "#2155CD",
      transparent: "rgba(210, 180, 140, 0.0)",
      primaryMainTransparent: "rgba(210, 180, 140, 0.4)",
      primaryMain: "rgba(210, 180, 140, 1.0)",
      primaryLight: "rgba(230, 200, 160, 1.0)",
      veryLight: "rgba(230, 200, 160, 1.0)",
      otherBackground: "#D2B48C",
      paperColor: "#99d6ff",
      black: "rgba(255, 255, 255, 1.0)",
    //   darkerBlue: "#0AA1DD",
    //   lightBlue: "#79DAE8",
    //   lightestBlue: "#E8F9FD",
    //   white: "#FFFFFF",
    //   lightGray: "#EEEEEE",
    // },
}
