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
import ColorPickerButton from "../ColorPickerButton";
import FontSelect from "./FontSelect";
import AsciiSymbolSelect from "./AsciiSymbolSelect";

const EditableExperimentGeneralParams = ({ parameters, onParamChange }) => {
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
    unit,
    isLast = false,
    min1 = null,
    max1 = null,
    min2 = null,
    max2 = null
  ) => (
    <TableRow sx={{ td: { borderBottom: isLast ? 0 : undefined } }}>
      <TableCell>
        <Stack direction="row" spacing={2}>
          <TextField
            label={`${label1}${unit !== null ? `, ${unit}` : ""}`}
            size="small"
            type="number"
            value={value1}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (min1 !== null && val < min1) val = min1;
              if (max1 !== null && val > max1) val = max1;
              onParamChange(field1, val);
            }}
            inputProps={{
              min: min1,
              max: max1,
            }}
            sx={{ flex: 1 }}
          />
          <TextField
            label={`${label2}${unit !== null ? `, ${unit}` : ""}`}
            size="small"
            type="number"
            value={value2}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (min2 !== null && val < min2) val = min2;
              if (max2 !== null && val > max2) val = max2;
              onParamChange(field2, val);
            }}
            inputProps={{
              min: min2,
              max: max2,
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
              parameters.backgroundColor,
              "symbolColor",
              parameters.symbolColor,
              false
            )}
            <TableRow sx={{ td: { borderBottom: 0, paddingBottom: 0 } }}>
              <TableCell>Поле</TableCell>
            </TableRow>
            {renderDualNumberRow(
              "rows",
              parameters.rows,
              "Кол-во строк",
              "columns",
              parameters.columns,
              "Кол-во столбцов",
              "шт",
              true,
              1,  // min rows
              9,  // max rows
              1,  // min columns
              9   // max columns
            )}
            {renderDualNumberRow(
              "horizontalPadding",
              parameters.horizontalPadding,
              "Горизонт. отступ",
              "verticalPadding",
              parameters.verticalPadding,
              "Верт. отступ",
              "пикс",
              false,
              0,  // min horizontalPadding
              null,  // no max
              0,  // min verticalPadding
              null   // no max
            )}
            <TableRow sx={{ td: { borderBottom: 0, paddingBottom: 0 } }}>
              <TableCell>Стимул</TableCell>
            </TableRow>
            <TableRow sx={{ td: { borderBottom: 0 } }}>
              <TableCell>
                <Stack direction="row" spacing={2}>
                  <AsciiSymbolSelect
                    value={parameters.symbolType}
                    onChange={(newSymbol) =>
                      onParamChange("symbolType", newSymbol)
                    }
                    fontFamily={parameters.symbolFont}
                  />
                  <FontSelect
                    value={parameters.symbolFont}
                    onChange={(newFont) => onParamChange("symbolFont", newFont)}
                  />
                </Stack>
              </TableCell>
            </TableRow>
            {renderDualNumberRow(
              "symbolWidth",
              parameters.symbolWidth,
              "Ширина",
              "symbolHeight",
              parameters.symbolHeight,
              "Высота",
              "пикс",
              true,
              0,  // min width
              null,  // no max
              0,  // min height
              null   // no max
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default EditableExperimentGeneralParams;