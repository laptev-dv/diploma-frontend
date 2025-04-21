import React from "react";
import {
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { formatDuration } from './../utils/dateFormatter';

function SessionItem({ session, showDivider, onClick, onDelete, onExport }) {
  const handleExportClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onExport(session._id);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(session._id);
  };

  return (
    <>
      <ListItem
        onClick={onClick}
        sx={{
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <ListItemText
          primary={session.author}
          secondary={
            <Box>
              <Typography variant="body2" color="#000">
                Сессия от{" "}
                {format(new Date(session.createdAt), "dd.MM.yyyy HH:mm", {
                  locale: ru,
                })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Длительность:{" "}
                {session.totalSeriesTime > 0
                  ? formatDuration(session.totalSeriesTime)
                  : "—"}
              </Typography>
            </Box>
          }
        />
        <Tooltip title="Экспорт результатов">
          <IconButton onClick={handleExportClick} aria-label="экспорт">
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
        {session.isMine && (
          <Tooltip title="Удалить сессию">
            <IconButton onClick={handleDeleteClick} aria-label="удалить">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </ListItem>
      {showDivider && <Divider sx={{ my: 1 }} />}
    </>
  );
}

export default SessionItem;