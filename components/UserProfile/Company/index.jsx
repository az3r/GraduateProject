/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import {
  makeStyles,
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
} from '@material-ui/core';
import BasicInfoTab from '@components/UserProfile/Company/BasicInfoTab';
import AccountTab from '@components/UserProfile/Components/AccountTab';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function UserProfileTabs(props) {
  const classes = useStyles();
  const { user, setUser, setSnackBarState, isOnlyWatch } = props;

  // tab values
  const [value, setValue] = React.useState(0);
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChangeTab}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab label="About" {...a11yProps(0)} />

          {isOnlyWatch ? null : <Tab label="Account" {...a11yProps(1)} />}
        </Tabs>
      </Grid>

      <Grid item xs={9}>
        <TabPanel value={value} index={0}>
          <BasicInfoTab
            user={user}
            setUser={setUser}
            setSnackBarState={setSnackBarState}
            isOnlyWatch={isOnlyWatch}
          />
        </TabPanel>

        {isOnlyWatch ? null : (
          <TabPanel value={value} index={1}>
            <AccountTab
              user={user}
              setUser={setUser}
              setSnackBarState={setSnackBarState}
            />
          </TabPanel>
        )}
      </Grid>
    </Grid>
  );
}
