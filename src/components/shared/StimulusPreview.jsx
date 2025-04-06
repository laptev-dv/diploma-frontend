import React from 'react';
import { Box, Typography } from '@mui/material';

const StimulusPreview = ({ parameters, hiddenPosition }) => {
  const { 
    symbolType = 'A',
    symbolColor = '#000000',
    symbolFont = 'Arial',
    symbolWidth = 24,
    symbolHeight = 24,
    rows = 4,
    columns = 4,
    horizontalPadding = 5,
    verticalPadding = 5,
    backgroundColor = '#FFFFFF'
  } = parameters;
  
  // Рассчитываем общие размеры
  const totalWidth = columns * (symbolWidth + horizontalPadding) - horizontalPadding;
  const totalHeight = rows * (symbolHeight + verticalPadding) - verticalPadding;

  return (
    <Box
      sx={{
        width: totalWidth,
        height: totalHeight,
        backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box 
          key={`row-${rowIndex}`}
          sx={{
            display: 'flex',
            height: symbolHeight,
            marginBottom: rowIndex < rows - 1 ? `${verticalPadding}px` : 0
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Box
              key={`cell-${rowIndex}-${colIndex}`}
              sx={{
                width: symbolWidth,
                height: symbolHeight,
                marginRight: colIndex < columns - 1 ? `${horizontalPadding}px` : 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Typography
                sx={{
                  color: hiddenPosition?.row === rowIndex + 1 && hiddenPosition?.col === colIndex + 1 ? 'transparent' : symbolColor,
                  fontFamily: symbolFont,
                  fontSize: `${symbolWidth * 0.8}px`, // Примерное соотношение
                  lineHeight: 1,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  overflow: 'hidden'
                }}
              >
                {symbolType}
              </Typography>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default StimulusPreview;