import { useActive, useCommands } from "@remirror/react";
import HighlightIcon from '@mui/icons-material/Highlight'
import MenuButton from "./MenuButton";

const HighlightButton = () => {
  const { setTextHighlight } = useCommands();
  const active = useActive();
  
  return (
    <MenuButton
      variant="outlined"
      onMouseDown={(event) => event.preventDefault()}
      onClick={()=> { setTextHighlight('yellow') }}
    >
      <HighlightIcon />
    </MenuButton>
  );
}

export {}
export default HighlightButton;