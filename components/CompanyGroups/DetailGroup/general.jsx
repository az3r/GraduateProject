// import { getMembers } from '@libs/client/companies';
import { Box, Breadcrumbs, Divider, Typography } from '@material-ui/core';
import Link from 'next/link';
import React
// { useEffect, useState } 
from 'react';
// import { Pie, PieChart } from 'recharts';

export default function GroupGeneral({ company }) {
    // const [members,setMembers] = useState([]);
    // useEffect(async ()=> {
    //     const mems = await getMembers(company);
    //     setMembers(mems);
    //     console.log(mems);
    // }, []);

    // const data02 = [
    //     {
    //       "name": "Group A",
    //       "value": 2400
    //     },
    //     {
    //       "name": "Group B",
    //       "value": 4567
    //     },
    //     {
    //       "name": "Group C",
    //       "value": 1398
    //     },
    //     {
    //       "name": "Group D",
    //       "value": 9800
    //     },
    //     {
    //       "name": "Group E",
    //       "value": 3908
    //     },
    //     {
    //       "name": "Group F",
    //       "value": 4800
    //     }
    //   ];
    //   const data01 = [
    //     {
    //       "name": "Group A",
    //       "value": 400
    //     },
    //     {
    //       "name": "Group B",
    //       "value": 300
    //     },
    //     {
    //       "name": "Group C",
    //       "value": 300
    //     },
    //     {
    //       "name": "Group D",
    //       "value": 200
    //     },
    //     {
    //       "name": "Group E",
    //       "value": 278
    //     },
    //     {
    //       "name": "Group F",
    //       "value": 189
    //     }
    //   ];

  return (
    <Box m={3}>
      <Breadcrumbs>
        <Link color="inherit" href="/company-groups">
          Company groups
        </Link>
        <Typography color="textPrimary">Current group</Typography>

        <Typography color="textPrimary">General</Typography>
      </Breadcrumbs>
      <Divider />
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
