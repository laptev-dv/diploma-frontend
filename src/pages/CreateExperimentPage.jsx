import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  AppBar,
  Toolbar,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditableExperimentParameters from "../components/EditableExperimentParameters";

function CreateExperimentPage() {
  const navigate = useNavigate();
  const [experimentName, setExperimentName] = useState("Новый эксперимент");
  const [experimentParams, setExperimentParams] = useState({
    backgroundColor: "#FFFFFF",
    symbolColor: "#000000",
    symbolType: "A",
    symbolFont: "Arial",
    symbolSize: 24,
    symbolSpacing: 10,
    stimulusTime: 0.5,
    responseTime: 10,
    pauseTime: 1,
  });

  const handleSaveExperiment = () => {
    // Здесь будет логика сохранения эксперимента
    console.log("Сохранение эксперимента:", {
      name: experimentName,
      parameters: experimentParams
    });
    navigate("/experiments");
  };

  const handleParamChange = (field, value) => {
    setExperimentParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box sx={{ pb: 7 }}>
      {/* Sticky header с кнопкой создания */}
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={0}
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Создание эксперимента
          </Typography>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveExperiment}
          >
            Создать
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {/* Поле для названия эксперимента */}
        <TextField
          label="Название эксперимента"
          fullWidth
          value={experimentName}
          onChange={(e) => setExperimentName(e.target.value)}
          sx={{ mb: 3 }}
        />

        <EditableExperimentParameters 
            parameters={experimentParams}
            onParamChange={handleParamChange}
          />
      </Box>
    </Box>
  );
}

export default CreateExperimentPage;