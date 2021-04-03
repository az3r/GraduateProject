import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import dateFormat from 'dateformat';
import HTMLReactParser from 'html-react-parser';
import React from 'react';

const useStyle = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    oddColor:{
        backgroundColor: '#e9e9e9',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    codeContainer:{
        paddingLeft: '10px',
        paddingTop: '5px',
        paddingRight: '5px',
        paddingBottom: '5px',
        borderLeft: "5px solid #e5e5e5",
        marginBottom: "10px"
    }
}));

export default function DetailTab({problem})
{
    // const [expanded, setExpanded] = React.useState('');
    // const [activeStep, setActiveStep] = React.useState(0);

    // const steps =
    // [
    //     `Created at ${dateFormat(new Date(problem.createdOn),'HH:MM TT, dd-mmmm-yyyy')}`,
    //     `Published at ${dateFormat(new Date(exam.startAt),'HH:MM TT, dd-mmmm-yyyy')}`,
    //     `End at ${dateFormat(new Date(exam.endAt),'HH:MM TT, dd-mmmm-yyyy')}`
    // ];

    // React.useEffect(()=>{
    //     if(Date.parse(exam.startAt) > Date.now())
    //     {
    //         setActiveStep(1);
    //     }
    //     if(Date.parse(exam.startAt) < Date.now() && Date.parse(exam.endAt) > Date.now())
    //     {
    //         setActiveStep(2);
    //     }
    //     if(Date.parse(exam.endAt) < Date.now())
    //     {
    //         setActiveStep(3);
    //     }
    // },[]);

    // const handleChange = (panel) => (event, newExpanded) => {
    //     setExpanded(newExpanded ? panel : false);
    // };

    const classes = useStyle();

    return (
        <>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" color="secondary" href={`/examiner/problems/update?id=${problem.id}`}>
                    Update          
                </Button>
            </Box>
            <Typography variant="h3">
            {problem.title}
            </Typography>
            <Typography><b>ID</b>: {problem.id}</Typography>
            {
                problem.modifiedAt ?
                <Typography><b>Modified at</b>: {
                    dateFormat(
                        new Date(problem.modifiedAt),
                        'HH:MM TT, dd-mmmm-yyyy'
                      )}
                </Typography> : null
            }
            <hr />
            <div> 
                {
                    HTMLReactParser(problem.title)
                }
                {
                    HTMLReactParser(problem.content)
                }
                {
                    problem.difficulty === 0 ? 
                    <Typography><b>Difficulty</b>: Easy</Typography> : null
                }
                {
                    problem.difficulty === 1 ? 
                    <Typography><b>Difficulty</b>: Medium</Typography> : null
                }
                {
                    problem.difficulty === 2 ? 
                    <Typography><b>Difficulty</b>: Hard</Typography> : null
                }

                
                <Typography><b>Score</b>: {problem.score}</Typography>
                <Typography><b>Time</b>: {problem.minutes}m {problem.seconds}s</Typography>
                <Typography><b>Languague</b>: {problem.language}</Typography>
                <div className={classes.codeContainer}>
                    <code>
                        <pre>{problem.code}</pre>
                    </code>
                </div> 
                {problem.cases.map((item,k)=>(
                    // eslint-disable-next-line react/no-array-index-key
                    <Typography key={k}><b>Test case #{k+1}:</b> input: {item.input} / output: {item.output}</Typography>
                ))}
            </div>      
        </>
    )
}