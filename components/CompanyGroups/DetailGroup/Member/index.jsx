import { Box, Breadcrumbs, Button, Divider, makeStyles, OutlinedInput, Typography } from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const useStyles = makeStyles({
    root: {
      width: 300,
    },
    outlinedInput: {
      height: 30,
      margin: 20,
      width: 350,
      borderRadius: 16,
    },
    addBtn:{
        float: "right",
        marginBottom: "10px"
    },
    itemsContainer:{
        clear: "right",
    },
    createdDate:{
      color: "black",
    },
    typeStyle: {
        margin: "20px"
    },
  });


export default function GroupMember(){
    const classes = useStyles();
    const router = useRouter();
    const {id} = router.query;
    return(
        <Box m={3}>
            <Breadcrumbs>
                <Link color="inherit" href="/company-groups">
                    Company groups
                </Link>
                <Typography color="textPrimary">Current group</Typography>

                <Typography color="textPrimary">Group members</Typography>
            </Breadcrumbs>
            <Divider/>

            <Box m={3} p={2} display="flex" justifyContent="center">
                <OutlinedInput
                    className={classes.outlinedInput}
                    placeholder="Search..."
                />
            </Box>
            <Box m={3} display="flex" justifyContent="flex-end">  
                <Link href={`/company-groups/${id}/members/add`}>
                    <Button color="secondary" variant="contained">Add question</Button>
                </Link>
            </Box>
        </Box>
    );
}