const { makeStyles } = require("@material-ui/core");

export const useStyles = makeStyles(theme => ({
    avatar: {
       width: "100px",
       height: "100px",
       marginLeft: "calc(50vw - 50px)",
       marginTop: "20px"
    },
    input: {
        width: "80vw",
        marginBottom: "10px"
    },
    btn: {
        width: "80vw"
    },
    form: {
        borderRadius: "5px",
        padding: "20px",
        width: "80vw",
        marginTop: "20px",
        marginLeft: "auto",
        marginRight: "auto",
        boxShadow: "0 0 10px"
    }
}))