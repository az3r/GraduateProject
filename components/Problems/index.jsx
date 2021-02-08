import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Search from './Search/index';
import URL from '../URL';



const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    link: {
        color: 'green',
    },
    box: {
        color: 'white',
    },
    tableRow: {
        'hover': {color: '#7EA5FF'}
    }
}));


export default function Problems() {
    const classes = useStyles();
    const [problems, setProblems] = useState([]);

    useEffect(  ( ) => {

        async function getProblems() {
            const response = await fetch("/get-all-test", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type':'application/json'
                },
            });

            const data = await response.json()
            if (response.status === 200) {
                setProblems(data);
            } else {
                setProblems('');
            }
        }

        getProblems();
    }, []);


    return (
        <TableContainer component={Paper}>
            <Search />
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Difficulty</TableCell>
                        <TableCell>Language</TableCell>
                        <TableCell>Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {problems.map((problem, index) => (
                            <TableRow key={problems.id} className={classes.tableRow} hover style={index % 2? { background : 'rgb(250, 250, 250)' }:{ background : "white"}}>
                                <TableCell>{index}</TableCell>
                                <TableCell component="th" scope="row">
                                    <Link href={`/problem/${problem.id}`} underline={'none'} className={classes.link}>{problem.data.title}</Link>
                                </TableCell>
                                <TableCell>
                                    <Box component="span" display="inline" p={'4px'}   borderRadius={16} className={classes.box}
                                         bgcolor={ problem.data.difficulty == 0 ? "green" : problem.data.difficulty == 1 ? "orange" : "red"}>
                                        {
                                            problem.data.difficulty == 0 ? "Easy" : problem.data.difficulty == 1 ? "Medium" : "Hard"
                                        }
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {problem.data.language}
                                </TableCell>
                                <TableCell>{problem.data.score}</TableCell>
                            </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
