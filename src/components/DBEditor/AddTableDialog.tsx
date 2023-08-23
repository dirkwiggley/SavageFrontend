import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

interface Props {
  openDlg: boolean,
  setOpen: Function,
  createCallback: Function
}

export default function AddTableDialog({ openDlg, setOpen, createCallback } : Props) {
  const { t, i18n } = useTranslation();
  
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
        <DialogTitle>{t('dbeditor.createTable')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('dbeditor.tableName')}
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
          <Button onClick={() => handleClose("cancel")}>{t('dbeditor.cancel')}</Button>
          <Button onClick={() => handleClose("add")}>{t('dbeditor.createTable')}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}