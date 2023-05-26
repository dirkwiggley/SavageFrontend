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
  createCallback: Function
}

export default function AddTableDialog({ openDlg, setOpen, createCallback } : Props) {
  const [show, setShow] = React.useState(openDlg);
  const [setShowDlg] = React.useState(setOpen);
  const [create] = React.useState(createCallback);

  React.useEffect(() => {
    setShow(openDlg);
  }, [openDlg]);

  const handleClose = (request: string) => {
    setShowDlg(false);
    if (request === "add") {
      const tableName = (document.getElementById("tablename") as HTMLInputElement).value;
      const columnName = (document.getElementById("columnname") as HTMLInputElement).value;
      create(tableName, columnName);
    }
  };

  return (
    <div>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Create Table</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of the table and one column name that you would like to create.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="tablename"
            label="Table Name"
            type="Table"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="columnname"
            label="Column Name"
            type="Column"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose("cancel")}>Cancel</Button>
          <Button onClick={() => handleClose("add")}>Create Table</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}