import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Divider,
  Grid,
  Chip,
  LinearProgress
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { 
  AccessTime, 
  Person, 
  School, 
  CalendarToday,
  CheckCircle,
  Cancel,
  Timer
} from '@mui/icons-material';

function SessionDetailPage() {
  const { id } = useParams();

  // Моковые данные из таблицы
  const sessionData = {
    id: id,
    surname: "Пустовой",
    name: "Артем",
    group: "Ктмо1-11",
    date: "12.05.2025",
    duration: "5:08",
    mode: "Адаптивный",
    tasksCount: 1,
    presentations: 20,
    plannedDuration: "5 мин",
    efficiencyBounds: "0.80 - 0.90",
    taskParams: {
      matrixSize: "5×5",
      symbolColor: "#FF000000",
      backgroundColor: "#FFFFFFFF",
      symbol: "#",
      font: "Arial",
      symbolSize: "40×40",
      spacing: "40×40",
      stimulusTime: "0.5 с",
      responseTime: "10 с",
      pauseTime: "0.5 с"
    },
    results: [
      { id: 1, task: 1, correct: 20, wrong: 0, missed: 0, avgTime: 2.709, efficiency: 1, finalScore: 0.7291, performance: 4.3746, load: 150 },
      { id: 2, task: 1, correct: 20, wrong: 0, missed: 0, avgTime: 2.51, efficiency: 1, finalScore: 0.749, performance: 4.494, load: 150 },
      { id: 3, task: 1, correct: 19, wrong: 1, missed: 0, avgTime: 3.057, efficiency: 0.95, finalScore: 0.659585, performance: 2.824091178, load: 150 },
      { id: 4, task: 1, correct: 20, wrong: 0, missed: 0, avgTime: 2.489, efficiency: 1, finalScore: 0.7511, performance: 4.5066, load: 150 },
      { id: 5, task: 1, correct: 17, wrong: 3, missed: 0, avgTime: 2.136, efficiency: 0.85, finalScore: 0.66844, performance: 1.56479008, load: 150 }
    ]
  };

  // Расчет средних значений
  const avgCorrect = sessionData.results.reduce((sum, item) => sum + item.correct, 0) / sessionData.results.length;
  const avgTime = sessionData.results.reduce((sum, item) => sum + item.avgTime, 0) / sessionData.results.length;
  const avgEfficiency = sessionData.results.reduce((sum, item) => sum + item.efficiency, 0) / sessionData.results.length;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Детали сессии #{sessionData.id}
      </Typography>

      {/* Информация о сессии */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
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

      {/* Параметры задачи */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Параметры задачи
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Typography variant="body1"><strong>Размер матрицы:</strong> {sessionData.taskParams.matrixSize}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body1"><strong>Цвет символа:</strong> 
              <Box component="span" sx={{ 
                display: 'inline-block', 
                width: 16, 
                height: 16, 
                backgroundColor: sessionData.taskParams.symbolColor, 
                ml: 1,
                border: '1px solid #ccc'
              }} />
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body1"><strong>Цвет фона:</strong> 
              <Box component="span" sx={{ 
                display: 'inline-block', 
                width: 16, 
                height: 16, 
                backgroundColor: sessionData.taskParams.backgroundColor, 
                ml: 1,
                border: '1px solid #ccc'
              }} />
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body1"><strong>Вид символа:</strong> {sessionData.taskParams.symbol}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body1"><strong>Шрифт:</strong> {sessionData.taskParams.font}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body1"><strong>Размер символа:</strong> {sessionData.taskParams.symbolSize}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body1"><strong>Расстояние:</strong> {sessionData.taskParams.spacing}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body1"><strong>Время стимула:</strong> {sessionData.taskParams.stimulusTime}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body1"><strong>Время ответа:</strong> {sessionData.taskParams.responseTime}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="body1"><strong>Время паузы:</strong> {sessionData.taskParams.pauseTime}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Результаты */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Результаты серии
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {/* Сводная статистика */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">Среднее правильных</Typography>
              <Typography variant="h4" color="primary">{avgCorrect.toFixed(1)}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={(avgCorrect / 20) * 100} 
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
        </Grid>

        {/* Детальная таблица результатов */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>Задача</TableCell>
                <TableCell align="center">Ответы</TableCell>
                <TableCell align="center">Среднее время</TableCell>
                <TableCell align="center">Эффективность</TableCell>
                <TableCell align="center">Итоговая оценка</TableCell>
                <TableCell align="center">Производительность</TableCell>
                <TableCell align="center">Нагрузка</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessionData.results.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.task}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Chip 
                        icon={<CheckCircle />} 
                        label={row.correct} 
                        color="success" 
                        size="small" 
                      />
                      <Chip 
                        icon={<Cancel />} 
                        label={row.wrong} 
                        color="error" 
                        size="small" 
                      />
                      <Chip 
                        icon={<Timer />} 
                        label={row.missed} 
                        color="warning" 
                        size="small" 
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">{row.avgTime.toFixed(2)} с</TableCell>
                  <TableCell align="center">{(row.efficiency * 100).toFixed(0)}%</TableCell>
                  <TableCell align="center">{row.finalScore.toFixed(4)}</TableCell>
                  <TableCell align="center">{row.performance.toFixed(4)}</TableCell>
                  <TableCell align="center">{row.load}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default SessionDetailPage;