import { useActive, useCommands } from "@remirror/react";
import { otherColors } from "../../../theme";

const RemoveHighlightButton = () => {
  const { removeTextHighlight } = useCommands();
  const active = useActive();

  return (
    <button
      onMouseDown={(event) => event.preventDefault()}
      onClick={()=> {
        removeTextHighlight()
      }}
      style={{ 
        marginTop: "4px",
        marginLeft: "1px",
        marginRight: "1px",
        width: "25px",
        height: "22px",
        textDecoration: "line-through",
        fontWeight: active.bold() ? 'bold' : undefined,
        background: active.bold() ? otherColors.primaryMainTransparent : otherColors.transparent,
      }}
    >
      H
    </button>
  );
}

export {}
export default RemoveHighlightButton;