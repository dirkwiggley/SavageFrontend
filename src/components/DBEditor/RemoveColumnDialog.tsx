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

export default function RemoveColumnDialog({ openDlg, setOpen, removeCallback, name }: Props) {
  const [show, setShow] = React.useState(openDlg);
  const [setShowDlg] = React.useState(setOpen);
  const [deleteCallback] = React.useState(removeCallback);
  const [tableName, setTableName] = React.useState(name);

  React.useEffect(() => {
    setShow(openDlg);
  }, [openDlg]);

  React.useEffect(() => {
    setTableName(name);
  }, [name]);

  const handleClose = (request: string) => {
    setShowDlg(false);
    if (request === "remove") {
      deleteCallback(name);
    }
  };

  return (
    <div>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Delete Column</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete the column {tableName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose("cancel")}>Cancel</Button>
          <Button onClick={() => handleClose("remove")}>Delete Column</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}