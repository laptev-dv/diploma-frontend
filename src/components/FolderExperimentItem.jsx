import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function FolderExperimentItem({ experiment, onRemove }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        "&:hover": {
          backgroundColor: "action.hover",
        },
        p: 1,
        borderRadius: 1,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="textSecondary">
          Результатов: {experiment.resultsCount}
        </Typography>
        <Typography variant="h6">{experiment.name}</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
          Автор: {experiment.author} | Дата: {experiment.createdAt}
        </Typography>
      </Box>

      <IconButton
        aria-label="delete"
        onClick={onRemove}
        color="error"
        sx={{
          "&:hover": {
            backgroundColor: "rgba(255, 0, 0, 0.1)",
          },
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}

export default FolderExperimentItem;
