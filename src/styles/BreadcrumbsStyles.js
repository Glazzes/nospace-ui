import {makeStyles} from "@material-ui/core";
import {blue} from "@material-ui/core/colors";

export const useStyles = makeStyles(theme => ({
    breadCrumb: {
        cursor: "pointer",
        "&:hover": {color: blue[900]},
    },
    breadCrumbGroup: {
        marginLeft: "2.5vw",
        marginRight: "2.5vw"
    }
}));