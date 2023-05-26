import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Box, Grid } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from "@mui/system";

import { useTranslation } from "react-i18next";

interface CurrentSelection {
  id: string,
  columnName: string,
  value: string,
  tableName: string,
};

type htcFunction = (evt: SelectChangeEvent<string>, child: React.ReactNode) => void;

interface Props {
  htc: htcFunction,
  tables: string[],
  curSel: string
}

const StyledBox = styled(Box)({
  display: "block"
});

export default function DBSelect({ htc, tables, curSel }: Props) {
  const { t, i18n } = useTranslation();

  const [handleTableChange] = React.useState(() => htc);
  const [tableList, setTableList] = React.useState(tables);
  const [currentSelection, setCurrentSelection] = React.useState(curSel);

  React.useEffect(() => {
    setTableList(tables);
  }, [tables]);

  React.useEffect(() => {
    setCurrentSelection(curSel);
  }, [curSel]);

  const handleChange = (evt: SelectChangeEvent<string>, child: React.ReactNode) => {
    handleTableChange(evt, child);
  };

  const createMenuItems = () => {
    const elements: any[] = [];
    tableList.forEach((name, index) => {
      elements.push(<MenuItem key={name+index.toString()} value={name}>{name}</MenuItem>);
    });
    if (elements.length === 0) {
      elements.push(<MenuItem key="none" value=""><em>{t('dbeditor.none')}</em></MenuItem>);
    }
    return elements;
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="select-table">{t('dbeditor.table')}</InputLabel>
      <Select
        labelId="select-table"
        id="select-table"
        value={currentSelection ? currentSelection : ""}
        label="Table"
        onChange={(evt: SelectChangeEvent<string>, child: React.ReactNode) => handleChange(evt, child)}
      >
      {createMenuItems()}

      </Select>
      <FormHelperText>{t('dbeditor.selecttable')}</FormHelperText>
    </FormControl>
  );
}
