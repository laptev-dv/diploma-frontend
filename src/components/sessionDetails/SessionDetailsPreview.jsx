import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import StimulusPreview from "../shared/StimulusPreview";
import PresentationNavigation from './PresentationNavigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const getBrightness = (hexColor) => {
  const color = hexColor.replace(/^#/, "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

const SessionDetailsPreview = ({ parameters }) => {
  const theme = useTheme(); // Получаем тему MUI для доступа к цветам
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [currentPresentationIndex, setCurrentPresentationIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');

  const handleFullscreenOpen = () => {
    setFullscreenOpen(true);
  };

  const handleFullscreenClose = () => {
    setFullscreenOpen(false);
  };

  const handlePrev = () => {
    setCurrentPresentationIndex((prev) =>
      prev > 0 ? prev - 1 : parameters.presentations.length - 1
    );
  };

  const handleNext = () => {
    setCurrentPresentationIndex((prev) =>
      prev < parameters.presentations.length - 1 ? prev + 1 : 0
    );
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const currentPresentation = parameters.presentations[currentPresentationIndex];

  const backgroundColor = parameters.task.backgroundColor || "#ffffff";
  const isDarkBackground = getBrightness(backgroundColor) < 128;
  const textColor = isDarkBackground ? "common.white" : "common.black";
  const buttonColor = isDarkBackground
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";

  // Подготовка данных для графика
  const chartData = parameters.presentations.map((pres, index) => ({
    presentation: index + 1,
    time: pres.responseTime / 1000, // Переводим в секунды
    isCurrent: index === currentPresentationIndex,
  }));

  if (!currentPresentation) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Нет данных для отображения
        </Typography>
      </Paper>
    );
  }

  const renderContent = () => {
    if (activeTab === 'details') {
      return (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor,
              borderRadius: 1,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <StimulusPreview
              parameters={parameters.task}
              hiddenPosition={{
                row: currentPresentation.correctAnswer?.row,
                col: currentPresentation.correctAnswer?.column,
              }}
            />
          </Box>
          <PresentationNavigation
            currentPresentation={currentPresentation}
            currentIndex={currentPresentationIndex}
            totalPresentations={parameters.presentations.length}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </>
      );
    }

    if (activeTab === 'timeChart') {
      return (
        <Box sx={{ height: '100%', width: '100%' }}>
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="presentation" 
                label={{ value: 'Номер предъявления', position: 'insideBottom', offset: -10 }} 
              />
              <YAxis 
                label={{ value: 'Время (сек)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip 
                formatter={(value) => [`${value} сек`, 'Время реакции']}
                labelFormatter={(label) => `Предъявление ${label}`}
              />
              <Line
                type="monotone"
                dataKey="time"
                stroke={theme.palette.primary.main} // Используем primary цвет из темы
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      );
    }

    return null;
  };

  return (
    <>
      {/* Fullscreen Dialog */}
      <Dialog
        fullScreen
        open={fullscreenOpen}
        onClose={handleFullscreenClose}
        PaperProps={{ sx: { backgroundColor } }}
      >
        <DialogActions>
          <IconButton
            edge="end"
            onClick={handleFullscreenClose}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 40,
              top: 40,
              color: textColor,
              "&:hover": { backgroundColor: buttonColor },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <StimulusPreview
            parameters={{
              ...parameters.task
            }}
            hiddenPosition={{
              row: currentPresentation.correctAnswer?.row,
              col: currentPresentation.correctAnswer?.column,
            }}
          />
          <Paper
            elevation={2}
            sx={{
              p: 1,
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
            }}
          >
            <PresentationNavigation
              currentPresentation={currentPresentation}
              currentIndex={currentPresentationIndex}
              totalPresentations={parameters.presentations.length}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </Paper>
        </DialogContent>
      </Dialog>

      {/* Main Preview с табами */}
      <Paper
        elevation={3}
        sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
          >
            <Tab label="Детали" value="details" />
            <Tab label="Время" value="timeChart" />
          </Tabs>
          
          {/* Показываем кнопку только на вкладке "Детали" */}
          {activeTab === 'details' && (
            <Button
              startIcon={<FullscreenIcon />}
              size="small"
              onClick={handleFullscreenOpen}
            >
              Полный экран
            </Button>
          )}
        </Stack>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "4px",
            height: "100%",
            flexGrow: 1,
          }}
        >
          {renderContent()}
        </Box>
      </Paper>
    </>
  );
};

export default SessionDetailsPreview;