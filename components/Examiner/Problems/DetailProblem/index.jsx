import { AppBar, Box, Breadcrumbs, Link, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import React from 'react';
import DetailTab from './DetailTab';
import ParticipantsTab from './ParticipantsTab';


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    tabsStyle:{
        backgroundColor: "#ffffff",
        color: "#000000"
    }
  }));

export default function DetailProblem({problem}){
    const [value, setValue] = React.useState(0);
    const classes = useStyles();
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    
    return(
        <Box m={1}>
            <Box p={2}>
                <Breadcrumbs>
                    <Link color="inherit" href="/examiner">
                        Examiner
                    </Link>
                    <Link color="inherit"  href="/examiner/problems">
                        Problems
                    </Link>
                    <Typography color="textPrimary">Detail</Typography>
                </Breadcrumbs>
            </Box>
            <Box display="float" p={2}>
                <div className={classes.root}>
                    <AppBar position="static">
                        <Tabs className={classes.tabsStyle} value={value} onChange={handleChange} centered aria-label="simple tabs example">
                            <Tab label="Detail" {...a11yProps(0)} />
                            <Tab label="Participants" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                        <DetailTab problem={problem}/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <ParticipantsTab problem={problem}/>
                    </TabPanel>
                </div>
            </Box>
        </Box>
    )
}

function TabPanel( { children, value, index, ...other }) {  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }