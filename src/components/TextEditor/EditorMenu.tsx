import BoldButton from "./Buttons/BoldButton";
import HighlightButton from "./Buttons/HighlightButton";
import ItalicButton from "./Buttons/ItalicButton";
import RemoveHighlightButton from "./Buttons/RemoveHighlightButton";
import SaveButton from "./Buttons/SaveButton";

type SaveProps = {
  save: () => void
}

const EditorMenu = ({save}: SaveProps) => {
  return (
    <>
      <BoldButton />
      <ItalicButton />
      <HighlightButton />
      <RemoveHighlightButton />
      <SaveButton save={save}/>
    </>
  );
}

export default EditorMenu;