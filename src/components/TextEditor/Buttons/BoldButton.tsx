import { useActive, useCommands } from "@remirror/react";
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import MenuButton from "./MenuButton";
import { FiberPinRounded } from "@mui/icons-material";

const BoldButton = () => {
  const { toggleBold, focus } = useCommands();
  const active = useActive();
  
  return (
    <MenuButton
      variant="outlined"
      onClick={()=> {
        toggleBold();
        focus();
      }}
    >
      <FormatBoldIcon />
    </MenuButton>
  );
}

export {}
export default BoldButton;