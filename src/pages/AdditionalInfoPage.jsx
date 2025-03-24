import React from 'react';
import { 
  Box,
  Typography,
  Paper,
  Button,
  Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import WindowsIcon from '@mui/icons-material/Window';
import DescriptionIcon from '@mui/icons-material/Description';
import ScienceIcon from '@mui/icons-material/Science';

function AdditionalInfoPage() {
  // Обработчики для скачивания файлов
  const handleDownloadOldVersion = () => {
    window.open('/old-version-app.zip', '_blank');
  };

  const handleDownloadUserManual = () => {
    window.open('/user-manual.pdf', '_blank');
  };

  const handleDownloadExperimentGuide = () => {
    window.open('/experiment-guide.pdf', '_blank');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Дополнительная информация
      </Typography>

      {/* Блок "Старая версия приложения" */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WindowsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Версия для Windows
          </Typography>
        </Box>
        <Typography>
          Десктопная версия приложения, совместимая только с операционной системой Windows.
        </Typography>
        <Button
          startIcon={<DownloadIcon />}
          onClick={handleDownloadOldVersion}
          sx={{ mt: 1 }}
        >
          Скачать для Windows
        </Button>
      </Paper>

      {/* Блок "Руководство пользователя" */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DescriptionIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Руководство пользователя
          </Typography>
        </Box>
        <Typography>
          Руководство по использованию веб-приложения с описанием всех функций.
        </Typography>
        <Button
          startIcon={<DownloadIcon />}
          onClick={handleDownloadUserManual}
          sx={{ mt: 1 }}
        >
          Скачать руководство
        </Button>
      </Paper>

      {/* Новый блок "Инструкция для проведения эксперимента" */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ScienceIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Проведение эксперимента
          </Typography>
        </Box>
        <Typography>
          Подробное руководство по подготовке и проведению экспериментов в системе.
        </Typography>
        <Button
          startIcon={<DownloadIcon />}
          onClick={handleDownloadExperimentGuide}
          sx={{ mt: 1 }}
        >
          Скачать инструкцию
        </Button>
      </Paper>
    </Box>
  );
}

export default AdditionalInfoPage;