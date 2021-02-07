import {Box, TextareaAutosize, Typography} from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div>
      {value === index && (
        <Paper style={{height: 160, overflow: 'auto'}}>
          <Typography>{children}</Typography>
        </Paper>
      )}
    </div>
  );
}

const useStyles = makeStyles({
  Tabs: {
    alignItems: 'center',
    height: 30,
    minHeight: 30,
  },
  Tab: {
    fontSize: 10,
    fontWeight: 'bolder',
    width: 150,
    minWidth: 150,
    backgroundColor: 'white',
  },
});

export default function Console({testCodeResult}){
  const classes = useStyles();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return(
    <>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          indicatorColor='primary'
          textColor='primary'
          className={classes.Tabs}
          onChange={handleChange}
          aria-label="tabs example"
          style={{width: 780}}
        >
          <Tab className={classes.Tab}  label="Run Code Result" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {testCodeResult}
      </TabPanel>
    </>
  );
}
