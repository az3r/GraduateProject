import { 
    Box, 
    Button, 
    Grid, 
    makeStyles, 
    NativeSelect, 
    TextField, 
    Typography } from '@material-ui/core';
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SkewLoader from "react-spinners/SkewLoader";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import CodeEditor from '../../../../../CodeEditor';

const useStyles = makeStyles({
    textSuccess: {
        color: '#52C41A'
    },
    textFail: {
        color: '#F74B4D'
    },
    testFont: {
        fontSize: "12px",
        wordWrap: "break-word",
    }
})

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function CodingProblem({
        NO,value,
        handleChangeCPTitle,handleChangeCPInfo,handleChangeCPDifficulty,handleChangeScore,
        handleChangeLanguague,handleChangeCPCode,handleChangeSimpleTest,handleTestCode,handleChangeCPFiles,
        handleChangeMinutes,handleChangeSeconds}){
                
    const [open, setOpen] = React.useState(false);
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const classes = useStyles();

    const handleChangeInfo = (event,editor) => {
        const content = editor.getData();
        handleChangeCPInfo(NO,content);
    }

    const handleOnChangeCode = (newCode) => {
        handleChangeCPCode(NO,newCode);
    }

    return(
        <Box boxShadow={4} p={2}>
            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter title: </Typography>
                <TextField
                    value={value.title}
                    id={`CP_${NO}`}
                    onChange={handleChangeCPTitle} fullWidth/>
            </Box>
      
            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter information: </Typography>
                <CKEditor
                        editor={ ClassicEditor }
                        data={value.content}
                        onChange={handleChangeInfo} />
            </Box>
        
            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Choose level of difficulty: </Typography>
                <NativeSelect id={`CP_${NO}`}
                    onChange={handleChangeCPDifficulty}>
                        {
                            value.difficulty === 0 ?
                            <option value={0} selected >Easy</option>
                            :
                            <option value={0}>Easy</option>
                        }
                        {
                            value.difficulty === 1 ?
                            <option value={1} selected>Medium</option>
                            :
                            <option value={1}>Medium</option>
                        }
                        {
                            value.difficulty === 2 ?
                            <option value={2} selected>Hard</option>
                            :
                            <option value={2}>Hard</option>
                        }
                </NativeSelect>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter score: </Typography>
                <input id={`CP_${NO}`} onChange={handleChangeScore} type="number" max="100" min="0" value={value.score} />
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Enter time for question: </Typography>
                <Box display="flex">
                    <input id={`CP_${NO}`}  onChange={handleChangeMinutes} type="number" max="100" min="0" value={value.minutes}  />
                    <Typography>&nbsp;minute(s)&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;</Typography>
                    <input id={`CP_${NO}`}  onChange={handleChangeSeconds} type="number" max="59" min="0" value={value.seconds}  />
                    <Typography>&nbsp;second(s)&nbsp;&nbsp;</Typography>
                </Box>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Choose programming language: </Typography>
                <NativeSelect
                    onChange={handleChangeLanguague} id={`CP_${NO}`}>
                        {
                            value.language === "Csharp" ?
                            <option selected value="Csharp">C#</option>
                            :
                            <option value="Csharp">C#</option>
                        }
                        {
                            value.language === "Java" ?
                            <option selected value="Java">Java</option>
                            :
                            <option value="Java">Java</option>
                        }
                        {
                            value.language === "Python" ?
                            <option selected value="Python">Python</option>
                            :
                            <option value="Python">Python</option>
                        }
                </NativeSelect>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Grid container>
                    <Grid item lg={6}>
                        <Typography variant="h5">Enter code: </Typography>
                        <CodeEditor language={value.language}  code={value.code} onCodeChange={handleOnChangeCode}  />
                    </Grid>
                    <Grid item lg={6}>
                        <Typography variant="h5">Notes:</Typography>
                        <ul>
                            <li><Typography>Write full your code in the coding editor</Typography></li>
                            <li><Typography>Enter simple input and output to test your code (include only one test case)</Typography></li>
                            <li><Typography>Click Test code button to test your code and input, output</Typography></li>
                        </ul>

                        <div>
                            <TextField id={`CP_${NO}_SimpleIn`} multiline label="Enter simple input" onChange={handleChangeSimpleTest} />
                        </div>
                        <div>
                            <TextField id={`CP_${NO}_SimpleOut`} multiline label="Enter simple output" onChange={handleChangeSimpleTest} />
                        </div>
                        <br />
                        <div>
                            <Button variant="primary" id={`CP_${NO}`} onClick={handleTestCode}>Test code</Button>
                            <SkewLoader color="#088247"  loading={value.isLoadingTestCode} size={20} />
                        </div>
                        <pre className={[value.testCodeSuccess ? classes.textSuccess : classes.textFail,classes.testFont].join(" ")}>{value.messageTestCode}</pre>
                    </Grid>
                </Grid>
            </Box>

            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Submit input file: </Typography>
                <input id={`CP_${NO}_In`} type="file" onChange={handleChangeCPFiles} />
            </Box>
            <Box boxShadow={1} p={2} m={3}>
                <Typography variant="h5">Submit expected output file: </Typography>
                <input id={`CP_${NO}_Out`} type="file" onChange={handleChangeCPFiles} />
            </Box>

            <Box p={2} m={3}>
                <Button color="secondary" onClick={handleClickOpen}>See submitted test cases</Button>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">Current test cases</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                        {value.cases.map((item,key)=>(
                            // eslint-disable-next-line react/no-array-index-key
                            <Typography key={key}><b>#{key+1}:</b> input: {item.input} / output: {item.output}</Typography>
                        ))}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    )
}