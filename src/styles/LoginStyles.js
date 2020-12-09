import {makeStyles} from '@material-ui/core';

export const useStyles = makeStyles( theme => ({
    bg: {
        width: "100vw",
        height: "40vh",
        backgroundImage: "linear-gradient(-45deg, #e94560, #0f3460)",
        [theme.breakpoints.up("md")]: {
            width: "50vw",
            height: "100vh",
        },
    },
    form:{
        width: "70vw",
        margin: "auto",
        position: "absolute",
        top: "20vh",
        left: "12vw",
        backgroundColor: "white",
        borderRadius: "5px",
        padding: "10px",
        boxShadow: "0 0 10px",
    },
    formInput: {
        marginTop: "10px",
    },
    input: {
        width: "60vw"
    },
    btn: {
        marginTop: "10px",
        marginBottom: "10px",
        width: "100%"
    },
    link: {
        margin: "5px 0px 5px 0px",
        display: "block",
        cursor: "pointer"
    }
}))