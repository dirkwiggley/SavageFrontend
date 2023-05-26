import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { Stack, Typography } from '@mui/material';

import { useTranslation } from "react-i18next";
import { useAuthContext } from './AuthStore';
import api from '../api';

/*
  Notes:
  https://www.i18next.com/
  https://mui.com/material-ui/guides/localization/
  https://stackoverflow.com/questions/59801746/i18n-localization-in-react-with-material-ui-by-extending-typography
*/
type SupportedLocales = keyof typeof locales;

interface localeType {
  label: string,
  id: string,
}

export const supportedLocales: Array<localeType> = [
  { label: 'English', id: 'enUS' },
  { label: 'Deutsch', id: 'deDE' },
  { label: 'Português', id: 'ptPT' },
];

export const getSupportedLocaleCodes = () => {
  const codes = supportedLocales.map(element => element.id);
  return codes as Array<SupportedLocales>
}

export const getLocaleCode = (language: string) => {
  const localeElement = supportedLocales.find(element => element.label === language);
  return localeElement?.id;
}

export const getCodeFromPrefix = (prefix: string) => {
  const localeElement = supportedLocales.find(element => element.id.startsWith(prefix));
  return localeElement?.id;
}

export const getLanguageFromId = (id: string) => {
  const localeElement = supportedLocales.find(element => element.id === id);
  return localeElement?.label;
}

export default function Locales() {
  const { t, i18n } = useTranslation();

  const [locale, setLocale] = React.useState<SupportedLocales>(i18n.language as SupportedLocales);
  const [auth, setAuth] = useAuthContext();

  React.useEffect(() => {
    if (auth) {
      i18n.changeLanguage(auth.locale?.slice(0, 2));
      setLocale(auth.locale as SupportedLocales);
    }
  }, [auth]);

  const theme = useTheme();

  const themeWithLocale = React.useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  const onChangeHandler = (event: any, newValue: localeType) => {
    const localCode = newValue.id;
    if (localCode) {
      i18n.changeLanguage(localCode?.slice(0, 2));
      setLocale(localCode as SupportedLocales);
      if (auth && !(auth.login === 'nobody')) {
        auth.locale = localCode;
        api.updateUser(auth);
      }
    }
  }

  return (
    <ThemeProvider theme={themeWithLocale}>
      <Stack alignItems="center" justifyContent="center">
        <Box sx={{ maxWidth: 'md', mt: 2, ml: 2 }}>
          <Autocomplete
            aria-label='Language'
            options={supportedLocales}
            getOptionLabel={(element) => element.label}
            style={{ width: 300 }}
            // value={locale}
            disableClearable
            // onChange={(event: any, newValue: string | undefined) => {
            //   i18n.changeLanguage(newValue?.slice(0,2));
            //   setLocale(newValue as SupportedLocales);
            // }}
            onChange={onChangeHandler}
            renderInput={(params) => (
              <TextField {...params} label={t('locales.locale')} fullWidth />
            )}
          />
          {/* <TablePagination
          count={2000}
          rowsPerPage={10}
          page={1}
          component="div"
          onPageChange={() => {}}
        /> */}
        </Box>
        <Box sx={{ maxWidth: 'md', mt: 2, ml: 2 }}>
          <Typography>
            {t('locales.test')}
          </Typography>
        </Box>
      </Stack>
    </ThemeProvider>
  );
}