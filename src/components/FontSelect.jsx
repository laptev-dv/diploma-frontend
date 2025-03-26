import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

// Кэшируем шрифты в localStorage
const CACHE_KEY = 'google-fonts-cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 часа

const loadFont = (fontFamily) => {
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

const FontSelect = ({ value, onChange }) => {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        // Проверяем кэш
        const cached = localStorage.getItem(CACHE_KEY);
        const cachedData = cached ? JSON.parse(cached) : null;
        
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRY) {
          setFonts(cachedData.fonts);
          setLoading(false);
          return;
        }

        // Получаем список шрифтов из Google Fonts API
        const response = await axios.get(
          'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDgJzM14xNhFsgMoPqMcw14eSmfoIfgPd0&sort=popularity'
        );
        
        const popularFonts = response.data.items
          .filter(font => font.subsets.includes('cyrillic')) // Фильтруем шрифты с поддержкой кириллицы
          .map(font => font.family);
        
        // Сохраняем в кэш
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          fonts: popularFonts,
          timestamp: Date.now()
        }));
        
        setFonts(popularFonts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching fonts:', error);
        // Если API не работает, пробуем взять из кэша, даже если просрочен
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          setFonts(JSON.parse(cached).fonts);
        }
        setLoading(false);
      }
    };

    fetchFonts();
  }, []);

  // Загружаем выбранный шрифт
  useEffect(() => {
    if (value) {
      loadFont(value);
    }
  }, [value]);

  return (
    <Autocomplete
      options={fonts}
      value={value}
      onChange={(event, newValue) => {
        if (newValue) {
          loadFont(newValue);
          onChange(newValue);
        }
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Шрифт символа"
          variant='outlined'
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box 
          component="li" 
          {...props}
          sx={{ fontFamily: option }}
        >
          {option}
        </Box>
      )}
    />
  );
};

export default FontSelect;