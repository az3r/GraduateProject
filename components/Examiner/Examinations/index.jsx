import React from 'react';
import { 
    Box, 
    Breadcrumbs, 
    Button, 
    Link,
    OutlinedInput,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import dateFormat from 'dateformat';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
  outlinedInput: {
    height: 30,
    margin: 20,
    width: 350,
    borderRadius: 16,
  },
  addBtn:{
      float: "right",
      marginBottom: "10px"
  },
  itemsContainer:{
      clear: "right",
      
  },
  createdDate:{
    color: "black",
  },
});

export default function ExaminationsPage({exams}) {
  const classes = useStyles();

  return (
    <>
        <Box p={2}>
            <Breadcrumbs>
                <Link color="inherit" href="/examiner">
                    Examiner
                </Link>
                <Typography color="textPrimary">Examinations</Typography>
            </Breadcrumbs>
        </Box>
        <Box display="flex" justifyContent="center">
            <OutlinedInput
                className={classes.outlinedInput}
                placeholder="Search..."
            />
        </Box>
        <Link href="/examiner/examinations/add">
          <Button className={classes.addBtn} variant="contained" color="secondary" startIcon={<AddIcon/>}>Add examination</Button>
        </Link>
        <Box className={classes.itemsContainer} boxShadow={1} p={2}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bolder' }}>Problems</TableCell>
                <TableCell style={{ fontWeight: 'bolder' }}>#</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={classes.tableRow}
                  hover
                  style={
                    index % 2
                      ? { background: 'rgb(250, 250, 250)' }
                      : { background: 'white' }
                  }
                >
                  <TableCell component="th" scope="row">
                    <Link href={`/examiner/problems/${item.id}`} underline="none">
                      <Box>
                        <Box className={classes.title}>{item.title}</Box>
                        <Box className={classes.createdDate}>
                          Created on:&nbsp;
                          {dateFormat(
                            new Date(item.createdOn),
                            'mmmm dd, yyyy "at" HH:MM TT'
                          )}
                        </Box>
                      </Box>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="primary" href={`/examiner/examinations/detail?id=${item.id}`}>Detail</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
    </>
  );
}
