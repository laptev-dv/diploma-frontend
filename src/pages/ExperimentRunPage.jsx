import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import FullscreenStimulus from '../components/FullscreenStimulus';

const MemoizedStimulus = React.memo(FullscreenStimulus);

const ExperimentRunPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [hiddenPosition, setHiddenPosition] = useState(null);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [changeCounter, setChangeCounter] = useState(0);

  const experiment = location.state?.experiment;

  // Получаем все задачи
  const tasks = useMemo(() => {
    return experiment?.parameters?.tasks || [];
  }, [experiment]);

  // Текущие параметры задачи
  const taskParameters = useMemo(() => {
    return tasks[activeTaskIndex]?.parameters || {};
  }, [tasks, activeTaskIndex]);

  const taskBackground = useMemo(() => {
    return taskParameters.backgroundColor || '#ffffff';
  }, [taskParameters]);

  // Генерация новой позиции
  const generateNewHiddenPosition = useCallback(() => {
    if (!taskParameters.rows || !taskParameters.columns) return;
    
    setHiddenPosition({
      row: Math.floor(Math.random() * taskParameters.rows),
      col: Math.floor(Math.random() * taskParameters.columns)
    });
    
    // Увеличиваем счетчик смен
    setChangeCounter(prev => {
      const newCount = prev + 1;
      
      // Каждые 3 смены меняем задачу
      if (newCount >= 3) {
        setActiveTaskIndex(prevIndex => 
          (prevIndex + 1) % tasks.length
        );
        return 0;
      }
      return newCount;
    });
  }, [taskParameters, tasks.length]);

  useEffect(() => {
    if (!experiment || tasks.length === 0) {
      navigate(`/experiment/${id}`);
      return;
    }

    let animationFrameId;
    let lastUpdateTime = 0;
    const updateInterval = 1000; // 1 секунда

    const updatePosition = (timestamp) => {
      if (timestamp - lastUpdateTime >= updateInterval) {
        generateNewHiddenPosition();
        lastUpdateTime = timestamp;
      }
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(animationFrameId);
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