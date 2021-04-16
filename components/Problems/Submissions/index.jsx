import React from 'react';
import {
  makeStyles,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import dateFormat from 'dateformat';


const useStyles = makeStyles(() => ({

}));

export default function Submissions({problemSubmissionHistories}){
  const classes = useStyles();

  return (
    <>
      <Paper style={{paddingLeft: 20, paddingRight: 20}}>
        <Table size="large" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Time Submitted</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Runtime</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          {
            problemSubmissionHistories &&
            <TableBody>
              {
                problemSubmissionHistories.map((submission, index) => (
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
                        submission.status === 'Compilation Error' && <p style={{color: 'red', fontWeight: 'bolder'}}>{submission.status}</p>
                      }
                    </TableCell>
                    <TableCell>120 ms</TableCell>
                    <TableCell>
                      {
                        submission.status === 'Accepted' && 0
                      }
                      {
                        submission.status === 'Wrong Answer' && 0
                      }
                      {
                        submission.status === 'Compilation Error' && 0
                      }
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          }
        </Table>
      </Paper>
    </>
  )
}
