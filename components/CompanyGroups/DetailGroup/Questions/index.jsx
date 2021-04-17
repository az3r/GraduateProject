import { Box, Breadcrumbs, Link, Typography } from '@material-ui/core';
import React from 'react';


export default function GroupQuestions(){
    return(
        <Box m={3}>
            <Breadcrumbs>
                <Link color="inherit" href="/company-groups">
                    Company groups
                </Link>
                <Typography color="textPrimary">1</Typography>

                <Typography color="textPrimary">Group member</Typography>
            </Breadcrumbs>
            <Box>
                <Typography>Group questions</Typography>
            </Box>
        </Box>
    );
}