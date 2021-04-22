import React from 'react';
import {
  makeStyles,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody, Typography,
} from '@material-ui/core';
import dateFormat from 'dateformat';
import Link from 'next/link';


const useStyles = makeStyles(() => ({
  link: {
    color: 'green',
    cursor: 'pointer',
  },
}));

export default function Submissions({problemSubmissions}){
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
              <TableCell />
            </TableRow>
          </TableHead>
          {
            problemSubmissions &&
            <TableBody>
              {
                problemSubmissions.map((submission, index) => (
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
                      {submission.score}
                    </TableCell>
                    <TableCell>
                      <Link href={`/problem/submissiondetail/${submission.id}`}>
                        <Typography className={classes.link}>
                          View Results
                        </Typography>
                      </Link>
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
