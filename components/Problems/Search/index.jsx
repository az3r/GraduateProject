import React from 'react';
import {
  makeStyles,
  FormControl,
  MenuItem,
  Select,
  OutlinedInput
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  outlinedInput: {
    height: 30,
    margin: 20,
    width: 350,
    borderRadius: 16,
  },
  select: {
    margin: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
}));

export default function Search({search, handleSearchChange, handleSearchKeyPress, difficulty, handleDifficultyChange, language, handleLanguageChange}) {
  const classes = useStyles();

  return (
    <div>
      <FormControl>
        <OutlinedInput value={search} onChange={handleSearchChange} onKeyPress={handleSearchKeyPress}  className={classes.outlinedInput} placeholder={'Search...'} />
      </FormControl>

      <FormControl>
        <Select
          value={difficulty}
          displayEmpty
          className={classes.select}
          onChange={handleDifficultyChange}
        >
          <MenuItem value={'all'}>All Difficulty</MenuItem>
          <MenuItem value={'easy'}>Easy</MenuItem>
          <MenuItem value={'medium'}>Medium</MenuItem>
          <MenuItem value={'hard'}>Hard</MenuItem>
        </Select>
      </FormControl>

      <FormControl>
        <Select
          value={language}
          displayEmpty
          className={classes.select}
          onChange={handleLanguageChange}
        >
          <MenuItem value={'all'}>All Language</MenuItem>
          <MenuItem value={'csharp'}>C#</MenuItem>
          <MenuItem value={'java'}>Java</MenuItem>
          <MenuItem value={'javascript'}>Javascript</MenuItem>
          <MenuItem value={'c'}>C</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}
