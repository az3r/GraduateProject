import { Box, Breadcrumbs, Divider, makeStyles, Typography } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';

const useStyles = makeStyles({
  linkStyle: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
});

export default function GroupGeneral({ company }) {

  const classes = useStyles();

  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/company-groups">
          <Typography className={classes.linkStyle}>Company groups</Typography>
        </Link>
        <Typography color="textPrimary">Current group</Typography>

        <Typography color="textPrimary">General</Typography>
      </Breadcrumbs>
      <br/>
      <Divider />
      <br/>
      <Box m={3}>
        <Box m={1} display="flex" justifyContent="center">
          <Typography variant="h4">{company.name}</Typography>
        </Box>
        <Box m={1} display="flex" justifyContent="center">
          <Typography>{company.email}</Typography>
        </Box>
        {/* <Box m={1}>
        <PieChart width={730} height={250}>
        <Pie data={data01} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
        <Pie data={data02} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" label />
        </PieChart>
        </Box> */}
      </Box>
    </Box>
  );
}
