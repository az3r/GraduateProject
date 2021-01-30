import { Button, Grid, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React , {useState} from 'react';

export default function Examiner(props){
    const router = useRouter();

    const goToAddPage = (e) => {
        e.preventDefault();
        router.push("examiner/add");
    }
    return(
        <>
            <Grid container>
                <Grid item lg={3}>
                    <Button onClick={goToAddPage}>Add test</Button>
                    <Typography>Tests report</Typography>
                </Grid>
                <Grid item lg={9}>

                </Grid>
            </Grid>
        </>
    );
}