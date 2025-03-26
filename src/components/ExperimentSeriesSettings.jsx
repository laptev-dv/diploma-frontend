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
} from "@mui/material";

const ExperimentSeriesSettings = ({ parameters, onParamChange }) => {
  const renderEditableRow = (
    label,
    field,
    value,
    type = "text",
    isLast = false,
    unit = null
  ) => (
    <TableRow
      sx={{ "&:last-child td": { borderBottom: isLast ? 0 : undefined } }}
    >
      <TableCell>{label}</TableCell>
      <TableCell>
        <TextField
          size="small"
          fullWidth
          type={type}
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
      sx={{ "&:last-child td": { borderBottom: isLast ? 0 : undefined } }}
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
          Настройка серии
        </Typography>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Режим</TableCell>
              <TableCell>
                <Select
                  value={parameters.mode || "adaptive"}
                  onChange={(e) => onParamChange("mode", e.target.value)}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="adaptive">Адаптивный</MenuItem>
                  <MenuItem value="strict">Жесткий</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
            {parameters.mode === "adaptive" && (
              <>
                {renderEditableRow(
                  "Номер начальной задачи",
                  "initialTaskNumber",
                  parameters.initialTaskNumber || 1,
                  "number",
                  false
                )}
                {renderEditableRow(
                  "Количество предъявлений в задаче",
                  "presentationsPerTask",
                  parameters.presentationsPerTask || 20,
                  "number",
                  false,
                  "шт"
                )}
                {renderEditableRow(
                  "Время на серию",
                  "seriesTime",
                  parameters.seriesTime || 30,
                  "number",
                  false,
                  "сек"
                )}
                {renderDualNumberRow(
                  "Границы эффективности",
                  "efficiencyMin",
                  parameters.efficiencyMin || 0.5,
                  "Нижняя",
                  "efficiencyMax",
                  parameters.efficiencyMax || 0.8,
                  "Верхняя",
                  null,
                  true
                )}
              </>
            )}
            {parameters.mode === "strict" &&
              renderEditableRow(
                "Количество предъявлений в задаче",
                "presentationsPerTaskStrict",
                parameters.presentationsPerTaskStrict || 20,
                "number",
                true,
                "шт"
              )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default ExperimentSeriesSettings;