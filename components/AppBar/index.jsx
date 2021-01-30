import * as React from "react";
import {
    AppBar,
    Button,
    IconButton,
    makeStyles,
    Toolbar,
    Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
    root: {
        // flexGrow: 1,
        backgroundColor: '#088247',

    },
    title: {
        marginLeft: '50px',
        "&:hover": {
            cursor: 'pointer'
        }
    },
    whiteColor: {
        color: "#ffffff"
    },
    flexGrow: {
        flexGrow: 1
    },
    action: {
        // width: 96,
    },
}));


export default function MyAppBar({isExaminer}) {
    const styles = useStyles();
    const router = useRouter();

    const toLoginPage = (e) => {
        e.preventDefault();
        router.push("/login");
    }
    const toRegisterPage = (e) => {
        e.preventDefault();
        router.push("/register");
    }

    const toHomePage = (e) => {
        e.preventDefault();
        router.push("/")
    }

    const toLecturerPage = (e) => {
        e.preventDefault();
        router.push("/examiner")
    }

    return (
        <AppBar position="static" className={styles.root}>
            <Toolbar>
                <IconButton className={styles.whiteColor} edge="start" aria-label="menu">
                    <Typography variant="h5">HCMUSCoder</Typography>
                </IconButton>
                <Typography className={ isExaminer ? styles.title : [styles.title,styles.flexGrow].join(" ")} variant="h6" onClick={toHomePage}>
                    Home
                </Typography>
                {
                    isExaminer?
                        <Typography className={[styles.title,styles.flexGrow].join(" ")} variant="h6" onClick={toLecturerPage}>
                            Examiner
                        </Typography> : null
                }
                <Button className={styles.whiteColor} onClick={toLoginPage}>
                    Login
                </Button>
                <Button className={styles.whiteColor} onClick={toRegisterPage}>
                    Register
                </Button>
            </Toolbar>
        </AppBar>
    );
}
