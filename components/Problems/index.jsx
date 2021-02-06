import React, { useEffect, useState } from 'react';
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



function createData(id, problem, difficulty, domain, score) {
    return { id, problem, difficulty, domain, score };
}

const rows = [
    createData('1', 'Sum 2 interger number', 'Easy', 'C#', 67),
    createData('2', 'Sum 2 float number', 'Easy', 'C/C++', 51),
    createData('3', 'Birthday party', 'Medium', 'Java', 24),
    createData('4', 'Way to my house', 'Easy', "C#", 24),
    createData('5','Car or plane', 'Easy', 'Java', 49),
    createData('6','Find my password', 'Hard', 'Java', 87),
    createData('7','30 second', 'Hard', "C#", 37),
    createData('8','How many apple', 'Hard', "C/C++", 94),
    createData('9','The left mouse', 'Easy', 'Javascript', 65),
    createData('10','Red button', 'Medium', 'Java', 98),
    createData('11','Sum 2 interger number', 'Easy', 'C#', 67),
    createData('12','Sum 2 float number', 'Easy', 'C/C++', 51),
    createData('13','Birthday party', 'Medium', 'Java', 24),
    createData('14','Way to my house', 'Easy', "C#", 24),
    createData('15','Car or plane', 'Easy', 'Java', 49),
    createData('16','Find my password', 'Hard', 'Java', 87),
    createData('17','30 second', 'Hard', "C#", 37),
    createData('18','How many apple', 'Hard', "C/C++", 94),
    createData('19','The left mouse', 'Easy', 'Javascript', 65),
    createData('20','Red button', 'Medium', 'Java', 98),
];

export default function Problems() {
    const classes = useStyles();
    const [problems, setProblems] = useState({
        id: '',
        title: '',
        content: '',
        difficulty: '',
        score: '',
        language: '',
        code: '',
        cases: '',
    });

    useEffect(() => {

    })


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
                                    <Link href={`/problem/${row.id}`} underline={'none'} className={classes.link}>{row.problem}</Link>
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
