import React from 'react';
import {
  makeStyles,
  Paper,
  Box,
  Avatar, TableHead, TableRow, TableCell, TableBody, Table,
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
import dateFormat from 'dateformat';
import Comment from '@components/TestCode/Problem/Comment';



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
  },
  submission: {
    marginLeft: 20,
    marginRight: 20,
  }
});

const editorConfiguration = {
  toolbar: [ ],
};


export default function Problem(props) {
  const classes = useStyles();

  const {id} = props;
  const {title} = props;
  const {difficulty} = props;
  const {content} = props;
  const {score} = props;
  const {problemSubmissionHistory} = props;
  const {language} = props;
  const {user} = props;


  return (
    <Tabs>
      <TabList>
        <Tab>Description</Tab>
        <Tab>Discuss</Tab>
        <Tab>Submissions</Tab>
      </TabList>

      <TabPanel>
        <Paper style={{maxHeight: window.outerHeight, height: window.outerHeight - 181, overflow: 'auto'}}>
          <h2 className={classes.title}>
            {
              title
            }
          </h2>
          <div className={classes.problemInfo}>
            {
              difficulty === 0 &&
              <Box component="span" display="inline" p="4px" borderRadius={16} className={classes.difficultyBox}
                   bgcolor="green">Easy</Box>
            }
            {
              difficulty === 1 &&
              <Box component="span" display="inline" p="4px" borderRadius={16} className={classes.difficultyBox}
                   bgcolor="orange">Medium</Box>
            }
            {
              difficulty === 2 &&
              <Box component="span" display="inline" p="4px" borderRadius={16} className={classes.difficultyBox}
                   bgcolor="red">Hard</Box>
            }

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
            onReady={editor => {
              // You can store the "editor" and use when it is needed.
              // console.log("Editor is ready to use!", editor);
              editor.editing.view.change(writer => {
                writer.setStyle(
                  "border",
                  "0px",
                  editor.editing.view.document.getRoot()
                );
              });
            }}
            data={content} />
        </Paper>
      </TabPanel>
      <TabPanel style={{backgroundColor: 'white'}}>
        <Comment user={user} problemId={id} />
      </TabPanel>
      <TabPanel>
        <Paper className={classes.submission}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Time Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Language</TableCell>
              </TableRow>
            </TableHead>
            {
              problemSubmissionHistory &&
              <TableBody>
                {
                  problemSubmissionHistory.map((submission, index) => (
                    <TableRow
                      key={submission.id}
                      className={classes.tableRow}
                      hover
                      style={
                        index % 2
                          ? { background: 'rgb(250, 250, 250)' }
                          : { background: 'white' }
                      }
                    >
                      <TableCell>
                        {dateFormat(
                          new Date(submission.createdOn),
                          'dd/mm/yyyy HH:MM TT'
                        )}
                      </TableCell>
                      <TableCell>
                        {
                          submission.status === 'Accepted' && <p style={{color: 'green', fontWeight: 'bolder'}}>{submission.status}</p>
                        }
                        {
                          submission.status === 'Wrong Answer' && <p style={{color: 'orange', fontWeight: 'bolder'}}>{submission.status}</p>
                        }
                        {
                          submission.status === 'Compiler Error' && <p style={{color: 'red', fontWeight: 'bolder'}}>{submission.status}</p>
                        }
                      </TableCell>
                      <TableCell>{score}</TableCell>
                      <TableCell>{language}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            }
          </Table>
        </Paper>
      </TabPanel>
    </Tabs>
  );
}
