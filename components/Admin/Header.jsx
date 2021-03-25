import React from 'react'
import {AppBar, IconButton, Toolbar, Grid, InputBase,makeStyles} from '@material-ui/core'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search'


const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#fff',
        transform: 'translateZ(0)'
    },
    searchInput: {
        display: 'inline block',
        backgroundColor: '#fff',
        opacity: '0.6',
        padding: `0px ${theme.spacing(1)}`,
        fontSize: '0.8rem',
        width: '95%',
        margin: theme.spacing(1),
        '&:hover' : {
            backgroundColor: '#f2f2f2'
        },
        '& .MuiSvgIcon': {
            marginRight: theme.spacing(1)
        }
    },
    button: {
        background: '#049335',
        color: 'white',
        fontSize: '0.8rem',
        padding: theme.spacing(1),
        margin: theme.spacing(1)
    }

}))

export default function Header(){

    const classes = useStyles()

    return(
        <div>
            <AppBar position='static' className={classes.root}>
                <Toolbar>
                    <Grid container>
                        <Grid item>
                            <InputBase
                                className={classes.searchInput}
                                placeholder='search user...'
                                startAdornment={<SearchIcon fontSize='small'/>}
                            />
                        </Grid>
                        <Grid item sm />
                        <Grid item>
                            <IconButton>
                                <AccountCircleIcon/>
                            </IconButton>
                            
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    )
}