import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  Grid,
  Chip,
  LinearProgress
} from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import { 
  AccessTime, 
  Person, 
  School, 
  CalendarToday
} from '@mui/icons-material';
import SessionResultsTable from '../components/SessionResultsTable';

function SessionDetailPage() {
  const { id } = useParams();
  const { state } = useLocation();

  // Получаем данные из навигации
  const sessionData = state?.sessionData || {
    id: id,
    surname: "Неизвестно",
    name: "Неизвестно",
    group: "Неизвестно",
    date: new Date().toLocaleDateString(),
    duration: "0:00",
    mode: "Неизвестно",
    tasksCount: 0,
    plannedDuration: "0 мин",
    efficiencyBounds: "0.00 - 0.00",
    results: []
  };

  // Расчет расширенных метрик
  const calculateExtendedMetrics = (results) => {
    if (!results || results.length === 0) return [];

    return results.map(task => {
      const { parameters, success, error, miss, avgResponseTime, efficiency } = task;
      const workload = parameters ? (parameters.rows * parameters.columns) / parameters.responseTime : 0;
      const finalScore = efficiency * (1 - (avgResponseTime / (parameters?.responseTime || 10000)));
      const performance = efficiency * workload;

      return {
        ...task,
        workload: Number(workload.toFixed(2)),
        finalScore: Number(finalScore.toFixed(4)),
        performance: Number(performance.toFixed(4)),
        correct: success,
        wrong: error,
        missed: miss
      };
    });
  };

  const extendedResults = calculateExtendedMetrics(sessionData.results);

  // Расчет средних значений
  const calculateAverages = () => {
    if (!extendedResults || extendedResults.length === 0) {
      return {
        avgCorrect: 0,
        avgTime: 0,
        avgEfficiency: 0,
        avgWorkload: 0,
        avgPerformance: 0
      };
    }

    return {
      avgCorrect: extendedResults.reduce((sum, item) => sum + item.correct, 0) / extendedResults.length,
      avgTime: extendedResults.reduce((sum, item) => sum + item.avgResponseTime, 0) / extendedResults.length / 1000,
      avgEfficiency: extendedResults.reduce((sum, item) => sum + item.efficiency, 0) / extendedResults.length,
      avgWorkload: extendedResults.reduce((sum, item) => sum + item.workload, 0) / extendedResults.length,
      avgPerformance: extendedResults.reduce((sum, item) => sum + item.performance, 0) / extendedResults.length
    };
  };

  const { avgCorrect, avgTime, avgEfficiency, avgWorkload, avgPerformance } = calculateAverages();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Детали сессии #{sessionData.id}
      </Typography>

      {/* Таблица результатов */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Результаты эксперимента
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <SessionResultsTable results={extendedResults} />
      </Paper>

      {/* Информация о сессии */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Информация о сессии
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Person color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Испытуемый:</strong> {sessionData.surname} {sessionData.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <School color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Группа:</strong> {sessionData.group}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarToday color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Дата:</strong> {sessionData.date}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTime color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Длительность:</strong> {sessionData.duration} (планировалось {sessionData.plannedDuration})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip label={sessionData.mode} color="primary" size="small" sx={{ mr: 1 }} />
              <Typography variant="body1">
                <strong>Режим:</strong> {sessionData.mode}, {sessionData.tasksCount} задач
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1">
                <strong>Границы оценки:</strong> {sessionData.efficiencyBounds}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Сводная статистика */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Сводная статистика
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">Среднее правильных</Typography>
              <Typography variant="h4" color="primary">{avgCorrect.toFixed(1)}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={(avgCorrect / (extendedResults[0]?.parameters?.presentationsPerTask || 20)) * 100} 
                color="primary"
                sx={{ height: 8, mt: 1 }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">Среднее время ответа</Typography>
              <Typography variant="h4" color="secondary">{avgTime.toFixed(2)} с</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">Средняя эффективность</Typography>
              <Typography variant="h4" color="success.main">{(avgEfficiency * 100).toFixed(1)}%</Typography>
              <LinearProgress 
                variant="determinate" 
                value={avgEfficiency * 100} 
                color="success"
                sx={{ height: 8, mt: 1 }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">Средняя нагрузка</Typography>
              <Typography variant="h4">{avgWorkload.toFixed(2)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">Средняя производительность</Typography>
              <Typography variant="h4">{avgPerformance.toFixed(2)}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default SessionDetailPage;