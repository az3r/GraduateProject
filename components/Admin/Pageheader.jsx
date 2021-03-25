import React from 'react'
import {IconButton,Typography, Paper, Card,makeStyles} from '@material-ui/core'
import SupervisorAccountSharpIcon from '@material-ui/icons/SupervisorAccountSharp';


const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#fdfdff'
    },
    pageHeader: {
        padding: theme.spacing(4),
        display: 'flex',
        marginBottom: theme.spacing(4)
    },
    pageIcon: {
        display: 'inline-block',
        padding: theme.spacing(2),
        color: '#3c44b1'
    },
    pageTitle: {
        paddingLeft: theme.spacing(2),
        '& .MuiTypography-subtitle2': {
            opacity: '0.6'
        }
    }

}))

export default function PageHeader(){

    const classes = useStyles()

    return(
        <Paper elevation={0} square className={classes.root}>
            <div className={classes.pageHeader}>
                <Card>
                    <IconButton className={classes.pageIcon}>
                        <SupervisorAccountSharpIcon fontSize='large'/>
                    </IconButton>
                </Card>
                <div className={classes.pageTitle}>
                    <Typography variant='h6' component='div'>
                        Developer
                    </Typography>
                    <Typography variant='subtitle2' component='div'>
                        Management developer account
                    </Typography>
                </div>
            </div>
        </Paper>
    );
}