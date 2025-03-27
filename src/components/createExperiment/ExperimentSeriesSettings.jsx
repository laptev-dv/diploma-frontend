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
  InputAdornment,
  Stack,
  InputLabel,
  FormControl,
} from "@mui/material";

const ExperimentSeriesSettings = ({ parameters, onParamChange }) => {
  const renderEditableRow = (
    label,
    field,
    value,
    type = "text",
    unit = null
  ) => (
    <TableRow sx={{ td : { borderBottom: 0, paddingBottom: 1 } }} >
      <TableCell>
        <TextField
          size="small"
          fullWidth
          type={type}
          label={label}
          value={value}
          onChange={(e) =>
            onParamChange(
              field,
              type === "number" ? Number(e.target.value) : e.target.value
            )
          }
          InputProps={
            unit
              ? {
                  endAdornment: (
                    <InputAdornment position="end">{unit}</InputAdornment>
                  ),
                }
              : {}
          }
        />
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
  ) => (
    <TableRow sx={{ td: { borderBottom: 0 } }}>
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
                    value={parameters.mode || "adaptive"}
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
                parameters.initialTaskNumber || 1,
                "number",
              )}
            {renderEditableRow(
              "Количество предъявлений в задаче",
              "presentationsPerTask",
              parameters.presentationsPerTask || 20,
              "number",
              parameters.mode === "strict",
              "шт"
            )}
            {parameters.mode === "adaptive" &&
              renderEditableRow(
                "Время на серию",
                "seriesTime",
                parameters.seriesTime || 30,
                "number",
                "сек"
              )}
            {parameters.mode === "adaptive" && (
              <>
                <TableRow sx={{ td: { borderBottom: 0, paddingBottom: 0 } }}>
                  <TableCell>Границы эффективности</TableCell>
                </TableRow>

                {renderDualNumberRow(
                  "efficiencyMin",
                  parameters.efficiencyMin || 0.5,
                  "Нижняя",
                  "efficiencyMax",
                  parameters.efficiencyMax || 0.8,
                  "Верхняя",
                  null,
                )}
              </>
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default ExperimentSeriesSettings;
