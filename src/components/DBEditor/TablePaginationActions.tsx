import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Box, IconButton } from "@mui/material";
import { KeyboardArrowRight, KeyboardArrowLeft } from "@mui/icons-material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import { createTheme, Theme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';

import { useTranslation } from "react-i18next";
import { useAuthContext } from "../AuthStore";
import { getCodeFromPrefix } from "../Locales";
import zIndex from "@mui/material/styles/zIndex";

export interface TPActionsProps {
    count: number,
    page: number,
    rowsPerPage: number,
    onPageChange: Function,
    lang?: string | undefined
}

type SupportedLocales = keyof typeof locales;

export function TablePaginationActions(props: TPActionsProps) {
    const { count, page, rowsPerPage, onPageChange, lang } = props;
    const { t, i18n } = useTranslation();

    const [auth, setAuth] = useAuthContext();
    const [locale, setLocale] = React.useState<SupportedLocales>(lang as SupportedLocales);

    const theme = useTheme();

    useEffect(() => {
        const language = i18n.language;
        const resolved = i18n.resolvedLanguage;
        const code = getCodeFromPrefix(language);
        setLocale(code as SupportedLocales);
    }, [lang]);

    const themeWithLocale = React.useMemo(
        () => {
            let lang: locales.Localization = auth?.locale as locales.Localization;
            if (!lang) lang = locales[locale];
            const out = locales[locale];
            return createTheme(theme, lang);
            // return createTheme(theme, locales[locale!])
        },
        [locale, theme],
    );

    const handleFirstPageButtonClick = (event: any) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: any) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: any) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: any) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    const pageMaxItemNo = (page + 1 * rowsPerPage);
    const onLastPage = pageMaxItemNo >= count;
    const onFirstPage = page === 0;

    return (
        <ThemeProvider theme={themeWithLocale}>
            <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={onFirstPage}
                    aria-label="first page"
                >
                    {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton
                    onClick={handleBackButtonClick}
                    disabled={onFirstPage}
                    aria-label="previous page"
                >
                    {theme.direction === "rtl" ? (
                        <KeyboardArrowRight />
                    ) : (
                        <KeyboardArrowLeft />
                    )}
                </IconButton>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={onLastPage}
                    aria-label="next page"
                    sx = {{zIndex: 1000}}
                >
                    {theme.direction === "rtl" ? (
                        <KeyboardArrowLeft />
                    ) : (
                        <KeyboardArrowRight />
                    )}
                </IconButton>
                <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="last page"
                >
                    {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
            </Box>
        </ThemeProvider>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};