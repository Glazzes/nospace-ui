import {makeStyles} from '@material-ui/core';
import { blueGrey, yellow } from '@material-ui/core/colors';

export const useStyles = makeStyles( theme => ({
    title: {
        width: "45vw",
        [theme.breakpoints.down("md")]: {width: "80vw"}
    },
    titleBox: {display: "flex"},
    goBack: {height: "50px", backgroundColor: blueGrey[100], cursor: "pointer"},
    folderIcon: {color: yellow[500]},
    folderRow: {
        "&:hover": {backgroundColor: blueGrey[100], cursor: "pointer"}
    },
    warning: {
        width: "60vw",
        margin: "auto auto",
        backgroundColor: "white",
        padding: "10px"
    },
    warningBox: {
        display: "flex",
        justifyContent: "space-between"
    }
}))