import BoldButton from "./Buttons/BoldButton"
import HighlightButton from "./Buttons/HighlightButton"
import ItalicButton from "./Buttons/ItalicButton"
import RemoveHighlightButton from "./Buttons/RemoveHighlightButton"
import SaveButton from "./Buttons/SaveButton"
import UndoButton from "./Buttons/UndoButton"
import RedoButton from "./Buttons/RedoButton"
import MetaDataButton from "./Buttons/MetaDataButton"

type MenuProps = {
  save: () => void
  meta: () => void
}

const EditorMenu = ({save, meta}: MenuProps ) => {
  return (
    <>
      <MetaDataButton meta={meta} />
      <BoldButton />
      <ItalicButton />
      <HighlightButton />
      <RemoveHighlightButton />
      <SaveButton save={save} />
      <UndoButton />
      <RedoButton />
    </>
  );
}

export default EditorMenu;