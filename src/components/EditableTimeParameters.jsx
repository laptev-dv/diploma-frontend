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
    // Обновляем локальное состояние (в секундах)
    const newParams = {
      ...localParams,
      [field]: value
    };
    setLocalParams(newParams);
    
    // Конвертируем в миллисекунды и передаем в родительский компонент
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
                height: "24px",
                backgroundColor: timeColors.stimulus,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" sx={{ color: "white", fontWeight: "bold" }}>
                {localParams.stimulusTime}с
              </Typography>
            </Box>

            <Box
              sx={{
                width: `${calculatePercentage(responseMs)}%`,
                height: "24px",
                backgroundColor: timeColors.response,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" sx={{ color: "white", fontWeight: "bold" }}>
                {localParams.responseTime}с
              </Typography>
            </Box>

            <Box
              sx={{
                width: `${calculatePercentage(pauseMs)}%`,
                height: "24px",
                backgroundColor: timeColors.pause,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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

  // Рендер редактируемой строки
  const renderEditableRow = (label, value, color = null, field = null, isLast = false) => {
    return (
      <TableRow sx={{ '&:last-child td': { borderBottom: isLast ? 0 : undefined } }}>
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
            onChange={(e) => handleParamChange(field, e.target.value)}
            InputProps={{
              endAdornment: <Typography variant="caption">с</Typography>,
            }}
            sx={{ width: 100 }}
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
          {renderEditableRow(
            "Время предъявления стимула",
            localParams.stimulusTime,
            timeColors.stimulus,
            "stimulusTime"
          )}
          {renderEditableRow(
            "Время ожидания ответа",
            localParams.responseTime,
            timeColors.response,
            "responseTime"
          )}
          {renderEditableRow(
            "Время паузы",
            localParams.pauseTime,
            timeColors.pause,
            "pauseTime"
          )}

          <TableRow>
            <TableCell colSpan={2} sx={{ py: 2 }} />
          </TableRow>

          <TableRow>
            <TableCell>
              <Typography>Общее время цикла</Typography>
            </TableCell>
            <TableCell>
              <Typography>{toSeconds(totalTimeMs)} с</Typography>
            </TableCell>
          </TableRow>

          <TableRow>
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