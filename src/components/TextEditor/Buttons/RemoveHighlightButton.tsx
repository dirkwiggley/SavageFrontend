import { useActive, useCommands } from "@remirror/react";
import HighlightOffIcon from '@mui/icons-material/HighlightOffRounded'
import MenuButton from "./MenuButton";

const RemoveHighlightButton = () => {
  const { removeTextHighlight } = useCommands();
  const active = useActive();

  return (
    <MenuButton
      variant="outlined"
      onMouseDown={(event) => event.preventDefault()}
      onClick={()=> { removeTextHighlight() }}
    >
      <HighlightOffIcon />
    </MenuButton>
  );
}

export {}
export default RemoveHighlightButton;