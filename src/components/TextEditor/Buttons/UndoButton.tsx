import UndoIcon from '@mui/icons-material/Undo';
import { useActive, useCommands } from "@remirror/react";
import StyledButton from "./MenuButton";

type UndoProps = {
  undo: () => void
}

// const UndoButton = ({ undo }: UndoProps) => {
  const UndoButton = () => {
  const { undo, focus } = useCommands();

  return (
    <StyledButton
      onClick={() => {
        undo()
        focus()
      }}
      variant="outlined"
    >
      <UndoIcon 
        fontSize="small"
      />
    </StyledButton>
  );
}

export {}
export default UndoButton;