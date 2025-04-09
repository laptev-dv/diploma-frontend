import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import TimeParameters from "../experimentDetails/TimeParameters";
import FullscreenPreview from "../experimentDetails/FullscreenPreview";
import ExperimentGeneralParams from "../experimentDetails/ExperimentGeneralParams";
import SeriesSettings from "../experimentDetails/SeriesSettings";
import SessionResults from "./SessionResults";
import SessionDetailsPreview from "./SessionDetailsPreview";

function SessionParameters({ sessionData }) {
  const { experiment, results } = sessionData;

  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [activeResultId, setActiveResultId] = useState(results[0]?._id);

  const handleFullscreenOpen = () => {
    setFullscreenOpen(true);
  };

  const handleFullscreenClose = () => {
    setFullscreenOpen(false);
  };

  const handleTaskClick = (resultId) => {
    setActiveResultId(resultId);
  };

  const activeResult = results.find(result => result._id === activeResultId) || results[0];

  return (
    <>
      <FullscreenPreview
        open={fullscreenOpen}
        onClose={handleFullscreenClose}
        parameters={activeResult.task}
      />

      <Stack direction="row" gap={3}>
        <Stack
          direction="column"
          gap={3}
          sx={{
            flex: 1,
            maxWidth: 900,
          }}
        >
          {/* Блок серии и режима работы */}
          <SeriesSettings parameters={{
            mode: experiment.mode,
            initialTaskNumber: experiment.initialTaskNumber,
            presentationsPerTask: experiment.presentationsPerTask,
            seriesTime: experiment.seriesTime,
            efficiencyMin: experiment.efficiencyMin,
            efficiencyMax: experiment.efficiencyMax,
          }} />

          <Box sx={{ display: "flex", gap: 3 }}>
            {/* Блок результатов */}
            <Box
              sx={{
                flex: 3,
                minWidth: 320,
                position: "sticky",
                top: 80,
                height: "calc(100vh - 220px)"
              }}
            >
              <SessionResults
                results={results}
                activeResultId={activeResultId}
                onTaskClick={handleTaskClick}
              />
            </Box>

            <Box
              sx={{
                flex: 4,
                display: "flex",
                flexDirection: "column",
                gap: 3,
                minWidth: 394,
              }}
            >
              {/* Основные параметры эксперимента */}
              <ExperimentGeneralParams parameters={{
                ...activeResult.task,
                ...activeResult
              }} />

              {/* Временные параметры */}
              <TimeParameters
                parameters={{
                  stimulusTime: activeResult.task.stimulusTime,
                  responseTime: activeResult.task.responseTime,
                  pauseTime: activeResult.task.pauseTime,
                }}
              />
            </Box>
          </Box>
        </Stack>

        {/* Блок предпросмотра */}
        <Box
          sx={{
            flex: 1,
            position: "sticky",
            top: 80,
            height: "calc(100vh - 220px)"
          }}
        >
          <SessionDetailsPreview
            parameters={activeResult}
            onFullscreen={handleFullscreenOpen}
          />
        </Box>
      </Stack>
    </>
  );
}

export default SessionParameters;