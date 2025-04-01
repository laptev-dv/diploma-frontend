import React from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Stack,
  Button,
  Link,
} from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import SessionInfo from "../components/sessionDetails/SessionInfo";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import NavigateBackIcon from "@mui/icons-material/NavigateBefore";

function SessionDetailPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Моковые данные для адаптивного режима
  const mockData = {
    id: id || "12345",
    date: new Date().toLocaleDateString(),
    duration: "5:25",
    mode: "Адаптивный",
    tasksCount: 3,
    plannedDuration: "5 мин",
    results: [
      {
        taskId: "task1",
        taskName: "Матрица 3x3",
        taskIndex: 0,
        success: 18,
        error: 2,
        miss: 0,
        avgResponseTime: 2500,
        efficiency: 0.9,
        parameters: {
          rows: 3,
          columns: 3,
          stimulusTime: 500,
          responseTime: 10000,
          pauseTime: 500,
          presentationsPerTask: 20,
        },
        timestamp: new Date().toISOString(),
        presentationNumber: 1,
      },
      {
        taskId: "task2",
        taskName: "Матрица 4x4",
        taskIndex: 1,
        success: 15,
        error: 5,
        miss: 0,
        avgResponseTime: 3200,
        efficiency: 0.75,
        parameters: {
          rows: 4,
          columns: 4,
          stimulusTime: 500,
          responseTime: 10000,
          pauseTime: 500,
          presentationsPerTask: 20,
        },
        timestamp: new Date().toISOString(),
        presentationNumber: 1,
      },
      {
        taskId: "task3",
        taskName: "Матрица 5x5",
        taskIndex: 2,
        success: 12,
        error: 8,
        miss: 0,
        avgResponseTime: 3800,
        efficiency: 0.6,
        parameters: {
          rows: 5,
          columns: 5,
          stimulusTime: 500,
          responseTime: 10000,
          pauseTime: 500,
          presentationsPerTask: 20,
        },
        timestamp: new Date().toISOString(),
        presentationNumber: 1,
      },
    ],
  };

  // Используем переданные данные или моковые
  const sessionData = state?.sessionData || mockData;

  // Расчет расширенных метрик
  const calculateExtendedMetrics = (results) => {
    if (!results || results.length === 0) return [];

    return results.map((task) => {
      const { parameters, success, error, miss, avgResponseTime, efficiency } =
        task;
      const workload = parameters
        ? (parameters.rows * parameters.columns) / parameters.responseTime
        : 0;
      const finalScore =
        efficiency *
        (1 - avgResponseTime / (parameters?.responseTime || 10000));
      const performance = efficiency * workload;

      return {
        ...task,
        workload: Number(workload.toFixed(2)),
        finalScore: Number(finalScore.toFixed(4)),
        performance: Number(performance.toFixed(4)),
        correct: success,
        wrong: error,
        missed: miss,
      };
    });
  };

  const extendedResults = calculateExtendedMetrics(sessionData.results);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction={'row'}>
        <NavigateBackIcon fontSize="small" />
        <Link
          underline="hover"
          color="inherit"
          href="/experiment/123"
          onClick={(e) => {
            e.preventDefault();
            navigate("/experiment/123");
          }}
        >
          Эксперимент
        </Link>
      </Stack>

      <Typography variant="h4" gutterBottom>
        Детали сессии #{sessionData.id}
      </Typography>

      {/* Объединенный блок информации о сессии и таблицы результатов */}
      <SessionInfo
        sessionData={sessionData}
        extendedResults={extendedResults}
      />

      {/* Фиксированная панель внизу */}
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          top: "auto",
          bottom: 0,
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.default",
        }}
      >
        <Toolbar>
          <Stack sx={{ flexGrow: 1 }} direction={"row-reverse"} gap={2}>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                console.log("export");
              }}
              startIcon={<FileDownloadIcon />}
              sx={{ px: 4 }}
            >
              Экспортировать
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default SessionDetailPage;
