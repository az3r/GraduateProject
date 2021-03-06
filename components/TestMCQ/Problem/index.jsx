import React from 'react';

import {
  makeStyles,
  Avatar,
  Box,
  Paper
}from "@material-ui/core";


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

export default function Problem({question, difficulty, score}) {
  const classes = useStyles();


  return (
    <Tabs>
      <TabList>
        <Tab>Description</Tab>
      </TabList>

      <TabPanel>
        <Paper style={{maxHeight: 1000, height: 510, overflow: 'auto'}}>
          <h2 className={classes.title}>MCQ</h2>
          <div className={classes.problemInfo}>
            {difficulty === 0 &&
              <Box component="span" display="inline" p="4px" borderRadius={16} className={classes.difficultyBox}
                   bgcolor="green">
                Easy
              </Box>
            }

            {difficulty === 1 &&
              <Box component="span" display="inline" p="4px" borderRadius={16} className={classes.difficultyBox}
                   bgcolor="orange">
                Medium
              </Box>
            }
            {difficulty === 2 &&
              <Box component="span" display="inline" p="4px" borderRadius={16} className={classes.difficultyBox}
                   bgcolor="red">
                Hard
              </Box>
            }


            {/* <Box component="span" display="inline" p={'4px'} borderRadius={16} className={classes.difficultyBox} */}
            {/*     bgcolor={difficulty === 0 ? "green" : difficulty === 1 ? "orange" : "red"}> */}
            {/*  { */}
            {/*    difficulty === 0 ? "Easy" : difficulty === 1 ? "Medium" : "Hard" */}
            {/*  } */}
            {/* </Box> */}

            <Box className={classes.scoreBox}>
              <Box>
                Score: {score}
              </Box>
              <Avatar className={classes.scoreAvatar} alt="Score" src="/coins_48px.png" />
            </Box>
          </div>
          <CKEditor
            editor={ ClassicEditor }
            disabled
            config={ editorConfiguration }
            data={question} />
        </Paper>
      </TabPanel>
    </Tabs>
  );
}
