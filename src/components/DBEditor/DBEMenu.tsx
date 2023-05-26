import { useState, useEffect } from "react";

import { TextField, Tooltip, Box, Menu, MenuItem, Alert, AlertColor, Snackbar } from "@mui/material";
import { styled } from "@mui/system";

import { CurrentSelection } from "./DBEditor";

const StyledBox = styled(Box, {
  name: "StyledBox",
  slot: "Wrapper",
})({
  zIndex: "100",
  fontSize: "14px",
  backgroundColor: "#fff",
  borderRadius: "2px",
  padding: "5px 0 5px 0",
  width: "150px",
  height: "auto",
  margin: "0",
  /* use absolute positioning  */
  position: "absolute",
  listStyle: "none",
  boxShadow: "0 0 20px 0 #ccc",
  opacity: "1",
  // transition: "opacity 0.5s linear",
});

const menuBox = {
  zIndex: "200",
  fontSize: "14px",
  // bgcolor: "background.lightestBlue",
  // borderRadius: "2px",
  // padding: "5px 0 5px 0",
  // width: "150px",
  // height: "auto",
  margin: "0",
  /* use absolute positioning  */
  position: "absolute",
  listStyle: "none",
  boxShadow: "0 0 20px 0 #ccc",
  opacity: "1",
};

interface Props {
  x: number,
  y: number,
  anchorElement: HTMLElement | null | undefined,
  ui: Function,
  cs: CurrentSelection,
  ctd: Function,
  dt: Function,
  cc: Function,
  dc: Function,
  rtd: Function,
  rcd: Function,
  openMenuValue: boolean,
  setOpenMenuFn: Function,
  addNewRow: Function | null,
  removeRow: Function | null
}

function DBEMenu({
  x,
  y,
  anchorElement,
  ui,
  cs,
  ctd,
  dt,
  cc,
  dc,
  rtd,
  rcd,
  openMenuValue,
  setOpenMenuFn,
  addNewRow = null,
  removeRow = null,
}: Props) {
  const [updateItem] = useState<Function>(ui);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null | undefined>(anchorElement);
  const [xPos] = useState<number>(x);
  const [yPos] = useState<number>(y);
  const [currentSelection] = useState<CurrentSelection>(cs);
  const [showCreateTableDialog] = useState<Function>(ctd);
  const [showRenameTableDialog] = useState<Function>(rtd);
  const [showDeleteTableDialog] = useState<Function>(dt);
  const [showCreateColumnDialog] = useState<Function>(cc);
  const [showDeleteColumnDialog] = useState<Function>(dc);
  const [showRenameColumnDialog] = useState<Function>(rcd);
  const [setOpenMenu] = useState(setOpenMenuFn);
  const [open, setOpen] = useState(openMenuValue);
  const [addNewRowFn, setAddNewRow] = useState(addNewRow);
  const [removeRowFn, setRemoveRow] = useState(removeRow);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarType, setSnackbarType] = useState<AlertColor>("error");
  const [snackbarMsg, setSnackbarMsg] = useState<string>("");

  useEffect(() => {
    setOpen(open);
  }, [openMenuValue]);

  const handleClose = () => {
    setOpenMenu(false);
  };

  const anr = () => {
    if (addNewRowFn) {
      addNewRowFn();
    }
  }

  const rr = () => {
    if (removeRowFn) {
      removeRowFn();
    }
  }

  const createAddRemoveRow = () => {
    if (!anchorEl) {
      setSnackbarType("error");
      setSnackbarMsg("No Anchor Error");
      setOpenSnackbar(true);
      return;
    }
    return (
      <Menu
        sx={{
          ...menuBox,
        }}
        id="addremove"
        anchorEl={anchorEl}
        // anchorPosition={{
        //   top: xPos,
        //   left: yPos,
        // }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}          
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => anr()}>Add new row</MenuItem>
        <MenuItem onClick={() => rr()}>Delete this row</MenuItem>
      </Menu>
    );
  };

  const createHeaderMenu = (key: string) => {
    if (!anchorEl) {
      console.error("No anchor element");
      return;
    }
    const ON_HEADER_ROW = "header";
    if (key === ON_HEADER_ROW) {
      return (
        <Menu
          sx={{
            ...menuBox,
          }}
          id="header"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={() => showCreateTableDialog(true)}>
            Create new table
          </MenuItem>
          <MenuItem onClick={() => showDeleteTableDialog(true)}>
            Delete this table
          </MenuItem>
          <MenuItem onClick={() => showRenameTableDialog(true)}>
            Rename this table
          </MenuItem>
          <MenuItem onClick={() => showCreateColumnDialog(true)}>
            Add column
          </MenuItem>
          <MenuItem onClick={() => showDeleteColumnDialog(true)}>
            Remove column
          </MenuItem>
          <MenuItem onClick={() => showRenameColumnDialog(true)}>
            Rename this column
          </MenuItem>
        </Menu>
      );
    } else {
      return (
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}          
          open={open}
          onClose={handleClose}
          sx={{
            ...menuBox,
          }}
        >
          <MenuItem onClick={() => showCreateTableDialog(true)}>
            Create new table
          </MenuItem>
          <MenuItem onClick={() => showDeleteTableDialog(true)}>
            Delete this table
          </MenuItem>
        </Menu>
      );
    }
  };
  
  const textEntered = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      updateItem(null);
    } else if (e.key === "Enter") {
      updateItem(
        currentSelection.id,
        currentSelection.columnName,
        (e.target as HTMLInputElement).value
        // e.currentTarget.value
      );
    }
  };

  const editorClicked = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const createRowDataEditor = (columnName: string) => {
    if (columnName !== "id") {
      return (
        <StyledBox
          sx={{
            top: yPos,
            left: xPos,
            // opacity: "1",
            bgcolor: "background.lightestBlue",
          }}
        >
          <Tooltip title="While selected escape to close">
            <TextField
              sx={{ zIndex: "100", backgroundColor: "white" }}
              id="outlined-basic"
              label="New Value"
              variant="outlined"
              defaultValue={currentSelection.value}
              onKeyUp={(e) => textEntered(e as React.KeyboardEvent<HTMLInputElement>)}
              onClick={(e) => editorClicked(e)}
              autoFocus
            />
          </Tooltip>
        </StyledBox>
      );
    }
  };

  const isHeaderMenu = () => {
    return (
      currentSelection.id === "header" ||
      (currentSelection.columnName === "header" &&
        currentSelection.id !== "header")
    );
  };

  const getPopup = () => {
    if (addNewRowFn !== null && addNewRowFn !== undefined) {
      return createAddRemoveRow();
    } else if (isHeaderMenu()) {
      return createHeaderMenu(currentSelection.id);
    } else {
      return createRowDataEditor(currentSelection.columnName);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  }

  const getSnackbar = () => {
    return (
      <Snackbar anchorOrigin={{ "vertical": "top", "horizontal": "center" }} open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarType} sx={{ width: '100%' }}>{snackbarMsg}</Alert>
      </Snackbar>
    );
  }

  return (
    <div>
      {getSnackbar()}
      {getPopup()}
    </div>
  );
}

export default DBEMenu;
