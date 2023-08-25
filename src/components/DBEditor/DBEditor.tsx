import React, { useState, useEffect, useCallback, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import { SelectChangeEvent, useTheme } from "@mui/material";
import * as locales from '@mui/material/locale';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useTranslation } from "react-i18next";

import DBSelect from "./DBSelect";
import DBEMenu from "./DBEMenu";
import AddTableDialog from "./AddTableDialog";
import RemoveTableDialog from "./RemoveTableDialog";
import AddColumnDialog from "./AddColumnDialog";
import RemoveColumnDialog from "./RemoveColumnDialog";
import RenameTableDialog from "./RenameTableDialog";
import RenameColumnDialog from "./RenameColumnDialog";
import { useAuthContext } from '../AuthStore';
import { TablePaginationActions } from "./TablePaginationActions";
import ExportTablesButtons from "./ExportTablesButtons";
import API, { authHelper } from "../../api";
import { otherColors } from "../../theme";

export interface CurrentSelection {
  id: string,
  columnName: string,
  value: string | ReactNode,
  tableName: string,
  anchorEl: HTMLElement | null
};

const StyledTableCell = styled(TableCell, {
  name: "StyledTableCell",
  slot: "Wrapper",
})({
  backgroundColor: "white",
  cursor: "pointer",
  "&:hover": {
    cursor: "pointer",
    backgroundColor: "lightGray",
  },
});

const StyledHeaderGrid = styled(Box)({
  // marginTop: "50px",
  padding: 50,
  justifyContent: "center",
  alignContent: "center",
  display: "block",
});

interface AnchorPoint {
  x: number,
  y: number,
  anchorEl?: HTMLTableCellElement
}

const defaultAnchorPoint: AnchorPoint = { x: 0, y: 0 }

const currentSelectionSeed: CurrentSelection = { id: "", columnName: "", value: "", tableName: "", anchorEl: null }

type SupportedLocales = keyof typeof locales;

export default function CustomPaginationActionsTable() {
  const { t, i18n } = useTranslation();
  
  const [anchorEl, setAnchorEl] = React.useState()

  const [auth, setAuth] = useAuthContext();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [columnHeaders, setColumnHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<HTMLTableCellElement[] | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [showAddTblDlg, setShowAddTblDlg] = useState<boolean>(false);
  const [showRemoveTblDlg, setShowRemoveTblDlg] = useState<boolean>(false);
  const [showRenameTblDlg, setShowRenameTblDlg] = useState<boolean>(false);
  const [showAddColDlg, setShowAddColDlg] = useState<boolean>(false);
  const [showDeleteColDlg, setShowDeleteColDlg] = useState<boolean>(false);
  const [showRenameColDlg, setShowRenameColDlg] = useState<boolean>(false);

  const [anchorPoint, setAnchorPoint] = useState<AnchorPoint>(defaultAnchorPoint);
  const [showDBEMenu, setShowDBEMenu] = useState<boolean>(false);
  const [currentSelection, setCurrentSelection] = useState<CurrentSelection>(currentSelectionSeed);
  const [updateTable, setUpdateTable] = useState<boolean>(false);
  

  let navigate = useNavigate();

  const theme = useTheme();
  const [locale, setLocale] = React.useState<SupportedLocales>("enUS" as SupportedLocales);

  useEffect(() => {
    setLocale(auth?.locale as SupportedLocales);
  }, [auth?.locale]);

  const themeWithLocale = React.useMemo(
    () => {
      let lang = null;
      if (auth?.locale) {
        lang = locales[auth?.locale! as SupportedLocales];
      } else {
        lang = locales[locale];
      }
      return createTheme(theme, lang)
    },
    [locale, theme],
  );

  const equalsIgnoreOrder = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    const uniqueValues = new Set([...a, ...b]);
    for (const v of uniqueValues) {
      const aCount = a.filter((e: string) => e === v).length;
      const bCount = b.filter((e: string) => e === v).length;
      if (aCount !== bCount) return false;
    }
    return true;
  };

  useEffect(() => {
    if (!auth || auth.login === "nobody") {
      navigate("/login/true");
    }
    try {
      const user = { ...auth };
      if (user && !user.active) {
        navigate("/login/true");
      } else if (user.resetpwd) {
        navigate("/resetpassword");
      }
    } catch (err) {
      console.error(err);
      navigate("/login/true");
    }
  }, [auth, navigate]);

  useEffect(() => {
    try {
      authHelper(API.getTables)
        .then((tableNames) => {
          if (Array.isArray(tableNames)) {
            if (!equalsIgnoreOrder(tables, tableNames)) {
              setTables(tableNames);
            }
          }
        },
          (err) => {
            console.error(err);
            setAuth?.(null);
            API.logoutApi(auth?.id);
            navigate("/login/true");
          });
    } catch (err) {
      console.error(err);
    }
  }, [tables]);

  interface HDCC {
    event: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    id: string,
    colName: string,
    value: string | ReactNode,
    tableName: string
  }

  const handleDoubleClickCapture = useCallback(
    ({ event, id, colName, value, tableName }: HDCC) => {
      event?.preventDefault();
      let anchor = event.currentTarget;
      let columnName: string = colName;
      if (id === "header") {
        if (typeof value === "string") {
          columnName = value;
        } else {
          // TODO: Do this better
          columnName = "";
        }
        if (columnName === "id") {
          setShowDBEMenu(false);
          return;
        }
      }
      const newCS = {
        id: id,
        columnName: columnName,
        value: value,
        tableName: tableName,
        anchorEl: anchor as HTMLElement
      };
      setCurrentSelection(newCS);

      setAnchorPoint({
        x: event.pageX,
        y: event.pageY,
        anchorEl: event?.currentTarget,
      });
      setShowDBEMenu(!showDBEMenu);
    },
    [setAnchorPoint, setShowDBEMenu, showDBEMenu]
  );

  useEffect(() => {
    if (updateTable) {
      setUpdateTable(false);
      if (!currentSelection) {
        setRows(null);
        return;
      }
      const table = currentSelection.tableName;
      try {
        authHelper(() => API.getTableData(table)).then((response: any) => {
          setRows(response.data);
          let headers: any[] = [];
          if (Array.isArray(response.columnNames)) {
            response.columnNames.forEach((element: string, index: number) => {
              return headers.push(
                <TableCell
                  component="th"
                  scope="row"
                  key={index}
                  sx={{
                    bgcolor: otherColors.primaryMain, //"rgba(210, 180, 140, 1.0)",
                    border: "2px",
                    "&:hover": {
                      cursor: "pointer",
                      backgroundColor: otherColors.primaryLight,
                    },
                  }}

                  onDoubleClickCapture={(e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => handleDoubleClickCapture({
                    event: e,
                    id: "header",
                    colName: index.toString(),
                    value: element,
                    tableName: currentSelection.tableName
                  })}
                >
                  {element}
                </TableCell>
              );
            });
            setColumnHeaders(headers);
          }
        });
      } catch (err) {
        setAuth?.(null);
        API.logoutApi(auth?.id);
      }
    }
  }, [currentSelection, updateTable, handleDoubleClickCapture]);

  function createRow(row: any) {
    const cells = [];
    for (const [key, value] of Object.entries(row)) {
      let keyValue = key + row.id;
      if (key === "id") {
        cells.push(
          <StyledTableCell
            key={keyValue}
            onDoubleClick={(e) =>
              handleDoubleClickCapture({
                event: e,
                id: row.id,
                colName: key,
                value: value as string,
                tableName: currentSelection.tableName
              })
            }
            component="th"
            scope="row"
          >
            {value as string}
          </StyledTableCell>
        );
      } else {
        cells.push(
          <StyledTableCell
            key={keyValue}
            onDoubleClick={(e) =>
              handleDoubleClickCapture({
                event: e,
                id: row.id,
                colName: key,
                value: value as string,
                tableName: currentSelection.tableName
              })
            }
            component="th"
            scope="row"
          >
            {value as string}
          </StyledTableCell>
        );
      }
    }
    return <TableRow key={row.id}>{cells}</TableRow>;
  }

  const handleTableChange = (evt: SelectChangeEvent<string>, child: React.ReactNode) => {
    if (!evt) return;
    const tableName = (child as any)?.props.value;
    if (currentSelection.tableName !== tableName || updateTable) {
      setCurrentSelection(createDefaultCurrentSelection(evt?.target as HTMLElement, tableName));
      setUpdateTable(true);
    }
  };

  const createDefaultCurrentSelection = (anchorEl: HTMLElement | null, name: string) => {
    const cs = { id: "0", columnName: "", value: "", tableName: name, anchorEl: anchorEl };
    return cs;
  };

  //------------------------------------------------

  // Avoid a layout jump when reaching the last page with empty rows.
  function getEmptyRows() {
    let length = 0;
    if (rows) {
      length = rows.length;
    }
    return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - length) : 0;
  }

  function hasNoRows() {
    return rows?.length === 0;
  }

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //------------------------------------------------

  //const closeMenu = (e: any) => {
  const closeMenu = () => {
    setShowDBEMenu(false);
  };

  const updateItem = (id: string, column: string, value: string) => {
    if (id === null) {
      closeMenu();
      return;
    }
    setShowDBEMenu(false);
    try {
      authHelper(() => API.updateElement(currentSelection.tableName, id, column, value))
        .then((response) => {
          setCurrentSelection(
            createDefaultCurrentSelection(currentSelection.anchorEl, currentSelection.tableName)
          );
          setUpdateTable(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      setAuth?.(null);
      API.logoutApi(auth?.id);
    }
  };

  const showAddTableDialog = (show: boolean) => {
    setShowAddTblDlg(show);
  };

  const showRemoveTableDialog = (show: boolean) => {
    setShowRemoveTblDlg(show);
  };

  const showRenameTableDialog = (show: boolean) => {
    setShowRenameTblDlg(show);
  };

  const showCreateColumnDialog = (show: boolean) => {
    setShowAddColDlg(show);
  };

  const showRenameColumnDialog = (show: boolean) => {
    setShowRenameColDlg(show);
  };

  const showDeleteColumnDialog = (show: boolean) => {
    setShowDeleteColDlg(show);
  };

  const createTable = (tableName: string, columnName: string) => {
    try {
      authHelper(() => API.createNewTable(tableName, columnName)).then(function (response) {
        setTables([]);
        setCurrentSelection(createDefaultCurrentSelection(null, tableName));
        setUpdateTable(true);
        setShowDBEMenu(false);
      });
    } catch (err) {
      setAuth?.(null);
      API.logoutApi(auth?.id);
    }
  };

  const deleteTable = (tableName: string) => {
    try {
      authHelper(() => API.dropTable(tableName)).then((result) => {
        setTables([]);
        setCurrentSelection(createDefaultCurrentSelection(null, ""));
        setUpdateTable(true);
        setShowDBEMenu(false);
      });
    } catch (err) {
      setAuth?.(null);
      API.logoutApi(auth?.id);
    }
  };

  const renameTable = (oldTableName: string, newTableName: string) => {
    try {
      authHelper(() => API.renTable(oldTableName, newTableName)).then((result) => {
        setTables([]);
        setCurrentSelection(createDefaultCurrentSelection(currentSelection.anchorEl, newTableName));
        setUpdateTable(true);
        setShowDBEMenu(false);
      });
    } catch (err) {
      setAuth?.(null);
      API.logoutApi(auth?.id);
    }
  };

  const createColumn = (tableName: string, columnName: string, dataType: string) => {
    try {
      authHelper(() => API.createCol(tableName, columnName, dataType)).then((result) => {
        setCurrentSelection(createDefaultCurrentSelection(currentSelection.anchorEl, tableName));
        setUpdateTable(true);
        showCreateColumnDialog(false);
        setShowDBEMenu(false);
      });
    } catch (err) {
      setAuth?.(null);
      API.logoutApi(auth?.id);
    }
  };

  const renameColumn = (tableName: string, newColumnName: string, oldColumnName: string) => {
    try {
      authHelper(() => API.renameCol(tableName, oldColumnName, newColumnName))
        .then((result) => {
          setCurrentSelection(createDefaultCurrentSelection(currentSelection.anchorEl, tableName));
          setUpdateTable(true);
          setShowDBEMenu(false);
        })
    } catch (err) {
      setAuth?.(null);
      API.logoutApi(auth?.id);
    }
  };

  const createDBRow = () => {
    try {
      authHelper(() => API.createNewRow(currentSelection.tableName)).then((result) => {
        setCurrentSelection(
          createDefaultCurrentSelection(currentSelection.anchorEl, currentSelection.tableName)
        );
        setUpdateTable(true);
        setShowDBEMenu(false);
      });
    } catch (err) {
      setAuth?.(null);
      API.logoutApi(auth?.id);
    }

  };

  const deleteDBRow = () => {
    try {
      authHelper(() => API.deleteRow(currentSelection.tableName, currentSelection.id)).then(
        (result) => {
          setCurrentSelection(
            createDefaultCurrentSelection(null, currentSelection.tableName)
          );
          setUpdateTable(true);
          setShowDBEMenu(false);
        }
      );
    } catch (err) {
      setAuth?.(null);
      API.logoutApi(auth?.id);
    }
  };

  const deleteColumn = (columnName: string) => {
    try {
      authHelper(() => API.dropCol(currentSelection.tableName, columnName)).then((result) => {
        setCurrentSelection(
          createDefaultCurrentSelection(null, currentSelection.tableName)
        );
        setUpdateTable(true);
      });
    } catch (err) {
      setAuth?.(null);
      API.logoutApi(auth?.id);
    } finally {
      setShowDBEMenu(false);
    }
  };

  const getGrid = () => {
    if (
      rows &&
      currentSelection.columnName === "id" &&
      !Number.isNaN(currentSelection.id)
    ) {
      return (
        <ThemeProvider theme={themeWithLocale}>
          <StyledHeaderGrid>
            {showDBEMenu ? (
              <DBEMenu
                x={anchorPoint.x}
                y={anchorPoint.y}
                anchorElement={anchorPoint.anchorEl}
                ui={() => updateItem}
                cs={currentSelection}
                ctd={() => showAddTableDialog}
                dt={() => setShowRemoveTblDlg}
                cc={() => showCreateColumnDialog}
                dc={() => showDeleteColumnDialog}
                rtd={() => showRenameTableDialog}
                rcd={() => showRenameColumnDialog}
                openMenuValue={showDBEMenu}
                setOpenMenuFn={() => setShowDBEMenu}
                addNewRow={() => createDBRow}
                removeRow={() => deleteDBRow}
              />
            ) : null}
            <Grid container>
              <Grid item xs={4} />
              <Grid item xs={4} style={{ display: "flex", gap: "1rem", alignItems: "center", alignContent: "center", justifyContent: "center" }}>
                <DBSelect
                  htc={(evt: SelectChangeEvent<string>, child: React.ReactNode) => handleTableChange(evt, child)}
                  tables={tables}
                  curSel={currentSelection.tableName} />
                <ExportTablesButtons />
              </Grid>
              <Grid item xs={4} />
            </Grid>

            <Grid item>
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 500 }}
                  aria-label="custom pagination table"
                >
                  <TableBody>
                    <TableRow>{columnHeaders}</TableRow>
                    {hasNoRows() && (
                      <TableRow style={{ height: 53 * getEmptyRows() }}>
                        <TableCell colSpan={columnHeaders.length}>
                          No data in table{" "}
                          <Button onClick={createDBRow} variant="text">
                            Create a row
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}

                    {(rowsPerPage > 0
                      ? rows.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      : rows
                    ).map(createRow)}

                    {getEmptyRows() > 0 && (
                      <TableRow style={{ height: 53 * getEmptyRows() }}>
                        <TableCell colSpan={columnHeaders.length} />
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter sx={{ width: "100%" }}>
                    <TableRow sx={{ width: "100%" }}>
                      <TablePagination
                        sx={{ width: "100%" }}
                        rowsPerPageOptions={[
                          5,
                          10,
                          25,
                          { label: "All", value: -1 },
                        ]}
                        colSpan={columnHeaders.length}
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        lang={locale ? locale : "enUS"}
                        SelectProps={{
                          inputProps: {
                            "aria-label": "rows per page",
                          },
                          native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Grid>
          </StyledHeaderGrid>
        </ThemeProvider>
      );
    } else if (rows && currentSelection.tableName) {
      return (
        <ThemeProvider theme={themeWithLocale}>
          <StyledHeaderGrid>
            {showDBEMenu ? (
              <DBEMenu
                x={anchorPoint.x}
                y={anchorPoint.y}
                anchorElement={anchorPoint.anchorEl}
                ui={() => updateItem}
                cs={currentSelection}
                ctd={() => showAddTableDialog}
                dt={() => setShowRemoveTblDlg}
                cc={() => showCreateColumnDialog}
                dc={() => showDeleteColumnDialog}
                rtd={() => showRenameTableDialog}
                rcd={() => showRenameColumnDialog}
                openMenuValue={showDBEMenu}
                setOpenMenuFn={() => setShowDBEMenu}
                addNewRow={() => { }}
                removeRow={() => { }}
              />
            ) : null}
            <AddTableDialog
              openDlg={showAddTblDlg ? showAddTblDlg : false}
              setOpen={() => showAddTableDialog}
              createCallback={() => createTable}
            />
            <RemoveTableDialog
              openDlg={showRemoveTblDlg ? showRemoveTblDlg : false}
              setOpen={() => showRemoveTableDialog}
              removeCallback={() => deleteTable}
              name={currentSelection.tableName}
            />
            <RenameTableDialog
              openDlg={showRenameTblDlg ? showRenameTblDlg : false}
              setOpen={() => showRenameTableDialog}
              renameCallback={() => renameTable}
              oldTableName={currentSelection.tableName}
            />
            <AddColumnDialog
              openDlg={showAddColDlg ? showAddColDlg : false}
              setOpen={() => showCreateColumnDialog}
              createCallback={() => createColumn}
              tableName={currentSelection.tableName}
            />
            <RemoveColumnDialog
              openDlg={showDeleteColDlg ? showDeleteColDlg : false}
              setOpen={() => showDeleteColumnDialog}
              removeCallback={() => deleteColumn}
              name={currentSelection ? currentSelection.columnName : ""}
            />
            <RenameColumnDialog
              openDlg={showRenameColDlg ? showRenameColDlg : false}
              setOpen={() => showRenameColumnDialog}
              renameCallback={() => renameColumn}
              tableName={currentSelection.tableName}
              oldColumnName={currentSelection.columnName}
            />

            <Grid container>
              <Grid item xs={4} />
              <Grid item xs={4} style={{ display: "flex", gap: "1rem", alignItems: "center", alignContent: "center", justifyContent: "center" }}>
                <DBSelect
                  htc={(evt: SelectChangeEvent<string>, child: React.ReactNode) => handleTableChange(evt, child)}
                  tables={tables}
                  curSel={currentSelection.tableName} />
                <ExportTablesButtons />
              </Grid>
              <Grid item xs={4} />
            </Grid>
            <Grid item>
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 500 }}
                  aria-label="custom pagination table"
                >
                  <TableBody>
                    <TableRow>{columnHeaders}</TableRow>
                    {hasNoRows() && (
                      <TableRow style={{ height: 53 * getEmptyRows() }}>
                        <TableCell colSpan={columnHeaders.length}>
                          No data in table
                          <Button onClick={createDBRow} variant="text">
                            Create a row
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}

                    {(rowsPerPage > 0
                      ? rows.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      : rows
                    ).map(createRow)}

                    {getEmptyRows() > 0 && (
                      <TableRow style={{ height: 53 * getEmptyRows() }}>
                        <TableCell colSpan={columnHeaders.length} />
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        sx={{ width: "100%" }}
                        rowsPerPageOptions={[
                          5,
                          10,
                          25,
                          { label: "All", value: -1 },
                        ]}
                        colSpan={columnHeaders.length}
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                          inputProps: {
                            "aria-label": "rows per page",
                          },
                          native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Grid>
          </StyledHeaderGrid>
        </ThemeProvider>
      );
    } else {
      return (
        <ThemeProvider theme={themeWithLocale}>
          <StyledHeaderGrid>
            <Grid container>
              <Grid item xs={4} />
              <Grid item xs={4} style={{ display: "flex", gap: "1rem", alignItems: "center", alignContent: "center", justifyContent: "center" }}>
                <DBSelect htc={(evt: SelectChangeEvent<string>, child: React.ReactNode) => handleTableChange(evt, child)} tables={tables} curSel="" />
                <ExportTablesButtons />
              </Grid>
              <Grid item xs={4} />
            </Grid>
          </StyledHeaderGrid>
        </ThemeProvider>
      );
    }
  };

  return getGrid();

}
