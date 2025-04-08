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
  Chip,
} from "@mui/material";
import {
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import StimulusPreview from "../shared/StimulusPreview";

const getBrightness = (hexColor) => {
  const color = hexColor.replace(/^#/, "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

const formatAnswer = (answer) => {
  if (!answer) return "Нет ответа";
  return `Строка ${answer.row}, Колонка ${answer.column}`;
};

const SessionDetailsPreview = ({ parameters }) => {
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [currentPresentationIndex, setCurrentPresentationIndex] = useState(0);

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

  const currentPresentation =
    parameters.presentations[currentPresentationIndex];
  const isCorrect =
    currentPresentation.userAnswer &&
    currentPresentation.userAnswer?.row ===
      currentPresentation.correctAnswer.row &&
    currentPresentation.userAnswer.column ===
      currentPresentation.correctAnswer.column;

  const backgroundColor = parameters.task.backgroundColor || "#ffffff";
  const isDarkBackground = getBrightness(backgroundColor) < 128;
  const textColor = isDarkBackground ? "common.white" : "common.black";
  const buttonColor = isDarkBackground
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";

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
          }}
        >
          <StimulusPreview
            parameters={{
              ...parameters.task,
              targetRow: currentPresentation.correctAnswer.row,
              targetColumn: currentPresentation.correctAnswer.column,
            }}
          />

          <Stack spacing={2} sx={{ mt: 4, width: "100%", maxWidth: 400 }}>
            <Stack direction="row" justifyContent="center" spacing={2}>
              <IconButton onClick={handlePrev} sx={{ color: textColor }}>
                <PrevIcon />
              </IconButton>
              <Typography variant="body1" color={textColor}>
                {currentPresentationIndex + 1}/{parameters.presentations.length}
              </Typography>
              <IconButton onClick={handleNext} sx={{ color: textColor }}>
                <NextIcon />
              </IconButton>
            </Stack>

            <Box>
              <Typography variant="subtitle2" color={textColor}>
                Правильный ответ:
              </Typography>
              <Typography variant="body1" color={textColor}>
                {formatAnswer(currentPresentation.correctAnswer)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color={textColor}>
                Ответ пользователя:
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body1" color={textColor}>
                  {formatAnswer(currentPresentation.userAnswer)}
                </Typography>
                {currentPresentation.userAnswer && (
                  <Chip
                    size="small"
                    label={isCorrect ? "Правильно" : "Ошибка"}
                    color={isCorrect ? "success" : "error"}
                    icon={isCorrect ? <CheckIcon /> : <ClearIcon />}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Main Preview */}
      <Paper
        elevation={3}
        sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Детали выполнения
          </Typography>
          <Button
            startIcon={<FullscreenIcon />}
            size="small"
            onClick={handleFullscreenOpen}
          >
            Полный экран
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "4px",
            height: "100%",
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor,
              borderRadius: "4px",
              height: "100%",
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <StimulusPreview
              parameters={parameters.task}
              hiddenPosition={{ 
                row: currentPresentation.correctAnswer.row, 
                col: currentPresentation.correctAnswer.column,
            }}
            />
          </Box>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Stack direction="row" justifyContent="center" spacing={2} alignItems='center'>
              <IconButton onClick={handlePrev}>
                <PrevIcon />
              </IconButton>
              <Typography variant="body1">
                {currentPresentationIndex + 1}/{parameters.presentations.length}
              </Typography>
              <IconButton onClick={handleNext}>
                <NextIcon />
              </IconButton>
            </Stack>

            <Box>
              <Typography variant="subtitle2">Время на ответ:</Typography>
              <Typography variant="body1">
                {currentPresentation.responseTime}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">Правильный ответ:</Typography>
              <Typography variant="body1">
                {formatAnswer(currentPresentation.correctAnswer)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2">Ответ пользователя:</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body1">
                  {formatAnswer(currentPresentation.userAnswer)}
                </Typography>
                {currentPresentation.userAnswer && (
                  <Chip
                    size="small"
                    label={isCorrect ? "Правильно" : "Ошибка"}
                    color={isCorrect ? "success" : "error"}
                    icon={isCorrect ? <CheckIcon /> : <ClearIcon />}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </>
  );
};

export default SessionDetailsPreview;
