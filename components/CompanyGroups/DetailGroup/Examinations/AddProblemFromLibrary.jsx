import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Box, Button, List, ListItem, ListItemText, makeStyles, OutlinedInput, Select, Typography } from '@material-ui/core';

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

export default function AddProblemFromLibrary({questionsList,handleAddQuestionFromLibrary}){
    useEffect(()=>{

    },[])
    const list = [{
        id: 123,
        title: "abc"
    },
    {   
        id: 456,
        title: "xyz"
    },
    {   
        id: 789,
        title: "xyz"
    },
    {   
        id: 135,
        title: "xysssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssz"
    },
    {   
        id: 246,
        title: "xyz"
    },
    {   
        id: 469,
        title: "xyz"
    }]
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
                {list.map((item) => (
                <ListItem key={item.id}>
                    {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
                    <ListItemText 
                        primary={
                            <Box boxShadow={2} p={2} className={classes.listItem}>
                                <Typography className={classes.titleStyle}>{item.title}</Typography>
                                {
                                    questionsList.find(question => question.id === item.id) ?
                                    <Button disabled color="secondary" variant="contained">Added</Button>
                                    :
                                    <Button color="secondary" variant="contained" onClick={() => handleAddQuestionFromLibrary(item)}>Add</Button>

                                }
                            </Box>
                        } 
                    />
                </ListItem>
                ))}
            </List>
        </Box>
    );
}