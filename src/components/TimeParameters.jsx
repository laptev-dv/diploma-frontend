import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Stack,
  Divider,
} from "@mui/material";

const timeColors = {
  stimulus: "#4CAF50",
  response: "#2196F3",
  pause: "#FF9800",
};

function TimeParameters({ parameters }) {
  const { stimulusTime = 1, responseTime = 2, pauseTime = 1 } = parameters;

  const totalTime = stimulusTime + responseTime + pauseTime;
  const responsePeriodTime = stimulusTime + responseTime;

  const [hoveredItem, setHoveredItem] = useState(null);

  const calculatePercentage = (time) => (time / totalTime) * 100;

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

  const renderTimeBar = () => {
    return (
      <Box sx={{ mb: 3 }}>
        {/* Сам прогресс-бар */}
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
            {/* Время предъявления стимула */}
            <Box
              sx={{
                width: `${calculatePercentage(stimulusTime)}%`,
                height: `${getSegmentHeight("stimulus")}px`,
                backgroundColor: timeColors.stimulus,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "height 0.3s ease",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                {stimulusTime}с
              </Typography>
            </Box>

            {/* Время ожидания ответа */}
            <Box
              sx={{
                width: `${calculatePercentage(responseTime)}%`,
                height: `${getSegmentHeight("response")}px`,
                backgroundColor: timeColors.response,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "height 0.3s ease",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                {responseTime}с
              </Typography>
            </Box>

            {/* Время паузы */}
            <Box
              sx={{
                width: `${calculatePercentage(pauseTime)}%`,
                height: `${getSegmentHeight("pause")}px`,
                backgroundColor: timeColors.pause,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "height 0.3s ease",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                {pauseTime}с
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Подписи под прогресс-баром */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: `${calculatePercentage(stimulusTime)}%`,
              textAlign: "left",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: timeColors.stimulus,
                fontWeight: "bold",
              }}
            >
              Стимул
            </Typography>
          </Box>
          <Box
            sx={{
              width: `${calculatePercentage(responseTime)}%`,
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: timeColors.response,
                fontWeight: "bold",
              }}
            >
              Ответ
            </Typography>
          </Box>
          <Box
            sx={{
              width: `${calculatePercentage(pauseTime)}%`,
              textAlign: "right",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: timeColors.pause,
                fontWeight: "bold",
              }}
            >
              Пауза
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderTableRow = (label, value, color = null, hoverKey = null) => {
    return (
      <TableRow
        onMouseEnter={() => hoverKey && setHoveredItem(hoverKey)}
        onMouseLeave={() => hoverKey && setHoveredItem(null)}
        sx={{
          "&:hover": {
            backgroundColor: hoverKey ? "rgba(0, 0, 0, 0.04)" : "inherit",
            cursor: hoverKey ? "pointer" : "default",
          },
        }}
      >
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1}>
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
            <Typography>{label}</Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Typography>{value} с</Typography>
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
            stimulusTime,
            timeColors.stimulus,
            "stimulus"
          )}
          {renderTableRow(
            "Время ожидания ответа",
            responseTime,
            timeColors.response,
            "response"
          )}
          {renderTableRow("Время паузы", pauseTime, timeColors.pause, "pause")}

          <TableRow>
            <TableCell colSpan={2} sx={{ py: 2 }} />
          </TableRow>

          {renderTableRow("Общее время цикла", totalTime, null, "total")}
          {renderTableRow(
            "Время на ответ",
            responsePeriodTime,
            null,
            "responsePeriod"
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default TimeParameters;
