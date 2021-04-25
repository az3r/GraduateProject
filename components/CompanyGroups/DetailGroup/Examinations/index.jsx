import { Box, Breadcrumbs, Button, Divider, makeStyles, OutlinedInput, Select, Typography } from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  

export default function GroupExaminations({exams}){
    const classes = useStyles();
    const router = useRouter();
    const [type, setType] = useState(0)
    const {id} = router.query;

    // const columns = [
    //     { field: 'title', headerName: 'Examination name', width: 300 },
    //     { field: 'score', headerName: 'Owner', width: 100 },
    //     { field: 'score', headerName: 'Score', type: 'number', width: 100 },
    //     {
    //       field: 'age',
    //       headerName: 'Age',
    //       type: 'number',
    //       width: 90,
    //     },
    //     {
    //       field: 'fullName',
    //       headerName: 'Full name',
    //       description: 'This column has a value getter and is not sortable.',
    //       sortable: false,
    //       width: 160,
    //       valueGetter: (params) =>
    //         `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
    //     },
    //   ];
      
    //   const rows = exams.map(item => item);

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

                <Typography color="textPrimary">Examinations</Typography>
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
                    <option value={1}>Private exams</option>
                    <option value={2}>Public exams</option>
                </Select>
            </Box>
            <Box m={3} display="flex" justifyContent="flex-end">  
                <Link href={`/company-groups/${id}/examinations/add`}><Button color="secondary" variant="contained">Add examination</Button></Link>
            </Box>
            <Box m={3}>
                {/* <div style={{ height: 800, width: '100%' }}>
                    <DataGrid rows={rows} columns={columns} pageSize={10}/>
                </div> */}

                {
                    exams.map((item)=>(
                        <Box>
                            <Typography>{item.title}</Typography>
                            <Link href={`/company-groups/${id}/examinations/detail?exam=${item.id}`}><Button color="secondary">Detail</Button></Link>
                        </Box>
                    ))
                }
            </Box>
        </Box>
    );
}