import React from 'react';
import {
  makeStyles,
  Paper,
  Box,
  Avatar
} from '@material-ui/core';

import {
  Tab,
  Tabs,
  TabList,
  TabPanel
} from 'react-tabs';

import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'react-tabs/style/react-tabs.css';



const useStyles = makeStyles({
  title: {
    marginTop: 0,
    marginLeft: 15,
    marginBottom: 5,
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
  problemInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: 15,
  }
});

const editorConfiguration = {
  toolbar: [ ],
};

export default function Problem(props) {
  const classes = useStyles();

  return (
    <Tabs>
      <TabList>
        <Tab>Description</Tab>
        <Tab>Discuss</Tab>
        <Tab>Submissions</Tab>
      </TabList>

      <TabPanel>
        <Paper style={{maxHeight: 1000, height: 510, overflow: 'auto'}}>
          <h2 className={classes.title}>{props.title}</h2>
          <div className={classes.problemInfo}>
            <Box component="span" display="inline" p={'4px'} borderRadius={16} className={classes.difficultyBox}
                 bgcolor={props.difficulty === 0 ? "green" : props.difficulty == 1 ? "orange" : "red"}>
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
          <CKEditor
            editor={ ClassicEditor }
            disabled={true}
            config={ editorConfiguration }
            data={props.content} />
        </Paper>
      </TabPanel>
      <TabPanel>
        <h2>Any content 2</h2>
      </TabPanel>
      <TabPanel>
        <h2>Any content 3</h2>
      </TabPanel>
    </Tabs>
  );
}
