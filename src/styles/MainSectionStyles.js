import { makeStyles } from "@material-ui/core";
import bg from '../assets/bg2.svg';
import {blue} from '@material-ui/core/colors';

export const useStyles = makeStyles(theme => ({
    drop: {marginBottom: "15px"},
    serchBox: {
        marginTop: "10px",
        marginBottom: "15px",
        display: "flex",
        alignItems: "center",
        [theme.breakpoints.up("md")]: {marginLeft: "300px"},
        [theme.breakpoints.down("md")]: {flexDirection: "column"}
    },
    searchInput: {
        [theme.breakpoints.up("md")]: {width: "67vw"},
        [theme.breakpoints.down("md")]: {
            width: "95vw"
        }
    },
    url: {
        marginTop: "10px",
        [theme.breakpoints.up("md")]: {marginLeft: "310px"}
    },
    test: {
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "left"
    },
    modal: {
        margin: "45px",
        padding: "10px"
    },
    modalInput: {
        width: "100%"
    },
    modalBox: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px"
    },
    modalContainer: {
        padding:"10px"
    },
    newFolderInput: {
        width: "100%"
    }
}))