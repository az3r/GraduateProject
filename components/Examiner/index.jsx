import { Box, Grid } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
  background: {
    backgroundColor: "#ffffff",
  }
});

export default function Examiner({user,children}) {
  const router = useRouter();
  const classes = useStyles();

  useEffect(() => {
    if(Object.keys(user).length === 0)
    {
      router.replace('/login');
    }
  },[]);

  const goToExaminerPage = () => {
    router.replace('/examiner')
  }

  const goToProblemsPage = () => {
    router.replace('/examiner/problems');
  }

  const goToExaminationsPage = () => {
    router.replace('/examiner/examinations');
  }

  return (
    <Box p={3}>
      <Grid container>
        <Grid item lg={3}>
          <Paper className={classes.root}>
            <MenuList>
            <MenuItem onClick={goToExaminerPage}>
                <ListItemIcon>
                  <HistoryOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <Typography>History</Typography>
              </MenuItem>
              <MenuItem onClick={goToProblemsPage}>
                <ListItemIcon>
                  <PriorityHighIcon fontSize="small" />
                </ListItemIcon>
                <Typography>Problems</Typography>
              </MenuItem>
              <MenuItem onClick={goToExaminationsPage}>
                <ListItemIcon>
                  <AssignmentOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <Typography>Examinations</Typography>
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
