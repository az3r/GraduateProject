import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
// import Link from 'next/link';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Search from './Search/index';

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



function createData(problem, difficulty, domain, score) {
    return { problem, difficulty, domain, score };
}

const rows = [
    createData('Sum 2 interger number', 'Easy', 'C#', 67),
    createData('Sum 2 float number', 'Easy', 'C/C++', 51),
    createData('Birthday party', 'Medium', 'Java', 24),
    createData('Way to my house', 'Easy', "C#", 24),
    createData('Car or plane', 'Easy', 'Java', 49),
    createData('Find my password', 'Hard', 'Java', 87),
    createData('30 second', 'Hard', "C#", 37),
    createData('How many apple', 'Hard', "C/C++", 94),
    createData('The left mouse', 'Easy', 'Javascript', 65),
    createData('Red button', 'Medium', 'Java', 98),
    createData('Sum 2 interger number', 'Easy', 'C#', 67),
    createData('Sum 2 float number', 'Easy', 'C/C++', 51),
    createData('Birthday party', 'Medium', 'Java', 24),
    createData('Way to my house', 'Easy', "C#", 24),
    createData('Car or plane', 'Easy', 'Java', 49),
    createData('Find my password', 'Hard', 'Java', 87),
    createData('30 second', 'Hard', "C#", 37),
    createData('How many apple', 'Hard', "C/C++", 94),
    createData('The left mouse', 'Easy', 'Javascript', 65),
    createData('Red button', 'Medium', 'Java', 98),
];

export default function Problems() {
    const classes = useStyles();


    return (
        <TableContainer component={Paper}>
            <Search />
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Difficulty</TableCell>
                        <TableCell>Domain</TableCell>
                        <TableCell>Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                            <TableRow key={row.name} className={classes.tableRow} hover style={index % 2? { background : 'rgb(250, 250, 250)' }:{ background : "white"}}>
                                <TableCell>{index}</TableCell>
                                <TableCell component="th" scope="row">
                                    <Link href="/test" underline={'none'} className={classes.link}>{row.problem}</Link>
                                    <Link href="/test_problem" underline={'none'} className={classes.link}>{row.problem}</Link>
                                </TableCell>
                                <TableCell>
                                    <Box component="span" display="inline" p={'4px'}   borderRadius={16} className={classes.box}
                                         bgcolor={ row.difficulty == 'Easy' ? "green" : row.difficulty == 'Medium' ? "orange" : "red"}>
                                        {row.difficulty}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {row.domain}
                                </TableCell>
                                <TableCell>{row.score}</TableCell>
                            </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
