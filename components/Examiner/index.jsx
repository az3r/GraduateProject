import { Box, Grid } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import { FirebaseAuth } from '@libs/client/firebase';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
  background: {
    backgroundColor: "#ffffff",
  }
});

export default function Examiner({children}) {
  const router = useRouter();
  const classes = useStyles();

  const goToExaminerPage = () => {
    router.replace('/examiner')
  }

  const goToProblemsPage = () => {
    const {uid} = FirebaseAuth().currentUser;
    router.replace(`/examiner/problems?user=${uid}`);
  }

  const goToExaminationsPage = () => {
    const {uid} = FirebaseAuth().currentUser;

    router.replace(`/examiner/examinations?user=${uid}`);
  }

  return (
    <Box p={3}>
      <Grid container>
        <Grid item lg={3}>
          <Paper className={classes.root}>
            <MenuList>
            <MenuItem>
                <ListItemIcon>
                  <HistoryOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <Typography onClick={goToExaminerPage}>History</Typography>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <PriorityHighIcon fontSize="small" />
                </ListItemIcon>
                <Typography onClick={goToProblemsPage}>Problems</Typography>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <AssignmentOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <Typography onClick={goToExaminationsPage}>Examinations</Typography>
              </MenuItem>
            </MenuList>
          </Paper>
        </Grid>
        <Grid item lg={9} className={classes.background}>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
}
