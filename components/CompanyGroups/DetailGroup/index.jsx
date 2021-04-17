import { Box, Grid } from '@material-ui/core';
import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import InfoIcon from '@material-ui/icons/Info';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import GroupIcon from '@material-ui/icons/Group';
import { useRouter } from 'next/router';


const useStyles = makeStyles({
    root: {
      width: 300,
    },
    background: {
      backgroundColor: "#ffffff",
    }
  });

  
export default function DetailGroup({children})
{
    const router = useRouter();

    const classes = useStyles();

    const goToIndexPage = () => {
        router.replace('/company-groups/1');
    }

    const goToMembersPage = () => {
        router.replace('/company-groups/1/members')
    }

    const goToQuestionsBankPage = () => {
        router.replace('/company-groups/1/questions-bank')
    }

    const goToProblemsPage = () => {
        router.replace('/company-groups/1/problems');
    }

    const goToExaminationsPage = () => {
        router.replace('/company-groups/1/examinations');
    }
    return(
        <Box p={3}>
            <Grid container>
            <Grid item lg={3}>
                <Paper className={classes.root}>
                <MenuList>
                <MenuItem onClick={goToIndexPage}>
                        <ListItemIcon>
                            <InfoIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography>General</Typography>
                    </MenuItem>
                    <MenuItem onClick={goToMembersPage}>
                        <ListItemIcon>
                            <GroupIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography>Group Members</Typography>
                    </MenuItem>
                    <MenuItem onClick={goToQuestionsBankPage}>
                        <ListItemIcon>
                            <AccountBalanceIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography>Questions Bank</Typography>
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