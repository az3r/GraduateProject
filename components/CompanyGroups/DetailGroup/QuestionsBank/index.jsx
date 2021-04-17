import { Box, Breadcrumbs, Button, Link, makeStyles, OutlinedInput, Select, Typography } from '@material-ui/core';
import React, { useState } from 'react';


const useStyles = makeStyles({
    root: {
      width: 300,
    },
    outlinedInput: {
      height: 30,
      margin: 20,
      width: 350,
      borderRadius: 16,
    },
    addBtn:{
        float: "right",
        marginBottom: "10px"
    },
    itemsContainer:{
        clear: "right",
    },
    createdDate:{
      color: "black",
    },
    typeStyle: {
        margin: "20px"
    }
  });

export default function GroupQuestionsBank(){
    const classes = useStyles();
    const [type,setType] = useState(0)

    const handleChangeType = (e)=>{
        setType(e.target.value);
    }
    return(
        <Box m={3}>
            <Breadcrumbs>
                <Link color="inherit" href="/company-groups">
                    Company groups
                </Link>
                <Typography color="textPrimary">1</Typography>

                <Typography color="textPrimary">Group member</Typography>
            </Breadcrumbs>
            <Box display="flex" justifyContent="center">
                <OutlinedInput
                    className={classes.outlinedInput}
                    placeholder="Search..."
                />
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
            <Box display="flex" justifyContent="flex-end">  
                <Button color="secondary" variant="contained" href="/company-groups/1/questions-bank/add">Add question</Button>
            </Box>
        </Box>
    );
}