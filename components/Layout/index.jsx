import MyAppBar from "../AppBar";
import {Container, makeStyles} from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default function Layout(props) {
    const classes = useStyles();

    return (
        <>
            <MyAppBar isExaminer={true} />
            <br />
            <Container>
                <div className={classes.root}>

            <div className={classes.root}>
                    {props.children}
                </div>
            </Container>
            </div>
        </>
    );
}}}
