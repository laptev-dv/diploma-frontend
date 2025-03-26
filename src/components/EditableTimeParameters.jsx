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
  InputAdornment,
} from "@mui/material";

const timeColors = {
  stimulus: "#4CAF50",
  response: "#2196F3",
  pause: "#FF9800",
};

function EditableTimeParameters({ parameters, onParamChange }) {
  // Конвертер единиц
  const toSeconds = (ms) => (ms / 1000).toFixed(1);
  const toMilliseconds = (s) => Math.round(Number(s) * 1000);

  // Локальное состояние для редактируемых значений (в секундах)
  const [localParams, setLocalParams] = useState({
    stimulusTime: toSeconds(parameters.stimulusTime || 500),
    responseTime: toSeconds(parameters.responseTime || 1000),
    pauseTime: toSeconds(parameters.pauseTime || 300),
  });

  const [hoveredItem, setHoveredItem] = useState(null);

  // Синхронизация с props
  useEffect(() => {
    setLocalParams({
      stimulusTime: toSeconds(parameters.stimulusTime || 500),
      responseTime: toSeconds(parameters.responseTime || 1000),
      pauseTime: toSeconds(parameters.pauseTime || 300),
    });
  }, [parameters]);

  // Обработчик изменений
  const handleParamChange = (field, value) => {
    const newParams = {
      ...localParams,
      [field]: value,
    };
    setLocalParams(newParams);
    onParamChange(field, toMilliseconds(value));
  };

  // Рассчитываем производные значения (в миллисекундах)
  const totalTimeMs =
    toMilliseconds(localParams.stimulusTime) +
    toMilliseconds(localParams.responseTime) +
    toMilliseconds(localParams.pauseTime);

  const responsePeriodTimeMs =
    toMilliseconds(localParams.stimulusTime) +
    toMilliseconds(localParams.responseTime);

  // Расчет процентов для прогресс-бара
  const calculatePercentage = (timeMs) => (timeMs / totalTimeMs) * 100;

  // Получение ширины сегмента в зависимости от наведения
  const getSegmentWidth = (segment) => {
    const baseWidth = 16;

    if (!hoveredItem) return baseWidth;

    if (hoveredItem === "total") {
      return baseWidth * 3.5;
    } else if (
      hoveredItem === "responsePeriod" &&
      (segment === "stimulus" || segment === "response")
    ) {
      return baseWidth * 4;
    } else if (hoveredItem === segment) {
      return baseWidth * 4;
    }

    return baseWidth;
  };

  // Визуализация вертикального прогресс-бара
  const renderTimeBar = () => {
    const stimulusMs = toMilliseconds(localParams.stimulusTime);
    const responseMs = toMilliseconds(localParams.responseTime);
    const pauseMs = toMilliseconds(localParams.pauseTime);

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          ml: 2,
        }}
      >
        <Box
          sx={{
            borderRadius: "4px 4px 0 0",
            height: `${calculatePercentage(stimulusMs)}%`,
            width: `${getSegmentWidth("stimulus")}px`,
            backgroundColor: timeColors.stimulus,
            transition: "width 0.3s ease",
          }}
        />
        <Box
          sx={{
            height: `${calculatePercentage(responseMs)}%`,
            width: `${getSegmentWidth("response")}px`,
            backgroundColor: timeColors.response,
            transition: "width 0.3s ease",
          }}
        />
        <Box
          sx={{
            borderRadius: "0 0 4px 4px",
            height: `${calculatePercentage(pauseMs)}%`,
            width: `${getSegmentWidth("pause")}px`,
            backgroundColor: timeColors.pause,
            transition: "width 0.3s ease",
          }}
        />
      </Box>
    );
  };

  // Рендер строки таблицы с обработчиками наведения
  const renderTableRow = (
    label,
    value,
    color = null,
    hoverKey = null,
    isLast = false
  ) => {
    return (
      <TableRow
        onMouseEnter={() => hoverKey && setHoveredItem(hoverKey)}
        onMouseLeave={() => hoverKey && setHoveredItem(null)}
        sx={{
          "&:hover": {
            backgroundColor: hoverKey ? "rgba(0, 0, 0, 0.04)" : "inherit",
            cursor: hoverKey ? "pointer" : "default",
          },
          "&:last-child td": { borderBottom: isLast ? 0 : undefined },
        }}
      >
        <TableCell>
          {color && (
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: color,
                borderRadius: "2px",
              }}
            />
          )}
        </TableCell>
        <TableCell align="right">
          <TextField
            fullWidth
            label={label}
            type="number"
            size="small"
            value={value}
            onChange={(e) =>
              handleParamChange(hoverKey + "Time", e.target.value)
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">сек</InputAdornment>,
            }}
            inputProps={{
              min: 0.1,
              step: 0.1,
            }}
          />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Временные параметры
      </Typography>

      <Stack sx={{ direction: 'column' }}>
          <Stack direction="row" spacing={1} mb={2}>
          <Stack sx={{width: '100%'}} direction="column" justifyContent="space-between" spacing={1} mb={2}>

            <Table>
              <TableBody>
                {renderTableRow(
                  "Предъявление",
                  localParams.stimulusTime,
                  timeColors.stimulus,
                  "stimulus"
                )}
                {renderTableRow(
                  "Ожидание ответа",
                  localParams.responseTime,
                  timeColors.response,
                  "response"
                )}
                {renderTableRow(
                  "Пауза",
                  localParams.pauseTime,
                  timeColors.pause,
                  "pause"
                )}
              </TableBody>
            </Table>
            
            <Table >
            <TableBody>
              <TableRow
                onMouseEnter={() => setHoveredItem("total")}
                onMouseLeave={() => setHoveredItem(null)}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    cursor: "pointer",
                  },
                }}
              >
                <TableCell colSpan={2}>
                  <Typography>Общее время цикла</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{toSeconds(totalTimeMs)} сек</Typography>
                </TableCell>
              </TableRow>
              <TableRow
                onMouseEnter={() => setHoveredItem("responsePeriod")}
                onMouseLeave={() => setHoveredItem(null)}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    cursor: "pointer",
                  },
                  "&:last-child td": { borderBottom: 0 },
                }}
              >
                <TableCell colSpan={2}>
                  <Typography>Время на ответ</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{toSeconds(responsePeriodTimeMs)} сек</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </Stack>

            {/* Вертикальный прогресс-бар */}
            <Box sx={{ width: "120px" }}>{renderTimeBar()}</Box>
          </Stack>
      </Stack>
    </Paper>
  );
}

export default EditableTimeParameters;
