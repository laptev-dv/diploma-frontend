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
  InputAdornment,
} from "@mui/material";
import ColorPickerButton from "../ColorPickerButton";
import FontSelect from "./FontSelect";
import AsciiSymbolSelect from "./AsciiSymbolSelect";

const ExperimentGeneralParams = ({ parameters, onParamChange }) => {
  const renderColorRow = (field1, color1, field2, color2, isLast = false) => (
    <TableRow sx={{ td: { borderBottom: isLast ? 0 : undefined } }}>
      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Фон"
            size="small"
            value={color1.toUpperCase()}
            onChange={(e) => onParamChange(field1, e.target.value)}
            sx={{ flex: 1 }}
          />
          <ColorPickerButton
            color={color1}
            onChange={(newColor) => onParamChange(field1, newColor)}
          />
          <TextField
            label="Символ"
            size="small"
            value={color2.toUpperCase()}
            onChange={(e) => onParamChange(field2, e.target.value)}
            sx={{ flex: 1 }}
          />
          <ColorPickerButton
            color={color2}
            onChange={(newColor) => onParamChange(field2, newColor)}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );

  const renderDualNumberRow = (
    field1,
    value1,
    label1,
    field2,
    value2,
    label2,
    unit = "пикс",
    isLast = false
  ) => (
    <TableRow sx={{ td: { borderBottom: isLast ? 0 : undefined } }}>
      <TableCell>
        <Stack direction="row" spacing={2}>
          <TextField
            label={label1}
            size="small"
            type="number"
            value={value1}
            onChange={(e) => onParamChange(field1, Number(e.target.value))}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{unit}</InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          <TextField
            label={label2}
            size="small"
            type="number"
            value={value2}
            onChange={(e) => onParamChange(field2, Number(e.target.value))}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{unit}</InputAdornment>
              ),
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
              "backgroundColor",
              parameters.backgroundColor || "#ffffff",
              "symbolColor",
              parameters.symbolColor || "#000000",
              false
            )}
            <TableRow sx={{ td: { borderBottom: 0, paddingBottom: 0 } }}>
              <TableCell>Поле</TableCell>
            </TableRow>
            {renderDualNumberRow(
              "rows",
              parameters.rows || 4,
              "Кол-во строк",
              "columns",
              parameters.columns || 4,
              "Кол-во столбцов",
              "шт",
              true
            )}
            {renderDualNumberRow(
              "horizontalPadding",
              parameters.horizontalPadding || 5,
              "Горизонт. отступ",
              "verticalPadding",
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
                  <AsciiSymbolSelect
                    value={parameters.symbolType || "X"}
                    onChange={(newSymbol) =>
                      onParamChange("symbolType", newSymbol)
                    }
                    fontFamily={parameters.symbolFont || "Arial"} // Передаем текущий шрифт
                  />{" "}
                  <FontSelect
                    value={parameters.symbolFont || "Arial"}
                    onChange={(newFont) => onParamChange("symbolFont", newFont)}
                  />
                </Stack>
              </TableCell>
            </TableRow>
            {renderDualNumberRow(
              "symbolWidth",
              parameters.symbolWidth || 30,
              "Ширина",
              "symbolHeight",
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
