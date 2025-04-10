import React, { useState, useEffect } from "react";
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
  IconButton,
  Tooltip,
} from "@mui/material";
import ColorPickerButton from "../ColorPickerButton";
import FontSelect from "./FontSelect";
import AsciiSymbolSelect from "./AsciiSymbolSelect";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const EditableExperimentGeneralParams = ({ parameters, onParamChange }) => {
  const [aspectRatioLocked, setAspectRatioLocked] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  // Обновляем натуральные размеры при изменении шрифта или символа
  useEffect(() => {
    const temp = document.createElement("div");
    temp.style.position = "absolute";
    temp.style.visibility = "hidden";
    temp.style.whiteSpace = "nowrap";
    temp.style.fontFamily = parameters.symbolFont;
    temp.style.fontSize = "100px";
    temp.textContent = parameters.symbolType;
    document.body.appendChild(temp);

    const width = temp.offsetWidth;
    const height = temp.offsetHeight;
    document.body.removeChild(temp);

    setNaturalSize({ width, height });

    // Автоматически включаем блокировку при изменении шрифта/символа
    if (!aspectRatioLocked) {
      setAspectRatioLocked(true);
    }

    // Пересчитываем соотношение сторон
    const newAspectRatio = width / height;
    setAspectRatio(newAspectRatio);

    // Обновляем высоту в соответствии с новой пропорцией
    onParamChange({
      symbolHeight: Math.round(parameters.symbolWidth / newAspectRatio),
    });
  }, [parameters.symbolFont, parameters.symbolType]);

  // Обработчик изменений параметров
  const handleParamChange = (field, value) => {
    const numericValue = Number(value);
    const changes = { [field]: numericValue };

    if (aspectRatioLocked) {
      if (field === "symbolWidth") {
        changes.symbolHeight = Math.round(numericValue / aspectRatio);
      } else if (field === "symbolHeight") {
        changes.symbolWidth = Math.round(numericValue * aspectRatio);
      }
    }

    onParamChange(changes);
  };

  // Обработчик переключения блокировки пропорций
  const toggleAspectRatioLock = () => {
    const newLockedState = !aspectRatioLocked;

    if (newLockedState) {
      // При включении блокировки пересчитываем высоту
      const newHeight = Math.round(parameters.symbolWidth / aspectRatio);
      onParamChange({
        symbolHeight: newHeight,
      });
    }

    // Обновляем соотношение только при выключении блокировки
    if (!newLockedState) {
      setAspectRatio(parameters.symbolWidth / parameters.symbolHeight);
    }

    setAspectRatioLocked(newLockedState);
  };

  const renderColorRow = (field1, color1, field2, color2, isLast = false) => (
    <TableRow sx={{ "& td": { borderBottom: isLast ? 0 : undefined } }}>
      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Фон"
            size="small"
            value={color1.toUpperCase()}
            onChange={(e) => onParamChange({ [field1]: e.target.value })}
            sx={{ flex: 1 }}
          />
          <ColorPickerButton
            color={color1}
            onChange={(newColor) => onParamChange({ [field1]: newColor })}
          />
          <TextField
            label="Символ"
            size="small"
            value={color2.toUpperCase()}
            onChange={(e) => onParamChange({ [field2]: e.target.value })}
            sx={{ flex: 1 }}
          />
          <ColorPickerButton
            color={color2}
            onChange={(newColor) => onParamChange({ [field2]: newColor })}
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
    max2 = null,
    extraContent = null
  ) => (
    <TableRow sx={{ "& td": { borderBottom: isLast ? 0 : undefined } }}>
      <TableCell>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label={`${label1}${unit ? `, ${unit}` : ""}`}
            size="small"
            type="number"
            value={value1}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (min1 !== null) val = Math.max(min1, val);
              if (max1 !== null) val = Math.min(max1, val);
              handleParamChange(field1, val);
            }}
            inputProps={{ min: min1, max: max1 }}
            sx={{ flex: 1 }}
          />
          <TextField
            label={`${label2}${unit ? `, ${unit}` : ""}`}
            size="small"
            type="number"
            value={value2}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (min2 !== null) val = Math.max(min2, val);
              if (max2 !== null) val = Math.min(max2, val);
              handleParamChange(field2, val);
            }}
            inputProps={{ min: min2, max: max2 }}
            sx={{ flex: 1 }}
          />
          {extraContent}
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
            <TableRow sx={{ "& td": { borderBottom: 0, paddingBottom: 0 } }}>
              <TableCell>Цвета</TableCell>
            </TableRow>

            {renderColorRow(
              "backgroundColor",
              parameters.backgroundColor,
              "symbolColor",
              parameters.symbolColor
            )}

            <TableRow sx={{ "& td": { borderBottom: 0, paddingBottom: 0 } }}>
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
              false,
              1,
              9,
              1,
              9
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
              0,
              null,
              0,
              null
            )}

            <TableRow sx={{ "& td": { borderBottom: 0, paddingBottom: 0 } }}>
              <TableCell>Стимул</TableCell>
            </TableRow>

            <TableRow sx={{ "& td": { borderBottom: 0 } }}>
              <TableCell>
                <Stack direction="row" spacing={2}>
                  <AsciiSymbolSelect
                    value={parameters.symbolType}
                    onChange={(newSymbol) =>
                      onParamChange({ symbolType: newSymbol })
                    }
                    fontFamily={parameters.symbolFont}
                  />
                  <FontSelect
                    value={parameters.symbolFont}
                    onChange={(newFont) =>
                      onParamChange({ symbolFont: newFont })
                    }
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
              1,
              null,
              1,
              null,
              <IconButton
                onClick={toggleAspectRatioLock}
                color={aspectRatioLocked ? "primary" : "default"}
                sx={{ ml: 1 }}
              >
                <Tooltip
                  title={
                    aspectRatioLocked
                      ? "Сохранять пропорции"
                      : "Не сохранять пропорции"
                  }
                  arrow
                >
                  {aspectRatioLocked ? (
                    <LockIcon fontSize="small" />
                  ) : (
                    <LockOpenIcon fontSize="small" />
                  )}
                </Tooltip>
              </IconButton>
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default EditableExperimentGeneralParams;
