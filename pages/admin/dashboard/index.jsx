import { CssBaseline, makeStyles} from '@material-ui/core'
import Header from '@components/Admin/Header'
import SideMenu from '@components/Admin/SideMenu'
import PageHeader from '@components/Admin/Pageheader'
import UserTable from '@components/Admin/UserTable'
import React from 'react'

const useStyles = makeStyles({

    appMain:{
      paddingLeft: '320px',
      width : '100%'
    }
  
  })

export default function Dashboard() {

    const classes = useStyles()
    return (
        <>
          <SideMenu/>
          <div className={classes.appMain}>
            <Header/>
            <PageHeader/>
            <UserTable/>
          </div>
          <CssBaseline/>
        </>
    )
}