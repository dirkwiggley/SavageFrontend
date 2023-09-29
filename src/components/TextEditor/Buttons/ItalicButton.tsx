import { useActive, useCommands } from "@remirror/react";
import { otherColors } from "../../../theme";

const ItalicButton = () => {
  const { toggleItalic, focus } = useCommands();
  const active = useActive();
  

  return (
    <button
      onClick={()=> {
        toggleItalic();
        focus();
      }}
      style={{ 
        marginTop: "4px",
        marginLeft: "1px",
        marginRight: "1px",
        width: "25px",
        height: "22px",
        fontWeight: active.bold() ? 'bold' : undefined,
        background: active.bold() ? otherColors.primaryMainTransparent : otherColors.transparent,
        fontStyle: 'italic',
      }}
    >
      I
    </button>
  );
}

export {}
export default ItalicButton;