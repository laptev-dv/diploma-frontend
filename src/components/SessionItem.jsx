import React from "react";
import {
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

function SessionItem({ session, showDivider, onClick, onDelete }) {
  const handleExportClick = (e) => {
    e.stopPropagation();
    console.log("Экспорт", session._id);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
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
          secondary={`${format(
            new Date(session.createdAt),
            "dd.MM.yyyy HH:mm",
            {
              locale: ru,
            }
          )}`}
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
      {showDivider && <Divider />}
    </>
  );
}

export default SessionItem;
