import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

// Расширенный набор символов с дополнительными группами
const symbolGroups = [
  {
    name: "Латинские буквы",
    symbols: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  },
  {
    name: "Цифры",
    symbols: '0123456789'.split('')
  },
  {
    name: "Математические",
    symbols: '+-×÷=≠≈<>≤≥()[]{}%‰°′″∞√∫∑∏∂∇¬∧∨∩∪∈∉⊂⊃⊆⊇∠∡∢∥∦'.split('')
  },
  {
    name: "Геометрические",
    symbols: '■□▢▣▤▥▦▧▨▩▪▫▬▭▮▯▲△▴▵▶▷▸▹►▻▼▽▾▿◀◁◂◃◄◅◆◇◈◉◊○◌◍◎●◐◑◒◓◔◕◖◗◘◙◚◛◜◝◞◟◠◡◢◣◤◥◦◧◨◩◪◫◬◭◮◯'.split('')
  },
  {
    name: "Специальные",
    symbols: '!@#$%^&*?~`|\\/.,:;"\'_'.split('')
  },
  {
    name: "Стрелки",
    symbols: '←↑→↓↔↕↖↗↘↙↚↛↜↝↞↟↠↡↢↣↤↥↦↧↨↩↪↫↬↭↮↯↰↱↲↳↴↵↶↷↸↹↺↻↼↽↾↿⇀⇁⇂⇃⇄⇅⇆⇇⇈⇉⇊⇋⇌⇍⇎⇏⇐⇑⇒⇓⇔⇕⇖⇗⇘⇙⇚⇛⇜⇝⇞⇟⇠⇡⇢⇣⇤⇥⇦⇧⇨⇩⇪'.split('')
  },
  {
    name: "Денежные",
    symbols: '₽$€¥¢£₤₳₴₵₲₪₮₯₰₱₲₳₴₵₶₷₸₹₺₻₼₽₾'.split('')
  },
  {
    name: "Шахматы",
    symbols: '♔♕♖♗♘♙♚♛♜♝♞♟'.split('')
  },
  {
    name: "Карты",
    symbols: '♠♣♥♦♤♧♢♡'.split('')
  },
  {
    name: "Ноты",
    symbols: '♩♪♫♬♭♮♯'.split('')
  },
  {
    name: "Погода",
    symbols: '☀☁☂☃☄☔☇☈☉☊☋☌☍☎☏☐☑☒☓☖☗☘☙☚☛☜☝☞☟☠☡☢☣☤☥☦☧☨☩☪☫☬☭☮☯☸☹☺☻☼☽☾☿♀♁♂♃♄♅♆♇'.split('')
  }
];

const allSymbols = symbolGroups.flatMap(group => 
  group.symbols.map(char => ({
    char,
    group: group.name
  }))
);

const AsciiSymbolSelect = ({ value, onChange }) => {
  return (
    <Autocomplete
      fullWidth
      size='small'
      options={allSymbols}
      groupBy={(option) => option.group}
      value={allSymbols.find(s => s.char === value) || null}
      onChange={(event, newValue) => {
        onChange(newValue?.char || 'X');
      }}
      getOptionLabel={(option) => option.char}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Символ"
          variant="outlined"
          fullWidth
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <span style={{ 
            fontFamily: 'monospace', 
            fontSize: '1rem', 
            width: '40px',
            display: 'inline-block',
            textAlign: 'center',
            lineHeight: '1.2'
          }}>
            {option.char}
          </span>
        </li>
      )}
      sx={{
        '& .MuiAutocomplete-groupLabel': {
          fontSize: '0.85rem',
          fontWeight: 500,
          backgroundColor: '#f5f5f5',
          paddingLeft: '12px'
        }
      }}
    />
  );
};

export default AsciiSymbolSelect;