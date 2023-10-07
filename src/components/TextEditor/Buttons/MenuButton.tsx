import { Button, styled } from "@mui/material";
import { otherColors as oColors } from "../../../theme"

const MenuButton = styled(Button)(({ theme }) => ({
  selected: oColors.paperColor,
  marginLeft: "2px",
  marginTop: "10px",
  maxWidth: "30px",
  maxHeight: "30px",
  minWidth: "30px",
  minHeight: "35px",
  color: "black",
  borderColor: "black",
  ":hover": {
    backgroundColor: oColors.primaryMainTransparent,
    color: '#3c52b2',
  }
}))

export default MenuButton