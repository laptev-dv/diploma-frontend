import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Slider,
} from "@mui/material";

const EditableSeriesSettings = ({ parameters, onParamChange }) => {
  const renderEditableRow = (
    label,
    field,
    value,
    type = "text",
    unit = null
  ) => (
    <TableRow sx={{ td: { borderBottom: 0, paddingBottom: 1 } }}>
      <TableCell>
        <TextField
          size="small"
          fullWidth
          type={type}
          label={`${label}${ unit !== null ? `, ${unit}` : ''}`}
          value={value}
          onChange={(e) =>
            onParamChange(
              field,
              type === "number" ? Number(e.target.value) : e.target.value
            )
          }
        />
      </TableCell>
    </TableRow>
  );

  const handleEfficiencyChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) return;
    
    const [min, max] = newValue;
    
    // Ограничиваем значения, чтобы min не был больше max и наоборот
    if (activeThumb === 0) {
      onParamChange("efficiencyMin", Math.min(min, parameters.efficiencyMax));
    } else {
      onParamChange("efficiencyMax", Math.max(max, parameters.efficiencyMin));
    }
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
                <FormControl fullWidth>
                  <InputLabel>Режим</InputLabel>
                  <Select
                    label="Режим"
                    value={parameters.mode}
                    onChange={(e) => onParamChange("mode", e.target.value)}
                    size="small"
                    fullWidth
                  >
                    <MenuItem value="adaptive">Адаптивный</MenuItem>
                    <MenuItem value="strict">Жесткий</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
            {parameters.mode === "adaptive" &&
              renderEditableRow(
                "Номер начальной задачи",
                "initialTaskNumber",
                parameters.initialTaskNumber,
                "number"
              )}
            {renderEditableRow(
              "Количество предъявлений в задаче",
              "presentationsPerTask",
              parameters.presentationsPerTask,
              "number",
              "шт"
            )}
            {parameters.mode === "adaptive" &&
              renderEditableRow(
                "Время на серию",
                "seriesTime",
                parameters.seriesTime,
                "number",
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
                      onChange={(e, newValue, activeThumb) => 
                        handleEfficiencyChange(e, newValue, activeThumb)
                      }
                      valueLabelDisplay="on"
                      min={0}
                      max={1} 
                      step={0.01}
                      disableSwap
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

export default EditableSeriesSettings;