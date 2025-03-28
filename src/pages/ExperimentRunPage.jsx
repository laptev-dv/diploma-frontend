import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import FullscreenStimulus from '../components/FullscreenStimulus';
import DevPanel from '../components/DevPanel';

const MemoizedStimulus = React.memo(FullscreenStimulus);

const ExperimentRunPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [hiddenPosition, setHiddenPosition] = useState(null);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [changeCounter, setChangeCounter] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1);

  const experiment = location.state?.experiment;
  const tasks = useMemo(() => experiment?.parameters?.tasks || [], [experiment]);

  const taskParameters = useMemo(() => tasks[activeTaskIndex]?.parameters || {}, 
    [tasks, activeTaskIndex]);

  const taskBackground = useMemo(() => 
    taskParameters.backgroundColor || '#ffffff', 
    [taskParameters]
  );

  const generateNewHiddenPosition = useCallback(() => {
    if (!taskParameters.rows || !taskParameters.columns) return;
    
    setHiddenPosition({
      row: Math.floor(Math.random() * taskParameters.rows),
      col: Math.floor(Math.random() * taskParameters.columns)
    });
    
    setChangeCounter(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setActiveTaskIndex(prevIndex => (prevIndex + 1) % tasks.length);
        return 0;
      }
      return newCount;
    });

    // Сбрасываем таймер
    setTimeLeft(2);
  }, [taskParameters, tasks.length]);

  useEffect(() => {
    if (!experiment || tasks.length === 0) {
      navigate(`/experiment/${id}`);
      return;
    }

    // Таймер обратного отсчета
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 0.1).toFixed(1));
    }, 100);

    // Интервал смены позиции
    const positionInterval = setInterval(() => {
      generateNewHiddenPosition();
    }, 2000);

    return () => {
      clearInterval(timerInterval);
      clearInterval(positionInterval);
    };
  }, [experiment, id, navigate, generateNewHiddenPosition, tasks.length]);

  const handleInterrupt = useCallback(() => {
    navigate(`/experiment/${id}`);
  }, [navigate, id]);

  if (!experiment || tasks.length === 0) {
    return null;
  }

  return (
    <Box sx={{ 
      backgroundColor: taskBackground, 
      height: "100vh", 
      width: "100vw",
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <MemoizedStimulus
        parameters={taskParameters}
        hiddenPosition={hiddenPosition}
      />

      {/* Панель разработчика */}
      <DevPanel 
        timeLeft={timeLeft}
        currentTaskIndex={activeTaskIndex}
        totalTasks={tasks.length}
        hiddenPosition={hiddenPosition}
        experiment={experiment}
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

export default ExperimentRunPage;