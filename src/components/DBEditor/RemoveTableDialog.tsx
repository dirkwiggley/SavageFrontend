import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
  openDlg: boolean,
  setOpen: Function,
  removeCallback: Function,
  name: string
}

export default function RemoveTableDialog({ openDlg, setOpen, removeCallback, name }: Props) {
  const [show, setShow] = React.useState(openDlg);
  const [setShowDlg] = React.useState(setOpen);
  const [deleteCallback] = React.useState(removeCallback);
  
  React.useEffect(() => {
    setShow(openDlg);
  }, [openDlg]);

  const handleClose = (request: string) => {
    setShowDlg(false);
    if (request === "remove") {
      deleteCallback(name);
    }
  };

  return (
    <div>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Delete Table</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete the table {name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose("cancel")}>Cancel</Button>
          <Button onClick={() => handleClose("remove")}>Delete Table</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}