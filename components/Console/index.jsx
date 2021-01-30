import {Box, TextareaAutosize, Typography} from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    textarea: {
        width: '100%',
    },
});

export default function Console(props){
    const classes = useStyles();

    return(
        <>
            <Box boxShadow={1} p={2} m={3}>
                <Typography variant={"h6"}>Console: </Typography>
                <TextareaAutosize aria-label="minimum height" className={classes.textarea} rowsMin={8} placeholder="No error!"  />
            </Box>
        </>
    );
}