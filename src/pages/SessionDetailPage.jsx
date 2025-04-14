import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Stack,
  Button,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import SessionInfo from "../components/sessionDetails/SessionInfo";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { sessionApi } from "../api/sessionApi";
import SessionParameters from "../components/sessionDetails/SessionParameters";
import SessionBreadCrumbs from "../components/sessionDetails/SessionBreadCrumbs";

function SessionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true);
        const response = await sessionApi.getById(id);
        setSessionData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [id]);

  const calculateExtendedMetrics = (results) => {
    if (!results || results.length === 0) return [];

    return results.map((task) => {
      const totalPresentations = task.presentations.length;
      const successRate = task.successCount / totalPresentations;
      const errorRate = task.errorCount / totalPresentations;
      const missRate = task.missCount / totalPresentations;

      // Расчет дополнительных метрик
      const performanceScore = successRate * (1 - task.avgResponseTime / 10000);
      const taskDifficulty = (task.rows * task.columns) / task.stimulusTime;

      return {
        ...task,
        successRate: Number((successRate * 100).toFixed(1)),
        errorRate: Number((errorRate * 100).toFixed(1)),
        missRate: Number((missRate * 100).toFixed(1)),
        performanceScore: Number(performanceScore.toFixed(2)),
        taskDifficulty: Number(taskDifficulty.toFixed(2)),
        parameters: {
          rows: task.rows,
          columns: task.columns,
          stimulusTime: task.stimulusTime,
          responseTime: task.responseTime,
          pauseTime: task.pauseTime,
        },
      };
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate(-1)}>Назад</Button>
      </Box>
    );
  }

  if (!sessionData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Данные сессии не найдены</Alert>
        <Button onClick={() => navigate(-1)}>Назад</Button>
      </Box>
    );
  }

  const extendedResults = calculateExtendedMetrics(sessionData.results || []);
  const overallStats = extendedResults.reduce(
    (acc, task) => {
      acc.totalPresentations += task.presentations?.length || 0;
      acc.totalSuccess += task.successCount || 0;
      acc.totalErrors += task.errorCount || 0;
      acc.totalMisses += task.missCount || 0;
      acc.totalResponseTime +=
        (task.avgResponseTime || 0) * (task.presentations?.length || 0);
      return acc;
    },
    {
      totalPresentations: 0,
      totalSuccess: 0,
      totalErrors: 0,
      totalMisses: 0,
      totalResponseTime: 0,
    }
  );

  const overallEfficiency =
    overallStats.totalPresentations > 0
      ? (overallStats.totalSuccess / overallStats.totalPresentations) * 100
      : 0;
  const avgResponseTime =
    overallStats.totalPresentations > 0
      ? overallStats.totalResponseTime / overallStats.totalPresentations
      : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 3, pb: 8 }}>
        <SessionBreadCrumbs experimentId={sessionData.experiment._id}/>

        <SessionInfo
          sessionData={{
            ...sessionData,
            date: new Date(sessionData.date).toLocaleString(),
            duration: formatDuration(sessionData.duration),
            overallEfficiency: Number(overallEfficiency.toFixed(1)),
            avgResponseTime: Number(avgResponseTime.toFixed(0)),
            tasksCount: sessionData.results?.length || 0,
            totalPresentations: overallStats.totalPresentations,
            totalSuccess: overallStats.totalSuccess,
            totalErrors: overallStats.totalErrors,
            totalMisses: overallStats.totalMisses,
          }}
          extendedResults={extendedResults}
        />

        <SessionParameters sessionData={sessionData} />

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
                onClick={() => exportSessionData(sessionData)}
                startIcon={<FileDownloadIcon />}
                sx={{ px: 4 }}
              >
                Экспортировать
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
    </Container>
  );
}

function formatDuration(milliseconds) {
  if (!milliseconds) return "0:00";
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function exportSessionData(sessionData) {
  const dataStr = JSON.stringify(sessionData, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
    dataStr
  )}`;

  const exportFileDefaultName = `session_${sessionData._id}.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
}

export default SessionDetailPage;
