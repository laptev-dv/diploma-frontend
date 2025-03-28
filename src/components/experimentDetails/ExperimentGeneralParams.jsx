import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Stack,
  TextField,
} from "@mui/material";

const ExperimentGeneralParams = ({ parameters }) => {
  const renderColorRow = (color1, color2, isLast = false) => (
    <TableRow sx={{ td: { borderBottom: isLast ? 0 : undefined } }}>
      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Фон"
            size="small"
            value={color1.toUpperCase()}
            disabled
            sx={{ flex: 1 }}
            InputProps={{
              readOnly: true,
              sx: {
                '& input': {
                  cursor: 'default',
                }
              }
            }}
          />
          <Box
            sx={{
              width: 40,
              height: 40,
              backgroundColor: color1,
              border: "1px solid #ddd",
              borderRadius: 20,
            }}
          />
          <TextField
            label="Символ"
            size="small"
            value={color2.toUpperCase()}
            disabled
            sx={{ flex: 1 }}
            InputProps={{
              readOnly: true,
              sx: {
                '& input': {
                  cursor: 'default',
                }
              }
            }}
          />
          <Box
            sx={{
              width: 40,
              height: 40,
              backgroundColor: color2,
              border: "1px solid #ddd",
              borderRadius: 20,
            }}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );

  const renderDualNumberRow = (
    value1,
    label1,
    value2,
    label2,
    unit,
    isLast = false
  ) => (
    <TableRow sx={{ td: { borderBottom: isLast ? 0 : undefined } }}>
      <TableCell>
        <Stack direction="row" spacing={2}>
          <TextField
            label={`${label1}${unit !== null ? `, ${unit}` : ""}`}
            size="small"
            value={value1}
            disabled
            InputProps={{
              readOnly: true,
              sx: {
                '& input': {
                  cursor: 'default',
                }
              }
            }}
            sx={{ flex: 1 }}
          />
          <TextField
            label={`${label2}${unit !== null ? `, ${unit}` : ""}`}
            size="small"
            value={value2}
            disabled
            InputProps={{
              readOnly: true,
              sx: {
                '& input': {
                  cursor: 'default',
                }
              }
            }}
            sx={{ flex: 1 }}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Основные параметры
        </Typography>
        <Table>
          <TableBody>
            <TableRow sx={{ td: { borderBottom: 0, paddingBottom: 0 } }}>
              <TableCell>Цвета</TableCell>
            </TableRow>
            {renderColorRow(
              parameters.backgroundColor || "#ffffff",
              parameters.symbolColor || "#000000",
              false
            )}
            <TableRow sx={{ td: { borderBottom: 0, paddingBottom: 0 } }}>
              <TableCell>Поле</TableCell>
            </TableRow>
            {renderDualNumberRow(
              parameters.rows || 4,
              "Кол-во строк",
              parameters.columns || 4,
              "Кол-во столбцов",
              "шт",
              true
            )}
            {renderDualNumberRow(
              parameters.horizontalPadding || 5,
              "Горизонт. отступ",
              parameters.verticalPadding || 5,
              "Верт. отступ",
              "пикс",
              false
            )}
            <TableRow sx={{ td: { borderBottom: 0, paddingBottom: 0 } }}>
              <TableCell>Стимул</TableCell>
            </TableRow>
            <TableRow sx={{ td: { borderBottom: 0 } }}>
              <TableCell>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Символ"
                    size="small"
                    value={parameters.symbolType || "X"}
                    disabled
                    sx={{ flex: 1 }}
                    InputProps={{
                      readOnly: true,
                      sx: {
                        fontFamily: parameters.symbolFont || "Arial",
                        fontSize: "1.2rem",
                        '& input': {
                          cursor: 'default',
                        }
                      }
                    }}
                  />
                  <TextField
                    label="Шрифт"
                    size="small"
                    value={parameters.symbolFont || "Arial"}
                    disabled
                    sx={{ flex: 1 }}
                    InputProps={{
                      readOnly: true,
                      sx: {
                        '& input': {
                          cursor: 'default',
                        }
                      }
                    }}
                  />
                </Stack>
              </TableCell>
            </TableRow>
            {renderDualNumberRow(
              parameters.symbolWidth || 30,
              "Ширина",
              parameters.symbolHeight || 30,
              "Высота",
              "пикс",
              true
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default ExperimentGeneralParams;