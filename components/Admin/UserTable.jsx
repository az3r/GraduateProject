import { Container, TableBody, TableCell, TableHead, TableRow, Table, makeStyles, TableContainer, Paper, TableFooter, TablePagination, TableSortLabel, TextField, Button, Dialog, DialogTitle, DialogContent, IconButton, Typography, DialogActions, Snackbar} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import CloseIcon from '@material-ui/icons/Close'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import React, { useState } from 'react'
import  MuiDialogTitle from '@material-ui/core/DialogTitle'
import { Alert, Autocomplete } from '@material-ui/lab'
import Switch from '@material-ui/core/Switch'

const data = [
    {
        id: '1',
        email: 'nuocaqua@gmail.com',
        name: 'Chai nuoc Aqua',
        organization: 'Google',
        point: 120,
        active: true,
        deleted: false
    },
    {
        id: '2',
        email: 'cholimex@gmail.com',
        name: 'Chai nuoc tuong',
        organization: 'Google',
        point: 12,
        active: true,
        deleted: false
    },
    {
        id: '3',
        email: 'samsung@gmail.com',
        name: 'Cap sac nhanh',
        organization: 'HCMUS',
        point: 854,
        active: true,
        deleted: false
    },
    {
        id: '4',
        email: 'xesodoimoi@gmail.com',
        name: 'Honda',
        organization: 'Factory',
        point: 310,
        active: true,
        deleted: false
    },
    {
        id: '5',
        email: 'hpchopm@gmail.com',
        name: 'Laptop sieu trau',
        organization: 'Logitech',
        point: 97,
        active: true,
        eleted: false
    },
    {
        id: '6',
        email: '3namkhonghu@gmail.com',
        name: 'Quat senko',
        organization: 'Google',
        point: 500,
        active: true,
        deleted: false
    },
]

const organizationData = [
    {
        name: 'Google'
    }, 
    {
        name: 'Apple'
    },
    {
        name: 'FPT'
    }, 
    {
        name: 'Petrolimex'
    },
    { 
        name: 'Freelancer'
    }, 
    {
        name: 'HCMUS'
    }
]

const headCells = [
    { id : 'name', label: 'Full name'},
    { id: 'email', label: 'Email'},
    { id : 'organization', label: 'Organization'},
    { id : 'point', label: 'Point'},
    { id : 'status', label: 'Status'},
    { id : 'action', label: 'Actions', disableSorting: true}
    
]

const useStyles = makeStyles( theme => ({
    root: {
        width: '95%'
     
    },
    searchInput: {
        margin: theme.spacing(2),
        padding: `0px ${theme.spacing(1)}`,
        width: '95%',
        position: 'relative',

    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1)
    },
    table: {
        marginTop: theme.spacing(2),
        '& thead th': {
            fontWeight: '600',
            color: '#333996',
            backgroundColor: '#3c44b126'
        },
        '& tbody td': {
            fontWeight: '300'
        },
        '& tbody tr:hover': {
            backgroundColor: '#fffbf2',
            cursor: 'pointer'
        }
    },
    dialogInput: {
        margin: theme.spacing(1),
        width: '80%',
        position: 'relative',
        left: '5%'
        
    }
}))

function DesComparator(a, b, orderBy) {
    if(a[orderBy] > b[orderBy])
        return -1
    
    if(a[orderBy] < b[orderBy])
        return 1

    return 0
}

function GetComparartor(order, orderBy) {
    return order === 'dsc' 
    ? (a, b) => DesComparator(a, b, orderBy)
    : (a, b) => -DesComparator(a, b, orderBy)
}

function stableSort(array, comparartor) {
    const stablilizedThis = array.map((el, index) => [el, index])

    stablilizedThis.sort((a, b) => {
        const order = comparartor(a[0], b[0])

        if(order !== 0) 
            return order

        return a[1] - b[1]
    })

    return stablilizedThis.map((el) => el[0])
}

export default function UserTable() {

    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [page, setPage] = useState(0)
    const [order, setOrder] = useState('dsc')
    const [orderBy, setOrderBy] = useState()
    const [filterFn, setFilterFn] = useState({fn: items => items})
    const [open, setOpen] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [recordToEdit, setRecordToEdit] = useState({name: '', email: '', organization: ''})
    const [myUpdateModel, setMyUpdateModel] = useState({name: '', email: '', organization: '', active: true})
    const [deleteId, setDeleteId] = useState(-1)
    const [sucessMess, setSucessMess] = useState(false)
    const [failedMess, setFailedMess] = useState(false)
    const classes = useStyles()

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleSortClick = (headCellId) => {
        const isDsc = headCellId === orderBy && order === 'dsc'

        setOrder( isDsc ? 'asc' : 'dsc')
        setOrderBy(headCellId)
    }

    const handleSearchClick = (event) => {
        const {target} = event
        setFilterFn({
            fn: items => {
                if(target.value === '')
                    return items
                return items.filter(x => !x.deleted && (x.name.toLowerCase().includes(target.value.toLowerCase()) || x.email.toLowerCase().includes(target.value.toLowerCase())))
            }
        })

    }

    const openEditPopup = item => {
        const entityIndex = data.findIndex(x => x.email === item.email)
        setMyUpdateModel(data[entityIndex])
        setRecordToEdit(item)
        setOpen(true)
    }

    const closeEditPopup = () => {
        setRecordToEdit({name: '', email: '', organization: ''})
        setMyUpdateModel({name: '', email: '', organization: '', active: true})
        setOpen(false)
        setSucessMess(true)
    }

    const updateEntity = () => {
        const entityIndex = data.findIndex(x => x.email === myUpdateModel.email)
        data[entityIndex] = {...myUpdateModel}
        setMyUpdateModel({name: '', email: '', organization: '', active: true})
        closeEditPopup()
    }

    const openDeleteDialog = id => {
        setDeleteId(id)
        setOpenConfirm(true)
    }

    const deletedRecord = () => {
        data[data.findIndex(x => x.id === deleteId)].active = false
        setDeleteId(-1)
        setOpenConfirm(false)
        setFailedMess(true)
    }

    const changeState = (e,row) => {

        const nextStatus = !row.active
        const {id} = row

        data[id].active = nextStatus
    }

    return(
        <Container fixed className={classes.root}>
            <Paper>
                <TextField
                    className={classes.searchInput}
                    label='search user'
                    defaultValue='type something here...'
                    variant='outlined'
                    onChange={(event) => handleSearchClick(event)}
                    startAdornment={<SearchIcon fontSize='small'/>}
                />
                <TableContainer >
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                {headCells.map(headCell => (
                                    <TableCell key={headCell.id}>
                                        <TableSortLabel 
                                            active={ orderBy === headCell.id}
                                            direction={ orderBy === headCell.id ? order : 'asc'}
                                            onClick={() => handleSortClick(headCell.id)}>
                                            {headCell.label}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0 ? stableSort(filterFn.fn(data), GetComparartor(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : stableSort(filterFn.fn(data), GetComparartor(order, orderBy))).map(row => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.organization}</TableCell>
                                    <TableCell>{row.point}</TableCell>
                                    {/* <TableCell>{row.active ? 'active' : 'deactive'}</TableCell> */}
                                    <TableCell><Switch checked={row.active} onChange={(e) => changeState(e, row)}/></TableCell>
                                    <TableCell>
                                        <IconButton>
                                            <EditIcon color='primary' onClick={() => openEditPopup(row)}/>
                                        </IconButton>
                                        <IconButton>
                                            <DeleteIcon color='secondary' onClick={() => openDeleteDialog(row.id)}/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 15, { label: 'All', value: -1}]}
                                    colSpan={3}
                                    rowsPerPage={rowsPerPage}                            
                                    count={data.length}
                                    page={page}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}

                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Paper>
            <Dialog open={open} onClose={() => closeEditPopup()} maxWidth='md'>
                <MuiDialogTitle disableTypography>
                    <Typography>
                        Add new account 
                    </Typography>
                    {open ? (
                        <IconButton className={classes.closeButton} onClick={() => closeEditPopup()}>
                            <CloseIcon/>
                        </IconButton>
                    ) : null}
                </MuiDialogTitle>
                <DialogContent dividers>
                    <TextField 
                        className={classes.dialogInput} 
                        label='Full name' 
                        variant='outlined'
                        onChange={(e) => setMyUpdateModel( () => {myUpdateModel.name = e.target.value; return myUpdateModel})}
                        defaultValue= {recordToEdit.name}/>
                    
                    <TextField 
                        className={classes.dialogInput} 
                        label='Email' variant='outlined' 
                        type='required'
                        defaultValue={recordToEdit.email}
                        onChange={(e) => setMyUpdateModel( () => {myUpdateModel.email = e.target.value; return myUpdateModel})}
                        />
                    <Autocomplete 
                        className={classes.dialogInput}
                        defaultValue={{name: recordToEdit.organization}}
                        options={organizationData}
                        getOptionLabel={(option) => option.name}
                        type='required'
                        onChange={(e,value) => setMyUpdateModel( () => {myUpdateModel.organization = value.name; return myUpdateModel})}
                        renderInput={(params) => <TextField {...params} label='Choose a organization' variant='outlined'
                        />}                           
                    />          
                </DialogContent>
                <DialogActions>
                    <Button autoFocus variant='contained' color='primary' onClick={() => updateEntity()}>
                        Submit
                    </Button>
                    <Button variant='outlined' onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Delete confirm</DialogTitle>
                <DialogContent>Are you sure ? This account will be deleted forever </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='secondary' onClick={() => deletedRecord()}>Delete</Button>
                    <Button variant='outlined' autoFocus onClick={() => setOpenConfirm(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={sucessMess} anchorOrigin={{vertical:'bottom', horizontal:'center'}} onClose={() => setSucessMess(false)}>
                <Alert variant='filled' severity='success' onClose={() => setSucessMess(false)} icon={<CheckCircleOutlineIcon fontSize='inherit'/>}>Successfully </Alert>
            </Snackbar>
            <Snackbar open={failedMess} anchorOrigin={{vertical:'bottom', horizontal:'center'}} onClose={() => setFailedMess(false)}>
                <Alert variant='filled' severity='error' onClose={() => setFailedMess(false)}>Erorr!! something went wrong</Alert>
            </Snackbar>
        </Container>
    )
}