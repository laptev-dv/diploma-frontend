import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  InputAdornment,
  Slider,
} from "@mui/material";

const SeriesSettings = ({ parameters }) => {
  const renderStaticRow = (
    label,
    value,
    unit = null,
  ) => (
    <TableRow sx={{ td: { borderBottom: 0, paddingBottom: 1 } }}>
      <TableCell>
        <TextField
          size="small"
          fullWidth
          label={label}
          value={value}
          disabled
          InputProps={{
            readOnly: true,
            ...(unit ? {
              endAdornment: (
                <InputAdornment position="end">{unit}</InputAdornment>
              )
            } : {}),
            sx: {
              '& input': {
                cursor: 'default',
              }
            }
          }}
          sx={{
            '& .Mui-disabled': {
              color: 'inherit',
              WebkitTextFillColor: 'inherit',
            }
          }}
        />
      </TableCell>
    </TableRow>
  );

  const getModeLabel = (mode) => {
    return mode === "adaptive" ? "Адаптивный" : "Жесткий";
  };

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Настройка серии
        </Typography>
        <Table>
          <TableBody>
            <TableRow sx={{ td: { borderBottom: 0, paddingBottom: 1 } }}>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  label="Режим"
                  value={getModeLabel(parameters.mode)}
                  disabled
                  InputProps={{
                    readOnly: true,
                    sx: {
                      '& input': {
                        cursor: 'default',
                      }
                    }
                  }}
                  sx={{
                    '& .Mui-disabled': {
                      color: 'inherit',
                      WebkitTextFillColor: 'inherit',
                    }
                  }}
                />
              </TableCell>
            </TableRow>
            {parameters.mode === "adaptive" &&
              renderStaticRow(
                "Номер начальной задачи",
                parameters.initialTaskNumber,
                null
              )}
            {renderStaticRow(
              "Количество предъявлений в задаче",
              parameters.presentationsPerTask,
              "шт",
              parameters.mode === "strict"
            )}
            {parameters.mode === "adaptive" &&
              renderStaticRow(
                "Время на серию",
                parameters.seriesTime,
                "сек"
            )}
            {parameters.mode === "adaptive" && (
              <>
                <TableRow sx={{ td: { borderBottom: 0, paddingBottom: 1 } }}>
                  <TableCell>
                    <Typography gutterBottom sx={{ mb: 2 }}>
                      Границы эффективности
                    </Typography>
                    <Slider
                      value={[
                        parameters.efficiencyMin,
                        parameters.efficiencyMax,
                      ]}
                      valueLabelDisplay="on"
                      min={0}
                      max={1}
                      step={0.01}
                      disabled
                      sx={{
                        mt: 2,
                        '& .MuiSlider-valueLabel': {
                          backgroundColor: 'primary.main',
                          borderRadius: 1,
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default SeriesSettings;