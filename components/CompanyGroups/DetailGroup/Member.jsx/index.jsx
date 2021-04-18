import { Box, Breadcrumbs, Divider, Typography } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';


export default function GroupMember(){
    return(
        <Box m={3}>
            <Breadcrumbs>
                <Link color="inherit" href="/company-groups">
                    Company groups
                </Link>
                <Typography color="textPrimary">1</Typography>

                <Typography color="textPrimary">Group members</Typography>
            </Breadcrumbs>
            <Divider/>

            <Box>
                <Typography>Group members</Typography>
            </Box>
        </Box>
    );
}