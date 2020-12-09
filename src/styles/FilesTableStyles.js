import { blue } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles( (theme) =>  ({
    container: {
        marginTop: "10px",
        [theme.breakpoints.up("md")]: {maxWidth: "calc(100vw - 310px)", marginLeft: "310px"} 
    },
    headTitle: {backgroundColor: blue[900], color: "white", textAlign: "left", height: "30px"},
    fileTitle: {
        backgroundColor: blue[900],
        color: "white", 
        width: "45vw",
        height: "40px",
        textAlign: "left",
        [theme.breakpoints.down("md")]: {width: "80vw"}
    }
}))