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
  InputAdornment
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
      [field]: value
    };
    setLocalParams(newParams);
    onParamChange(field, toMilliseconds(value));
  };

  // Рассчитываем производные значения (в миллисекундах)
  const totalTimeMs = toMilliseconds(localParams.stimulusTime) + 
                     toMilliseconds(localParams.responseTime) + 
                     toMilliseconds(localParams.pauseTime);
  
  const responsePeriodTimeMs = toMilliseconds(localParams.stimulusTime) + 
                             toMilliseconds(localParams.responseTime);

  // Расчет процентов для прогресс-бара
  const calculatePercentage = (timeMs) => (timeMs / totalTimeMs) * 100;

  // Получение высоты сегмента в зависимости от наведения
  const getSegmentHeight = (segment) => {
    const baseHeight = 24;

    if (!hoveredItem) return baseHeight;

    if (hoveredItem === "total") {
      return baseHeight * 1.8;
    } else if (
      hoveredItem === "responsePeriod" &&
      (segment === "stimulus" || segment === "response")
    ) {
      return baseHeight * 2;
    } else if (hoveredItem === segment) {
      return baseHeight * 2;
    }

    return baseHeight;
  };

  // Визуализация прогресс-бара
  const renderTimeBar = () => {
    const stimulusMs = toMilliseconds(localParams.stimulusTime);
    const responseMs = toMilliseconds(localParams.responseTime);
    const pauseMs = toMilliseconds(localParams.pauseTime);

    return (
      <Box sx={{ mb: 3 }}>
        <Box sx={{ height: "50px", display: "flex", alignItems: "flex-end" }}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              borderRadius: "4px",
              overflow: "hidden",
              border: "1px solid #e0e0e0",
              alignItems: "flex-end",
            }}
          >
            <Box
              sx={{
                width: `${calculatePercentage(stimulusMs)}%`,
                height: `${getSegmentHeight("stimulus")}px`,
                backgroundColor: timeColors.stimulus,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "height 0.3s ease",
              }}
            >
              <Typography variant="caption" sx={{ color: "white", fontWeight: "bold" }}>
                {localParams.stimulusTime}с
              </Typography>
            </Box>

            <Box
              sx={{
                width: `${calculatePercentage(responseMs)}%`,
                height: `${getSegmentHeight("response")}px`,
                backgroundColor: timeColors.response,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "height 0.3s ease",
              }}
            >
              <Typography variant="caption" sx={{ color: "white", fontWeight: "bold" }}>
                {localParams.responseTime}с
              </Typography>
            </Box>

            <Box
              sx={{
                width: `${calculatePercentage(pauseMs)}%`,
                height: `${getSegmentHeight("pause")}px`,
                backgroundColor: timeColors.pause,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "height 0.3s ease",
              }}
            >
              <Typography variant="caption" sx={{ color: "white", fontWeight: "bold" }}>
                {localParams.pauseTime}с
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", width: "100%" }}>
          <Box sx={{ width: `${calculatePercentage(stimulusMs)}%`, textAlign: "left" }}>
            <Typography variant="caption" sx={{ color: timeColors.stimulus, fontWeight: "bold" }}>
              Стимул
            </Typography>
          </Box>
          <Box sx={{ width: `${calculatePercentage(responseMs)}%`, textAlign: "center" }}>
            <Typography variant="caption" sx={{ color: timeColors.response, fontWeight: "bold" }}>
              Ответ
            </Typography>
          </Box>
          <Box sx={{ width: `${calculatePercentage(pauseMs)}%`, textAlign: "right" }}>
            <Typography variant="caption" sx={{ color: timeColors.pause, fontWeight: "bold" }}>
              Пауза
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  // Рендер строки таблицы с обработчиками наведения
  const renderTableRow = (label, value, color = null, hoverKey = null, isLast = false) => {
    return (
      <TableRow
        onMouseEnter={() => hoverKey && setHoveredItem(hoverKey)}
        onMouseLeave={() => hoverKey && setHoveredItem(null)}
        sx={{
          "&:hover": {
            backgroundColor: hoverKey ? "rgba(0, 0, 0, 0.04)" : "inherit",
            cursor: hoverKey ? "pointer" : "default",
          },
          '&:last-child td': { borderBottom: isLast ? 0 : undefined }
        }}
      >
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
            {color && (
              <Box sx={{ width: 16, height: 16, backgroundColor: color, borderRadius: "2px" }} />
            )}
            <Typography>{label}</Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <TextField
            type="number"
            size="small"
            value={value}
            onChange={(e) => handleParamChange(hoverKey + "Time", e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">сек</InputAdornment>,
            }}
            inputProps={{
              min: 0.1,
              step: 0.1
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

      {renderTimeBar()}

      <Table>
        <TableBody>
          {renderTableRow(
            "Время предъявления стимула",
            localParams.stimulusTime,
            timeColors.stimulus,
            "stimulus"
          )}
          {renderTableRow(
            "Время ожидания ответа",
            localParams.responseTime,
            timeColors.response,
            "response"
          )}
          {renderTableRow(
            "Время паузы",
            localParams.pauseTime,
            timeColors.pause,
            "pause"
          )}

          <TableRow>
            <TableCell colSpan={2} sx={{ py: 2 }} />
          </TableRow>

          <TableRow
            onMouseEnter={() => setHoveredItem("total")}
            onMouseLeave={() => setHoveredItem(null)}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                cursor: "pointer",
              }
            }}
          >
            <TableCell>
              <Typography>Общее время цикла</Typography>
            </TableCell>
            <TableCell>
              <Typography>{toSeconds(totalTimeMs)} с</Typography>
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
              '&:last-child td': { borderBottom: 0 }
            }}
          >
            <TableCell>
              <Typography>Время на ответ</Typography>
            </TableCell>
            <TableCell>
              <Typography>{toSeconds(responsePeriodTimeMs)} с</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

export default EditableTimeParameters;