import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import { FormControl, MenuItem, Select } from '@material-ui/core';
import OutlinedInput from '@material-ui/core/OutlinedInput';

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

export default function Search() {
  const classes = useStyles();

  const [difficulty, setDifficulty] = React.useState('easy');
  const [domain, setDomain] = React.useState('csharp');

  return (
    <div>
      <FormControl>
        <OutlinedInput
          className={classes.outlinedInput}
          placeholder={'Search...'}
        />
      </FormControl>

      <FormControl>
        <Select
          value={difficulty}
          displayEmpty
          className={classes.select}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <MenuItem value={'easy'}>Easy</MenuItem>
          <MenuItem value={'medium'}>Medium</MenuItem>
          <MenuItem value={'hard'}>Hard</MenuItem>
        </Select>
      </FormControl>

      <FormControl>
        <Select
          value={domain}
          displayEmpty
          className={classes.select}
          onChange={(e) => setDomain(e.target.value)}
        >
          <MenuItem value={'csharp'}>C#</MenuItem>
          <MenuItem value={'java'}>Java</MenuItem>
          <MenuItem value={'javascript'}>Javascript</MenuItem>
          <MenuItem value={'c'}>C</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
