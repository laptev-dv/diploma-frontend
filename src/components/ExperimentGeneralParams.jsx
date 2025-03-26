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
import ColorPickerButton from "./ColorPickerButton";
import FontSelect from "./FontSelect";
import AsciiSymbolSelect from "./AsciiSymbolSelect";

const ExperimentGeneralParams = ({ parameters, onParamChange }) => {
  const renderColorRow = (label, field1, color1, field2, color2, isLast = false) => (
    <TableRow
      sx={{ "td": { borderBottom: isLast ? 0 : undefined } }}
    >
      <TableCell>{label}</TableCell>
      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Фон"
            size="small"
            value={color1}
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
            value={color2}
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
    label,
    field1,
    value1,
    label1,
    field2,
    value2,
    label2,
    unit = "пикс",
    isLast = false
  ) => (
    <TableRow
      sx={{ "td": { borderBottom: isLast ? 0 : undefined } }}
    >
      <TableCell>{label}</TableCell>
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
            {renderColorRow(
              "Цвета",
              "backgroundColor",
              parameters.backgroundColor || "#ffffff",
              "symbolColor",
              parameters.symbolColor || "#000000",
              false
            )}
            {renderDualNumberRow(
              "Поле",
              "rows",
              parameters.rows || 4,
              "Строк",
              "columns",
              parameters.columns || 4,
              "Столбцов",
              "шт",
              true
            )}
            <TableRow>
              <TableCell>Стимул</TableCell>
              <TableCell>
                <Stack direction="row" spacing={2}>
                  <AsciiSymbolSelect
                    value={parameters.symbolType || "X"}
                    onChange={(newSymbol) =>
                      onParamChange("symbolType", newSymbol)
                    }
                  />
                  <FontSelect
                    value={parameters.symbolFont || "Arial"}
                    onChange={(newFont) =>
                      onParamChange("symbolFont", newFont)
                    }
                  />
                </Stack>
              </TableCell>
            </TableRow>
            {renderDualNumberRow(
              "Размер символа",
              "symbolWidth",
              parameters.symbolWidth || 30,
              "Ширина",
              "symbolHeight",
              parameters.symbolHeight || 30,
              "Высота",
              "пикс",
              true
            )}
            {renderDualNumberRow(
              "Отступы",
              "horizontalPadding",
              parameters.horizontalPadding || 5,
              "Горизонтальный",
              "verticalPadding",
              parameters.verticalPadding || 5,
              "Вертикальный",
              null,
              true
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default ExperimentGeneralParams;