import { useActive, useCommands } from "@remirror/react";
import SaveIcon from '@mui/icons-material/Save';
import { Button, styled } from "@mui/material";
import { otherColors as oColors } from "../../../theme"
import { MouseEventHandler } from "react";


const StyledButton = styled(Button)(({ theme }) => ({
  selected: oColors.paperColor,
  padding: theme.spacing(1),
  width: "55px",
  ":hover": {
    backgroundColor: oColors.primaryMainTransparent,
    color: '#3c52b2',
  }
}))

type SaveProps = {
  save: () => void
}

const SaveButton = ({ save }: SaveProps) => {
  return (
    <StyledButton
      onClick={() => save()}
      variant="outlined"
      style={{
        marginLeft: "1px",
        marginRight: "1px",
        width: "15px",
        height: "22px",
        color: "black",
        borderColor: "black",
      }}
    >
      <SaveIcon />
    </StyledButton>
  );
}

export {}
export default SaveButton;