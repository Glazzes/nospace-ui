import {makeStyles} from '@material-ui/core';

export const useStyles = makeStyles( theme => ({
    bg: {
        width: "100vw",
        height: "50vh",
        backgroundImage: "linear-gradient(-45deg, #e94560, #0f3460)",
        [theme.breakpoints.up("md")]: {
            width: "50vw",
            height: "100vh",
        },
    },
    login:{
        margin: "20px",
        borderRadius: "10px",
        padding: "10px",
        [theme.breakpoints.down("xs")]: {
            position: "absolute",
            top: "30%",
        }
    },
    signup:{
        borderRadius: "10px",
        padding: "10px",
        margin: "20px",
        [theme.breakpoints.down("xs")]: {
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)"
        }
    },
    container: {
        padding: "10px"
    },
    input: {
        marginTop: "20px",
        width: "100%"
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