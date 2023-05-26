import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface Props {
  openDlg: boolean,
  setOpen: Function,
  createCallback: Function,
  tableName: string
}

export default function AddColumnDialog({ openDlg, setOpen, createCallback, tableName }: Props) {
  const [show, setShow] = React.useState(openDlg);
  const [setShowDlg] = React.useState(setOpen);
  const [create] = React.useState(createCallback);
  const [colName, setColName] = React.useState('');
  const [dataType, setDataType] = React.useState<string>('');

  React.useEffect(() => {
    setShow(openDlg);
  }, [openDlg]);

  const colTypes = ['text', 'numeric', 'real', 'integer', 'blob'];
  
  const createIsDisabled = () : boolean | undefined => {
    return !((colName?.length > 3) && (colTypes?.includes(dataType)));
  }

  const handleClose = (request: string) => {
    setShowDlg(false);
    if (request === "add") {      
      create(tableName, colName, dataType);
    }
  };

  const handleColNameChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setColName(evt.currentTarget.value);
  }

  const changeColDataType = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    setDataType(event.target.value);
  }

  return (
    <div>
      <Dialog open={show} onClose={handleClose}>
        <DialogTitle>Create Column</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of the column you would like to create.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Column Name"
            type="text"
            fullWidth
            variant="outlined"
            onChange={(evt) => handleColNameChange(evt)}
            value={colName}
          />
          <DialogContentText>
            Enter the column data type.
          </DialogContentText>
          <Select
            value={dataType}
            label="Data Type"
            onChange={changeColDataType}
            sx={{width: "100%"}}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="numeric">Numeric</MenuItem>
              <MenuItem value="integer">Integer</MenuItem>
              <MenuItem value="real">Real</MenuItem>
              <MenuItem value="blob">Blob</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => handleClose("cancel")}>Cancel</Button>
          <Button variant="outlined" onClick={() => handleClose("add")} disabled={createIsDisabled()}>Create Column</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}