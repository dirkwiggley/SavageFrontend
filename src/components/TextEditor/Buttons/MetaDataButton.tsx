import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import MenuButton from "./MenuButton";

type MetaProps = {
  meta: () => void
}

const MetaDataButton = ({ meta }: MetaProps) => {
  return (
    <MenuButton
      onClick={() => meta()}
      variant="outlined"
    >
      <IntegrationInstructionsIcon 
        // fontSize="small"
      />
    </MenuButton>
  );
}

export {}
export default MetaDataButton;