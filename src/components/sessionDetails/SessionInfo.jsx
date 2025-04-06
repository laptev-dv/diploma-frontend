import React from 'react';
import { 
  Paper, 
  Typography, 
  Grid,
  Chip,
  Box
} from '@mui/material';
import { 
  AccessTime, 
  CalendarToday
} from '@mui/icons-material';

import SessionResultsTable from "./SessionResultsTable"

const SessionInfo = ({ sessionData, extendedResults }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Информация о сессии
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AccessTime color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">
              <strong>Длительность:</strong> {sessionData.duration}{" "}
              (планировалось {sessionData.plannedDuration})
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <CalendarToday color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">
              <strong>Дата:</strong> {sessionData.date}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="body1">
              <strong>Режим:</strong>
            </Typography>
            <Chip
              label={sessionData.mode}
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <SessionResultsTable results={extendedResults} />
      </Box>
    </Paper>
  );
};

export default SessionInfo;