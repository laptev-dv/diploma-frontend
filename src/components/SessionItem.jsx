import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";

function SessionItem({ session, showDivider, onClick }) {
  const handleExportClick = (e) => {
    e.stopPropagation();
    console.log("Экспорт", session.id);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    console.log("Удалить", session.id);
  };

  return (
    <>
      <ListItem button onClick={onClick}>
        <ListItemText
          primary={session.author}
          secondary={`${session.date} | Длительность: ${session.duration}`}
        />
        <Tooltip title="Экспорт результатов">
          <IconButton
            edge="end"
            onClick={handleExportClick}
            aria-label="экспорт"
          >
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
        {session.isMine && (
          <Tooltip title="Удалить сессию">
            <IconButton
              edge="end"
              onClick={handleDeleteClick}
              aria-label="удалить"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </ListItem>
      {showDivider && <Divider />}
    </>
  );
}

export default SessionItem;
