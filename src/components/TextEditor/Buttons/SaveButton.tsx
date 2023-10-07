import SaveIcon from '@mui/icons-material/Save';
import MenuButton from "./MenuButton";

type SaveProps = {
  save: () => void
}

const SaveButton = ({ save }: SaveProps) => {
  return (
    <MenuButton
      onClick={() => save()}
      variant="outlined"
    >
      <SaveIcon 
        // fontSize="small"
      />
    </MenuButton>
  );
}

export {}
export default SaveButton;