import {makeStyles} from '@material-ui/core';
import { blueGrey, yellow } from '@material-ui/core/colors';

export const useStyles = makeStyles( theme => ({
    title: {
        width: "45vw",
        [theme.breakpoints.down("md")]: {width: "80vw"}
    },
    titleBox: {display: "flex"},
    goBack: {height: "50px", backgroundColor: blueGrey[100], cursor: "pointer"},
    folderIcon: {color: yellow[500], marginRight: "10px"},
    folderRow: {
        "&:hover": {backgroundColor: blueGrey[100], cursor: "pointer"}
    },
    warning: {
        margin: "45px",
        padding: "10px"
    },
    warningContainer: {
        padding: "10px"
    },
    warningBox: {
        width: "80%",
        display: "flex",
        justifyContent: "space-between",
        margin: "20px auto 0 auto"
    },
    link: {
        textDecoration: "none",
        color: "rgb(61, 61, 61)"
    },
    fileIcon:{marginRight: "10px"}
}))