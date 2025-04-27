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
import * as XLSX from "xlsx";

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

        // Подгрузка шрифтов
        const fontFamilies = response.data.results.map(
          (result) => result.task.symbolFont
        );
        preloadFonts(fontFamilies);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [id]);

  const preloadFonts = (fontFamilies) => {
    fontFamilies.forEach((fontFamily) => {
      const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
        / /g,
        "+"
      )}&display=swap`;
      const existingLinks = Array.from(
        document.head.querySelectorAll('link[rel="stylesheet"]')
      );

      if (!existingLinks.some((link) => link.href === fontUrl)) {
        const link = document.createElement("link");
        link.href = fontUrl;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
    });
  };

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

  const exportSessionData = (data) => {
    // Создаем книгу Excel
    const workbook = XLSX.utils.book_new();

    // 1. Лист "Отчет"
    const reportData = [
      ["Серия эксперимента"],
      ["Дата", "", new Date(data.date).toLocaleString()],
      ["Реальная длительность, мин", "", formatDuration(data.duration)],
      [
        "Режим",
        "",
        data.experiment.mode === "strict" ? "Строгий" : "Адаптивный",
      ],
      ["Число задач", "", data.results?.length || 0],
      [
        "Число предъявлений стимула",
        "",
        data.results?.reduce(
          (sum, task) => sum + (task.presentations?.length || 0),
          0
        ) || 0,
      ],
      [],
      ["Параметры задач"],
    ];

    // Добавляем параметры каждой задачи
    data.results?.forEach((taskResult, index) => {
      const task = taskResult.task || {};
      reportData.push(
        ["№ задачи", index + 1],
        ["Название", task.name || "Не указано"],
        [
          "Размер матрицы (строки х столбцы)",
          `${task.rows || 0}×${task.columns || 0}`,
        ],
        ["Цвет символа", task.symbolColor || "Не указан"],
        ["Цвет фона", task.backgroundColor || "Не указан"],
        ["Вид символа", task.symbolType || "Не указан"],
        ["Шрифт символа", task.symbolFont || "Не указан"],
        [
          "Размер символа, пикс.",
          `ширина - ${task.symbolWidth || 0}`,
          `высота - ${task.symbolHeight || 0}`,
        ],
        [
          "Расстояние между символами, пикс.",
          `гор - ${task.horizontalSpacing || 0}`,
          `верт - ${task.verticalSpacing || 0}`,
        ],
        [
          "Время предъявления стимула, с",
          (task.stimulusTime / 1000).toFixed(2),
        ],
        ["Время ожидания ответа, с", (task.responseTime / 1000).toFixed(2)],
        ["Время паузы, с", (task.pauseTime / 1000).toFixed(2)],
        []
      );
    });

    // Добавляем результаты
    reportData.push(
      [],
      ["Результаты серии"],
      [
        "№ п/п",
        "№ задачи",
        "Количество ответов",
        "",
        "",
        "Среднее время ответа, с",
        "Оценка эффективности",
        "Итоговая оценка",
        "Производительность",
        "Нагрузка",
      ],
      ["", "", "правильных", "ошибочных", "пропущенных"]
    );

    const extendedResults = calculateExtendedMetrics(data.results || []);
    extendedResults.forEach((task, index) => {
      reportData.push([
        index + 1,
        index + 1,
        task.successCount,
        task.errorCount,
        task.missCount,
        (task.avgResponseTime / 1000).toFixed(2),
        (task.successRate / 100).toFixed(2),
        task.performanceScore,
        task.taskDifficulty,
      ]);
    });

    const reportSheet = XLSX.utils.aoa_to_sheet(reportData);
    XLSX.utils.book_append_sheet(workbook, reportSheet, "Отчет");

    // 2. Лист "Полные данные"
    const fullData = [];
    data.results?.forEach((taskResult, taskIndex) => {
      fullData.push([`Задача ${taskIndex + 1}`]);
      fullData.push([
        "№",
        "X",
        "Y",
        "Введенный X",
        "Введенный Y",
        "Время (c)",
        "Корректен",
        "Результат",
      ]);

      taskResult.presentations?.forEach((pres, idx) => {
        const isCorrect =
          pres.userAnswer?.row === pres.correctAnswer?.row &&
          pres.userAnswer?.column === pres.correctAnswer?.column;
        fullData.push([
          idx + 1,
          pres.correctAnswer?.row,
          pres.correctAnswer?.column,
          pres.userAnswer?.row,
          pres.userAnswer?.column,
          (pres.responseTime / 1000).toFixed(2),
          isCorrect ? 1 : 0,
          isCorrect ? "+" : "-",
        ]);
      });
      fullData.push([]);
    });

    const fullDataSheet = XLSX.utils.aoa_to_sheet(fullData);
    XLSX.utils.book_append_sheet(workbook, fullDataSheet, "Полные данные");

    // Сохраняем файл
    XLSX.writeFile(workbook, `Сессия_${data._id}.xlsx`);
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
    <Container
      maxWidth="xl"
      sx={{
        p: 3,
        pb: 0,
      }}
    >
      <SessionBreadCrumbs experimentId={sessionData.experiment._id} />

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

export default SessionDetailPage;
