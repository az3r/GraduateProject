import { Box, makeStyles } from '@material-ui/core';
import React from 'react';


const useStyles = makeStyles({
    footer: {
       borderTop: '1px solid rgba(0, 0, 0, 0.12)',
       marginTop: "10px",
       backgroundColor: '#088247',
       color: '#ffffff'
    }
})

export default function Footer(){
    const classes = useStyles();
    return(
        <div className={classes.footer}>
            <Box m={3} p={2}>
                This is footer
            </Box>
        </div>
    );
}