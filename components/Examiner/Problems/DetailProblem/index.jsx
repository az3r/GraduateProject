import { Box, Breadcrumbs, Button, Link, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function DetailProblem({user,problem}){
    const router = useRouter();
    useEffect(() => {
        if(Object.keys(user).length === 0)
        {
        router.replace('/login');
        }
        if(Object.keys(problem).length === 0)
        {
        router.replace('/examiner/problems');
        }
    },[]);

    return(
        <Box m={1}>
            <Box p={2}>
                <Breadcrumbs>
                    <Link color="inherit" href="/examiner">
                        Examiner
                    </Link>
                    <Link color="inherit"  href="/examiner/problems">
                        Problems
                    </Link>
                    <Typography color="textPrimary">Detail</Typography>
                </Breadcrumbs>
            </Box>
            <Box display="float" p={2}>
                <Button color="primary" href={`/examiner/problems/update?id=${problem.id}`}>Update</Button>
            </Box>
        </Box>
    )
}