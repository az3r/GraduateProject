import { Box, Breadcrumbs, Button, Divider, makeStyles, OutlinedInput, Select, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import dateFormat from 'dateformat';
import HTMLReactParser from 'html-react-parser';



const useStyles = makeStyles({

    outlinedInput: {
      height: 30,
      margin: 20,
      width: 350,
      borderRadius: 16,
    },
    createdDate:{
      color: "black",
    },
    typeStyle: {
        margin: "20px"
    },
    linkStyle: {
      '&:hover': {
        cursor: "pointer",
     },
    }
  });

export default function GroupQuestionsBank({questions}){
    const classes = useStyles();
    const [type,setType] = useState(0)
    const router = useRouter();
    const {id} = router.query;

    const handleChangeType = (e)=>{
        setType(e.target.value);
    }
    return(
        <Box m={3}>
            <Breadcrumbs>
                <Link color="inherit" href="/company-groups">
                    Company groups
                </Link>
                <Typography color="textPrimary">Current group</Typography>

                <Typography color="textPrimary">Questions bank</Typography>
            </Breadcrumbs>
            <Divider/>

            <Box m={3} p={2} display="flex" justifyContent="center">
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
            <Box m={3} display="flex" justifyContent="flex-end">  
                <Link href={`/company-groups/${id}/questions-bank/add`}>
                    <Button color="secondary" variant="contained">Add question</Button>
                </Link>
            </Box>
            <Box m={3}>
            <Table className={classes.table} size="small" aria-label="a dense table">
               <TableHead>
                 <TableRow>
                   <TableCell style={{ fontWeight: 'bolder' }}>Questions</TableCell>
                   <TableCell style={{ fontWeight: 'bolder' }}>Type</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {questions.map((item, index) => (
                   <TableRow
                     key={item.id}
                     className={classes.tableRow}
                     hover
                     style={
                       index % 2
                         ? { background: 'rgb(250, 250, 250)' }
                         : { background: 'white' }
                     }
                   >
                     <TableCell component="th" scope="row" className={classes.linkStyle}>
                       <Link href={`/company-groups/${id}/questions-bank/detail?question=${item.id}`}>
                       {
                            item.isMCQ ? 
                            HTMLReactParser(item.title)
                            :
                            <Typography>{item.title}</Typography>
                        }
                       </Link>
                     </TableCell>
                     <TableCell component="th" scope="row">
                        {
                            item.isMCQ ? 
                            <Typography>Multiple choice</Typography>
                            :
                            <Typography>Coding</Typography>
                        }
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
            </Box>
        </Box>
    );
}