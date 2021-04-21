import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Box, Breadcrumbs, Divider, Grid, Typography } from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import EditExamination from './EditExamination';

const useStyles = makeStyles({
  textFail: {
    color: '#F74B4D',
  },
  displayScrollSpy: {
      position: "fixed",
      marginRight: "10px",
      marginLeft: "10px"
  },
  isCurrent: {
      fontWeight: 'bold',
      "& :nth-child(1)": {
          color: "#088247",
          fontSize: "14px"
        }
  },
  contentScrollSpy: {
      color: "#000000",
      fontSize: "13px",
      wordWrap: "break-word",
      textDecoration: 'none'
  },
  listContentStyle : {
      listStyle: "none",
      paddingLeft: 15
  },
  listItem: {
      marginBottom: "10px"
  },
});

export default function AddExamination() {
  const classes = useStyles();
  const router = useRouter();
  const {id} = router.query;
  return (
    <Box m={3}>
      <Grid container>
        <Grid item lg={10} md={10}>
          <Breadcrumbs>
            <Link color="inherit" href="/company-groups">
                Company groups
            </Link>
            <Link color="inherit" href={`/company-groups/${id}`}>
                Current group
            </Link>
            <Link color="inherit" href={`/company-groups/${id}/examinations`}>
                Examinations
            </Link>
            <Typography color="textPrimary">Add</Typography>
          </Breadcrumbs>
          <Divider/>
          <EditExamination examProp={null}/>
        </Grid>
        <Grid item lg={2} md={2}>
          <div className={classes.displayScrollSpy}>
              <Typography variant="h6">Content:</Typography>
              <div className={classes.listContentStyle}>
                  <li className={classes.listItem}><a href="#section-20" className={classes.contentScrollSpy}>Enter title</a></li>
                  <li className={classes.listItem}><a href="#section-21" className={classes.contentScrollSpy}>Enter content</a></li>
                  <li className={classes.listItem}><a href="#section-22" className={classes.contentScrollSpy}>Enter password</a></li>
                  <li className={classes.listItem}><a href="#section-23" className={classes.contentScrollSpy}>Enter duration</a></li>
                  <li className={classes.listItem}><a href="#section-24" className={classes.contentScrollSpy}>Add questions</a></li>
              </div>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}