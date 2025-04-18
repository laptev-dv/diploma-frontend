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
} from "@mui/icons-material";
import StimulusPreview from "../shared/StimulusPreview";
import PresentationNavigation from './PresentationNavigation'

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

  const currentPresentation = parameters.presentations[currentPresentationIndex];

  const backgroundColor = parameters.task.backgroundColor || "#ffffff";
  const isDarkBackground = getBrightness(backgroundColor) < 128;
  const textColor = isDarkBackground ? "common.white" : "common.black";
  const buttonColor = isDarkBackground
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";

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

      {/* Main Preview */}
      <Paper
        elevation={3}
        sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Stack direction="row-reverse">
          <Button
            startIcon={<FullscreenIcon />}
            size="small"
            onClick={handleFullscreenOpen}
          >
            Полный экран
          </Button>
        </Stack>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "4px",
            height: "100%",
            py: 2,
          }}
        >
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
        </Box>
      </Paper>
    </>
  );
};

export default SessionDetailsPreview;