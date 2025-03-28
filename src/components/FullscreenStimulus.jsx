import React from 'react';
import { Box, Typography } from '@mui/material';

const FullscreenStimulus = ({ parameters, hiddenPosition }) => {
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
    backgroundColor
  } = parameters;
  
  // Рассчитываем общие размеры
  const totalWidth = columns * (symbolWidth + horizontalPadding) - horizontalPadding;
  const totalHeight = rows * (symbolHeight + verticalPadding) - verticalPadding;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
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
                  alignItems: 'center',
                  backgroundColor: 
                    hiddenPosition?.row === rowIndex && 
                    hiddenPosition?.col === colIndex 
                      ? backgroundColor 
                      : 'transparent'
                }}
              >
                <Typography
                  sx={{
                    color: 
                      hiddenPosition?.row === rowIndex && 
                      hiddenPosition?.col === colIndex 
                        ? 'transparent' 
                        : symbolColor,
                    fontFamily: symbolFont,
                    fontSize: `${symbolWidth * 0.8}px`,
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
    </Box>
  );
};

export default FullscreenStimulus;