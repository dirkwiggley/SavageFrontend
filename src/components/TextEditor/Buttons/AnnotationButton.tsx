import { useActive, useCommands } from "@remirror/react";
import { otherColors } from "../../../theme";

const AnnotationButton = () => {
  const { toggleAnnotation, focus } = useCommands();
  const active = useActive();
  
  return (
    <button
      onClick={()=> {
        toggleAnnotation();
        focus();
      }}
      style={{
        marginTop: "4px",
        marginLeft: "1px",
        marginRight: "1px",
        width: "25px",
        fontWeight: active.bold() ? 'bold' : undefined,
        background: active.bold() ? otherColors.primaryMainTransparent : otherColors.transparent,
      }}
    >
      A
    </button>
  );
}

export {}
export default AnnotationButton;