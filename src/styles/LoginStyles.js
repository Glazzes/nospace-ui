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
        borderRadius: "10px",
        padding: "10px",
        margin: "20px",
        position: "absolute",
        top: 0,
        transform: "translateY(50%) translateX(130%)",
        [theme.breakpoints.down("xs")]: {
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)"
        }
    },
    signup:{
        borderRadius: "10px",
        padding: "10px",
        margin: "20px",
        position: "absolute",
        top: 0,
        transform: "translateY(20%) translateX(112%)",
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