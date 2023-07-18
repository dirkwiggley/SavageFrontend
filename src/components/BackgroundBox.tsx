import React from 'react';
import backgroundImage1 from '../assets/background1.jpg';
import backgroundImage2 from '../assets/background2.png';
import { Box } from '@mui/material';

type ContainerProps = {
    children: React.ReactNode; //👈 children prop type
};

const BackgroundBox = (props: ContainerProps) => {
    const getBackground = () => {
        return backgroundImage2;
    }
    
    return (
        <Box 
            overflow={"hidden"}
            sx={{ 
                maxWidth: "100vw", 
                minHeight: "100vh",
                backgroundImage:`url(${getBackground()})`,
                backgroundSize: "cover",
            }}>
            {props.children}
        </Box>
    )
}

export default BackgroundBox;