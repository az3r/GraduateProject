import React from 'react';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Avatar from '@material-ui/core/Avatar';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div>
      {value === index && (
        <Paper style={{maxHeight: 1000, height: 510, overflow: 'auto'}}>
          <div>
            {children}
          </div>
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
  difficultyBox: {
    color: 'white',
  },
  scoreBox: {
    display: 'flex',
    fontSize: 18,
  },
  scoreAvatar: {
    height: 25,
    width: 25,
  },
  subTitle: {
    display: 'flex',
    justifyContent: 'space-between',
  }
});

const editorConfiguration = {
  toolbar: [ ],
};

export default function Problem(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  // console.log(props);

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
          <Tab className={classes.Tab} label="Description" />
          <Tab className={classes.Tab} label="Discuss" />
          <Tab className={classes.Tab} label="Submissions" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Typography>{props.title}</Typography>

        <div className={classes.subTitle}>
          <Box component="span" display="inline" p={'4px'} borderRadius={16} className={classes.difficultyBox}
               bgcolor={props.difficulty == 0 ? "green" : props.difficulty == 1 ? "orange" : "red"}>
            {
              props.difficulty == 0 ? "Easy" : props.difficulty == 1 ? "Medium" : "Hard"
            }
          </Box>

          <Box className={classes.scoreBox}>
            <Box>
              Score: {props.score}
            </Box>
            <Avatar className={classes.scoreAvatar} alt="Score" src={'/coins_48px.png'} />
          </Box>
        </div>
        <hr />
        <CKEditor
          editor={ ClassicEditor }
          disabled={true}
          config={ editorConfiguration }
          data={props.content} />
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
