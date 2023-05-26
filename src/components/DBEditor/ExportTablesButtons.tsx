import { Box, Button, Grid} from "@mui/material";

import { useTranslation } from "react-i18next";

import API, { authHelper } from '../../api';

const ExportTablesButtons = () => {
    const { t, i18n } = useTranslation();

    const exportAll = () => {
        authHelper(API.exportDB);
    }

    return (
        <Button onClick={exportAll} variant="contained">{t('dbeditor.exportdb')}</Button>
    );
}

export default ExportTablesButtons;