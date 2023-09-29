import { useActive, useCommands } from "@remirror/react";
import { otherColors } from "../../../theme";

const BoldButton = () => {
  const { toggleBold, focus } = useCommands();
  const active = useActive();
  
  return (
    <button
      onClick={()=> {
        toggleBold();
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
      }}
    >
      B
    </button>
  );
}

export {}
export default BoldButton;