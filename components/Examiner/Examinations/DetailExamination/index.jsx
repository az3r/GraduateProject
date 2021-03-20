import { Box, Breadcrumbs, Button, Link, Typography } from '@material-ui/core';
import React from 'react';

export default function DetailExamination({exam}){
    return(
        <Box m={1}>
            <Box p={2}>
                <Breadcrumbs>
                    <Link color="inherit" href="/examiner">
                        Examiner
                    </Link>
                    <Link color="inherit"  href="/examiner/examinations">
                        Examinations
                    </Link>
                    <Typography color="textPrimary">Detail</Typography>
                </Breadcrumbs>
            </Box>
            <Box display="float" p={2}>
                <Button color="primary" href={`/examiner/examinations/update?id=${exam.id}`}>Update</Button>
            </Box>
        </Box>
    )
}