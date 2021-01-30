import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from 'next/link';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

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
];

export default function BasicTable() {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Problem</TableCell>
                        <TableCell align="center">Difficulty</TableCell>
                        <TableCell align="center">Domain</TableCell>
                        <TableCell align="center">Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Link href="/test">
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.problem}
                                </TableCell>
                                <TableCell align="center">{row.difficulty}</TableCell>
                                <TableCell align="center">{row.domain}</TableCell>
                                <TableCell align="center">{row.score}</TableCell>
                            </TableRow>
                        </Link>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}