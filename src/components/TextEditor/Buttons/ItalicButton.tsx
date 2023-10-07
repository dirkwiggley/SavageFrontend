import { useActive, useCommands } from "@remirror/react";
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import MenuButton from "./MenuButton";


const ItalicButton = () => {
  const { toggleItalic, focus } = useCommands();
  const active = useActive();

  return (
    <MenuButton
      variant="outlined"
      onClick={()=> {
        toggleItalic();
        focus();
      }}
    >
      <FormatItalicIcon />
    </MenuButton>
  );
}

export {}
export default ItalicButton;