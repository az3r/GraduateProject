import React from 'react'
import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles({
    sideMenu: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: '320px',
        height: '100% !important',
        backgroundColor: '#088247',
        overflow: 'hidden'
    }
})

export default function SideMenu(){

    const classes = useStyles()
    return(
        <div className={ classes.sideMenu}>
            side here
        </div>
    )
}