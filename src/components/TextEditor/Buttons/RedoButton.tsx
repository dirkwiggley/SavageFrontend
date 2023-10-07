import RedoIcon from '@mui/icons-material/Redo';
import { useActive, useCommands } from "@remirror/react";
import MenuButton from "./MenuButton";

const RedoButton = () => {
  const { redo, focus } = useCommands();

  return (
    <MenuButton
      onClick={() => redo()}
      variant="outlined"
    >
      <RedoIcon 
        fontSize="small"
      />
    </MenuButton>
  );
}

export {}
export default RedoButton;