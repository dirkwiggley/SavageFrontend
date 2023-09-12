import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { theme } from "./theme";
import { styled } from "@mui/material";
import "./index.css"
import { Box, ThemeProvider } from '@mui/material';

import "./i18n";

const StyledBox = styled(Box)({
  m: 0, 
  justifyContent: "center", 
  alignItems: "center", 
  display: "block", 
  width: "100vw"
});

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
  <StyledBox>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StyledBox>
  </React.StrictMode>
);
