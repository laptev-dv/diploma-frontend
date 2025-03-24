import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';

function SessionItem({ session, showDivider }) {
  return (
    <>
      <ListItem button>
        <ListItemText
          primary={session.author}
          secondary={`${session.date} | Длительность: ${session.duration}`}
        />
        <ListItemSecondaryAction>
          <Tooltip title="Экспорт результатов">
            <IconButton edge="end" onClick={() => console.log('Экспорт', session.id)}>
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
          {session.isMine && (
            <Tooltip title="Удалить сессию">
              <IconButton edge="end" onClick={() => console.log('Удалить', session.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </ListItemSecondaryAction>
      </ListItem>
      {showDivider && <Divider />}
    </>
  );
}

export default SessionItem;