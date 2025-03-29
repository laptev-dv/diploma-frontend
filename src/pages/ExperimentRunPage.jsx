import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import FullscreenStimulus from '../components/FullscreenStimulus';
import DevPanel from '../components/DevPanel';

const MemoizedStimulus = React.memo(FullscreenStimulus);
const TICK_INTERVAL = 100;

const ExperimentRunPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Состояния эксперимента
  const [hiddenPosition, setHiddenPosition] = useState(null);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [presentationCount, setPresentationCount] = useState(0);
  const [currentPhase, setCurrentPhase] = useState("stimulus");
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [seriesTimeLeft, setSeriesTimeLeft] = useState(0);
  const [shouldCompleteAfterCurrentTask, setShouldCompleteAfterCurrentTask] = useState(false);

  // Счетчики и статистика
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [userInput, setUserInput] = useState([]);
  const [responseTimes, setResponseTimes] = useState([]);
  const [taskResults, setTaskResults] = useState([]);
  const [isExperimentComplete, setIsExperimentComplete] = useState(false);

  // Получаем данные эксперимента
  const experiment = location.state?.experiment;
  const tasks = useMemo(() => experiment?.parameters?.tasks || [], [experiment]);
  const mode = useMemo(() => experiment?.parameters?.mode || "strict", [experiment]);
  const presentationsPerTask = useMemo(() => experiment?.parameters?.presentationsPerTask, [experiment]);
  const seriesTime = useMemo(() => (experiment?.parameters?.seriesTime || 1) * 60 * 1000, [experiment]);
  const efficiencyMin = useMemo(() => experiment?.parameters?.efficiencyMin || 0.5, [experiment]);
  const efficiencyMax = useMemo(() => experiment?.parameters?.efficiencyMax || 0.8, [experiment]);
  const currentTask = useMemo(() => tasks[activeTaskIndex] || {}, [tasks, activeTaskIndex]);
  const taskParameters = useMemo(() => currentTask?.parameters || {}, [currentTask]);

  // Генерация новой позиции скрытого символа
  const generateNewHiddenPosition = useCallback(() => {
    setHiddenPosition({
      row: Math.floor(Math.random() * taskParameters.rows),
      col: Math.floor(Math.random() * taskParameters.columns),
    });
  }, [taskParameters.rows, taskParameters.columns]);

  // Сохранение статистики по выполнению задачи
  const saveTaskExecution = useCallback(() => {
    const avgResponseTime = responseTimes.length > 0 ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : 0;

    const totalAttempts = successCount + errorCount + missCount;
    const efficiency = totalAttempts > 0 ? successCount / totalAttempts : 0;

    const taskExecution = {
      taskId: currentTask.id,
      taskName: currentTask.name,
      taskIndex: activeTaskIndex,
      success: successCount,
      error: errorCount,
      miss: missCount,
      avgResponseTime,
      efficiency: Number(efficiency.toFixed(3)),
      parameters: {...currentTask.parameters},
      timestamp: new Date().toISOString(),
      presentationNumber: presentationCount + 1,
    };

    setTaskResults(prev => [...prev, taskExecution]);
    
    return taskExecution;
  }, [currentTask, activeTaskIndex, successCount, errorCount, missCount, responseTimes, presentationCount]);

  // Завершение эксперимента
  const completeExperiment = useCallback(() => {
    const lastExecution = saveTaskExecution();
    const finalStats = {
      mode,
      tasks: [...taskResults, lastExecution],
      timestamp: new Date().toISOString(),
      participant: experiment.participantInfo,
      taskParameters: tasks.map((task) => task.parameters),
    };

    const durationMs =
      mode === "adaptive"
        ? seriesTime
        : presentationsPerTask *
          tasks.length *
          (taskParameters.stimulusTime +
            taskParameters.responseTime +
            taskParameters.pauseTime);

    navigate(`/session/${Date.now()}`, {
      state: {
        sessionData: {
          ...finalStats,
          id: Date.now(),
          date: new Date().toLocaleDateString(),
          duration: `${Math.floor(durationMs / 60000)}:${Math.floor(
            (durationMs % 60000) / 1000
          ).toString().padStart(2, "0")}`,
          results: finalStats.tasks,
          surname: experiment.participantInfo?.surname || "Неизвестно",
          name: experiment.participantInfo?.name || "Неизвестно",
          group: experiment.participantInfo?.group || "Неизвестно",
          plannedDuration: `${Math.floor(seriesTime / 60000)} мин`,
          efficiencyBounds: `${efficiencyMin} - ${efficiencyMax}`,
        },
      },
    });
    setIsExperimentComplete(true);
  }, [mode, taskResults, experiment, seriesTime, navigate, presentationsPerTask, tasks, taskParameters, efficiencyMin, efficiencyMax, saveTaskExecution]);

  // Обработка завершения времени в адаптивном режиме
  const handleSeriesTimeEnd = useCallback(() => {
    if (mode !== "adaptive") return;
    
    // Устанавливаем флаг, что нужно завершить после текущей задачи
    setShouldCompleteAfterCurrentTask(true);
  }, [mode]);

  // Определение следующей задачи (для адаптивного режима)
  const getNextTaskIndex = useCallback(
    (currentIndex, efficiency) => {
      if (shouldCompleteAfterCurrentTask) {
        completeExperiment();
        return currentIndex; // Вернем текущий индекс, так как эксперимент завершается
      }

      if (mode === "strict") {
        return (currentIndex + 1) % tasks.length;
      }

      if (efficiency < efficiencyMin) {
        return Math.max(0, currentIndex - 1);
      } else if (efficiency > efficiencyMax) {
        return Math.min(tasks.length - 1, currentIndex + 1);
      }
      return currentIndex;
    },
    [mode, tasks.length, efficiencyMin, efficiencyMax, shouldCompleteAfterCurrentTask, completeExperiment]
  );

  // Проверка ответа пользователя
  const checkAnswer = useCallback(
    (input, responseTime) => {
      const [row, col] = input;
      const isCorrect =
        row === hiddenPosition.row + 1 && col === hiddenPosition.col + 1;

      if (isCorrect) {
        setSuccessCount((prev) => prev + 1);
        setResponseTimes((prev) => [...prev, responseTime]);
      } else {
        setErrorCount((prev) => prev + 1);
      }

      return isCorrect;
    },
    [hiddenPosition]
  );

  // Обработчик ввода с клавиатуры
  const handleKeyDown = useCallback(
    (e) => {
      if (
        currentPhase === "pause" ||
        userInput.length >= 2 ||
        isExperimentComplete
      )
        return;
      if (!/^[1-9]$/.test(e.key)) return;

      const newInput = [...userInput, parseInt(e.key, 10)];
      setUserInput(newInput);

      if (newInput.length === 2) {
        const responseTime = taskParameters.stimulusTime - phaseTimeLeft;
        checkAnswer(newInput, responseTime);
        setCurrentPhase("pause");
        setPhaseTimeLeft(taskParameters.pauseTime);
      }
    },
    [
      currentPhase,
      userInput,
      isExperimentComplete,
      taskParameters,
      phaseTimeLeft,
      checkAnswer,
    ]
  );

  // Переход к следующей фазе
  const goToNextPhase = useCallback(() => {
    if (currentPhase === "stimulus") {
      setCurrentPhase("response");
      setPhaseTimeLeft(taskParameters.responseTime);
    } else if (currentPhase === "response") {
      if (userInput.length < 2) {
        setMissCount((prev) => prev + 1);
      }
      setCurrentPhase("pause");
      setPhaseTimeLeft(taskParameters.pauseTime);
    } else if (currentPhase === "pause") {
      const newCount = presentationCount + 1;
      if (newCount >= presentationsPerTask) {
        const stats = saveTaskExecution();

        if (mode === "strict") {
          const nextIndex = (activeTaskIndex + 1) % tasks.length;
          if (nextIndex === 0) {
            completeExperiment();
            return;
          }
          setActiveTaskIndex(nextIndex);
        } else {
          const nextIndex = getNextTaskIndex(activeTaskIndex, stats.efficiency);
          if (nextIndex !== activeTaskIndex) {
            setActiveTaskIndex(nextIndex);
          }
        }

        setPresentationCount(0);
        setSuccessCount(0);
        setErrorCount(0);
        setMissCount(0);
        setResponseTimes([]);
      } else {
        setPresentationCount(newCount);
      }

      setCurrentPhase("stimulus");
      setPhaseTimeLeft(taskParameters.stimulusTime);
      setUserInput([]);
      generateNewHiddenPosition();
    }
  }, [
    currentPhase,
    taskParameters,
    presentationsPerTask,
    activeTaskIndex,
    tasks.length,
    mode,
    presentationCount,
    userInput.length,
    generateNewHiddenPosition,
    saveTaskExecution,
    getNextTaskIndex,
    completeExperiment,
  ]);

  // Инициализация эксперимента
  useEffect(() => {
    if (mode === "adaptive") {
      setSeriesTimeLeft(seriesTime);
    }
  }, [mode, seriesTime]);


  // Инициализация эксперимента
  useEffect(() => {
    generateNewHiddenPosition();
  }, [generateNewHiddenPosition]);

  useEffect(() => {
    if (!experiment || tasks.length === 0) {
      navigate(`/experiment/${id}`);
      return;
    }
    
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [experiment, id, navigate, tasks, handleKeyDown]);

  // Таймер фаз
  useEffect(() => {
    if (isExperimentComplete) return;

    const timer = setInterval(() => {
      setPhaseTimeLeft((prev) => {
        const newTime = prev - TICK_INTERVAL;
        if (newTime <= 0) {
          goToNextPhase();
          return getPhaseDuration(currentPhase, taskParameters);
        }
        return newTime;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(timer);
  }, [goToNextPhase, currentPhase, taskParameters, isExperimentComplete]);

  // Таймер общего времени (для адаптивного режима)
  useEffect(() => {
    if (mode !== "adaptive" || isExperimentComplete) return;

    const timer = setInterval(() => {
      setSeriesTimeLeft((prev) => {
        const newTime = prev - TICK_INTERVAL;
        if (newTime <= 0) {
          handleSeriesTimeEnd();
          return 0;
        }
        return newTime;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(timer);
  }, [mode, isExperimentComplete, handleSeriesTimeEnd]);

  // Прерывание эксперимента
  const handleInterrupt = useCallback(() => {
    navigate(`/experiment/${id}`);
  }, [navigate, id]);

  if (!experiment || tasks.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: taskParameters.backgroundColor || "#ffffff",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <MemoizedStimulus
        parameters={taskParameters}
        hiddenPosition={currentPhase === "stimulus" ? hiddenPosition : null}
        showHidden={currentPhase !== "stimulus"}
      />

      <DevPanel
        timeLeft={phaseTimeLeft / 1000}
        currentPhase={currentPhase}
        currentTaskIndex={activeTaskIndex}
        totalTasks={tasks.length}
        presentationCount={presentationCount + 1}
        presentationsPerTask={presentationsPerTask}
        hiddenPosition={hiddenPosition}
        taskParameters={taskParameters}
        successCount={successCount}
        errorCount={errorCount}
        missCount={missCount}
        userInput={userInput}
        taskStats={taskResults}
        seriesTimeLeft={seriesTimeLeft / 1000}
        mode={mode}
      />

      <Button
        variant="contained"
        color="error"
        onClick={handleInterrupt}
        sx={{
          position: "fixed",
          bottom: 40,
          right: 40,
          zIndex: 1001,
        }}
      >
        Прервать эксперимент
      </Button>
    </Box>
  );
};

function getPhaseDuration(currentPhase, taskParameters) {
  switch(currentPhase) {
    case 'stimulus': return taskParameters.responseTime;
    case 'response': return taskParameters.pauseTime;
    case 'pause': return taskParameters.stimulusTime;
    default: return 0;
  }
}

export default ExperimentRunPage;