import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
  openDlg: boolean,
  setOpen: Function,
  renameCallback: Function,
  oldTableName: string
}

export default function RenameTableDialog( { openDlg, setOpen, renameCallback, oldTableName } : Props) {
  const [show, setShow] = React.useState<boolean>(openDlg);
  const [setShowDlg] = React.useState<Function>(setOpen);
  const [rename] = React.useState<Function>(renameCallback);
  
  React.useEffect(() => {
    setShow(openDlg);
  }, [openDlg]);

  const handleClose = (request: string) => {
    setShowDlg(false);
    if (request === "rename") {
      const newTableName = (document.getElementById("newtablename") as HTMLInputElement)?.value;
      rename(oldTableName, newTableName);
    }
  };

  return (
    <div>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Rename Table</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the new name for this table.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="newtablename"
            label="New Table Name"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose("cancel")}>Cancel</Button>
          <Button onClick={() => handleClose("rename")}>Rename Table</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}