import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import AddIcon from '@material-ui/icons/Add';
import { Box, Divider, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, makeStyles, OutlinedInput, Select, Typography } from '@material-ui/core';
import { getProblems } from '@libs/client/companies';
import HTMLReactParser from 'html-react-parser';


const useStyles = makeStyles({
    container: {
        width: 500,
    },
    listItem:{
        width: "100%"
    },
    titleStyle:{
        wordWrap: "break-word"
    },
    outlinedInput: {
        height: 30,
        margin: 20,
        width: 350,
        borderRadius: 16,
    },
    typeStyle: {
        margin: "20px"
    }
})

export default function AddProblemFromLibrary({idCompany,questionsList,handleAddQuestionFromLibrary}){
    const [problemsList,setProblemsList] = useState([]);
    useEffect(async ()=>{
        const problemsData = await getProblems(idCompany);
        console.log(problemsData);
        setProblemsList(problemsData);
    },[]);

    const classes = useStyles();
    const [type,setType] = useState(0)

    const handleChangeType = (e)=>{
        setType(e.target.value);
    }

    return(
        <Box m={3} p={2} className={clsx(classes.container)}>
            <Typography variant="h5">Choose questions from library</Typography>
            <Box display="flex" justifyContent="center">
                <OutlinedInput
                    className={classes.outlinedInput}
                    placeholder="Search..."
                />
            </Box>
            <Box display="flex" justifyContent="center">
                <Select
                    native
                    value={type}
                    onChange={handleChangeType}
                    className={classes.typeStyle}
                    >
                    <option value={0}>All</option>
                    <option value={1}>Coding questions</option>
                    <option value={2}>Multiple choice questions</option>
                </Select>
            </Box>
            <List>
                {problemsList?.map((item) => (
                <ListItem key={item.id}>
                    <ListItemIcon>
                        {
                            questionsList.find(question => question.id === item.id) ?
                            <IconButton variant="contained" color="primary" disabled>
                                <AddIcon />
                            </IconButton>
                            :
                            <IconButton variant="contained" color="primary" onClick={() => handleAddQuestionFromLibrary({id: item.id, score: item.score})}>
                                <AddIcon />
                            </IconButton>
                        }
                    </ListItemIcon>
                    <ListItemText 
                        primary={
                            <>
                                {
                                    item.isMCQ ? 
                                    <>
                                        <div className={classes.titleStyle}>
                                        {
                                            HTMLReactParser(item.title)
                                        }
                                        </div>
                                        <Typography>Multiple choice question</Typography>
                                    </>
                                    :
                                    <>
                                        <Typography className={classes.titleStyle}>{item.title}</Typography> 
                                        <Typography>Coding question</Typography>            
                                    </>
                                }
                            </>
                        } 
                        secondary={
                            <>
                                <Link href={`/company-groups/${idCompany}/questions-bank/${item.id}`} target="_blank">Go to detail question</Link>
                                <Divider/>
                            </>
                        }
                    />
                </ListItem>
                ))}
            </List>
        </Box>
    );
}