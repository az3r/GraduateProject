import React from 'react';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import makeStyles from "@material-ui/core/styles/makeStyles";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div>
      {value === index && (
        // <Box p={3}>
        //   <Typography>{children}</Typography>
        // </Box>
        <Paper style={{maxHeight: 1000, height: 510, overflow: 'auto'}}>
          <Typography>{children}</Typography>
        </Paper>
      )}
    </div>
  );
}


const useStyles = makeStyles({
  Tabs: {
    alignItems: 'center',
    height: 40,
    minHeight: 40,
  },
  Tab: {
    fontSize: 10,
    fontWeight: 'bolder',
    width: 100,
    minWidth: 100,
  },
});


export default function Problem() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper square>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          indicatorColor='primary'
          textColor='primary'
          className={classes.Tabs}
          onChange={handleChange}
          aria-label="tabs example"
        >
          <Tab className={classes.Tab}  label="Description" />
          <Tab className={classes.Tab} label="Discuss" />
          <Tab className={classes.Tab} label="Submissions" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Paper>
  );
}
