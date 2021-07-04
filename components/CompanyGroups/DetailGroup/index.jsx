import { Grid } from '@material-ui/core';
import React from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import GroupIcon from '@material-ui/icons/Group';
import { useRouter } from 'next/router';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#38424E',
    minHeight: '100%',
    position: 'fixed',
    top: 0,
    zIndex: 0,
    paddingTop: 64,
    width: 200
  },
  background: {
    backgroundColor: '#ffffff',
  },
  fontColor: {
    color: '#ffffff',
  },
  spaceMenu: {
    marginBottom: '15px',
    zIndex: 1,
  },
  selected: {
    color: '#1AC573',
    fontWeight: 'bold',
  },
  infoBackground: {
    minHeight: '100vh',
  },
});

export default function DetailGroup({ selected, children, isDev }) {
  const router = useRouter();
  const { id } = router.query;

  const classes = useStyles();

  const goToIndexPage = () => {
    router.replace(`/company-groups/${id}`);
  };

  const goToMembersPage = () => {
    router.replace(`/company-groups/${id}/members`);
  };

  const goToGroupsPage = () => {
    router.replace(`/company-groups/${id}/groups`);
  };

  const goToQuestionsBankPage = () => {
    router.replace(`/company-groups/${id}/questions-bank`);
  };

  const goToExaminationsPage = () => {
    router.replace(`/company-groups/${id}/examinations`);
  };
  return (
    <Grid container>
      <Grid item lg={2} md={2} sm={2} xs={2}>
        <div className={classes.root}>
          <MenuList>
            {!isDev ? (
              <MenuItem onClick={goToIndexPage} className={classes.spaceMenu}>
                <ListItemIcon>
                  <InfoIcon
                    fontSize="small"
                    className={clsx({
                      [classes.fontColor]: selected !== 1,
                      [classes.selected]: selected === 1,
                    })}
                  />
                </ListItemIcon>
                <Typography
                  className={clsx({
                    [classes.fontColor]: selected !== 1,
                    [classes.selected]: selected === 1,
                  })}
                >
                  General
                </Typography>
              </MenuItem>
            ) : null}
            {!isDev ? (
              <MenuItem onClick={goToMembersPage} className={classes.spaceMenu}>
                <ListItemIcon>
                  <GroupIcon
                    fontSize="small"
                    className={clsx({
                      [classes.fontColor]: selected !== 2,
                      [classes.selected]: selected === 2,
                    })}
                  />
                </ListItemIcon>
                <Typography
                  className={clsx({
                    [classes.fontColor]: selected !== 2,
                    [classes.selected]: selected === 2,
                  })}
                >
                  Contributors
                </Typography>
              </MenuItem>
            ) : null}
            <MenuItem onClick={goToGroupsPage} className={classes.spaceMenu}>
              <ListItemIcon>
                <GroupWorkIcon
                  fontSize="small"
                  className={clsx({
                    [classes.fontColor]: selected !== 5,
                    [classes.selected]: selected === 5,
                  })}
                />
              </ListItemIcon>
              <Typography
                className={clsx({
                  [classes.fontColor]: selected !== 5,
                  [classes.selected]: selected === 5,
                })}
              >
                Groups
              </Typography>
            </MenuItem>
            {!isDev ? (
              <MenuItem
                onClick={goToQuestionsBankPage}
                className={classes.spaceMenu}
              >
                <ListItemIcon>
                  <AccountBalanceIcon
                    fontSize="small"
                    className={clsx({
                      [classes.fontColor]: selected !== 3,
                      [classes.selected]: selected === 3,
                    })}
                  />
                </ListItemIcon>
                <Typography
                  className={clsx({
                    [classes.fontColor]: selected !== 3,
                    [classes.selected]: selected === 3,
                  })}
                >
                  Questions Bank
                </Typography>
              </MenuItem>
            ) : null}
            {!isDev ? (
              <MenuItem
                onClick={goToExaminationsPage}
                className={classes.spaceMenu}
              >
                <ListItemIcon>
                  <AssignmentOutlinedIcon
                    fontSize="small"
                    className={clsx({
                      [classes.fontColor]: selected !== 4,
                      [classes.selected]: selected === 4,
                    })}
                  />
                </ListItemIcon>
                <Typography
                  className={clsx({
                    [classes.fontColor]: selected !== 4,
                    [classes.selected]: selected === 4,
                  })}
                >
                  Examinations
                </Typography>
              </MenuItem>
            ) : null}
          </MenuList>
        </div>
      </Grid>
      <Grid
        item
        lg={10}
        md={10}
        sm={10}
        xs={10}
        className={classes.infoBackground}
      >
        {children}
      </Grid>
    </Grid>
  );
}
