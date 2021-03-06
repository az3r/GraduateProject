import React from 'react';
import { 
    Box, 
    Breadcrumbs, 
    Button, 
    Link,
    OutlinedInput,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

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
      
  }
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
          {
              exams.map((item) => (
                <Typography>{item.title}</Typography>
              ))
            }
        </Box>
    </>
  );
}
