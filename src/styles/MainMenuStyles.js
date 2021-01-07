import {blue} from '@material-ui/core/colors';
const { makeStyles } = require("@material-ui/core");

export const useStyles = makeStyles(theme => ({
    appBar: {backgroundColor: blue[900]},
    avatar: {width: "100px", height: "100px"},
    progress: {
        width: "80%",
        margin: "0 10% 0 10%"
    },
    progresText: {textAlign: "center"},
    space: {
        marginTop: "20px",
        width: "250px",
        [theme.breakpoints.up("md")]: {width: "300px"}
    },
    menuIcon: {color: "white", marginLeft: ""},
    swipDrawer: {width: "250px"},
    drawerPaper: {width: "250px"},
    swipAvatarBox: {
        width: "250px",
        height: "150px",
        backgroundColor: blue[900],
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    permaAvatarBox: {
        width: "300px",
        height: "180px",
        backgroundColor: blue[900],
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
}));