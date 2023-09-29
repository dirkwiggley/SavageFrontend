import { useActive, useCommands } from "@remirror/react";
import { otherColors } from "../../../theme";

const HighlightButton = () => {
  const { setTextHighlight } = useCommands();
  const active = useActive();
  

  return (
    <button
      onMouseDown={(event) => event.preventDefault()}
      onClick={()=> {
        setTextHighlight('yellow')
      }}
      style={{ 
        marginTop: "4px",
        marginLeft: "1px",
        marginRight: "1px",
        width: "25px",
        height: "22px",
        fontWeight: active.bold() ? 'bold' : undefined,
        background: 'yellow',
      }}
    >
      H
    </button>
  );
}

export {}
export default HighlightButton;