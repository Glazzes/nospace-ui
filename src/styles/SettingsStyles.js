const { makeStyles } = require("@material-ui/core");

export const useStyles = makeStyles(theme => ({
    root: {
      marginRight: "auto",
      marginLeft: "auto"
    },
    avatarBox:{
        display: "flex",
        justifyContent: "center"
    },
    avatar: {
       width: "100px",
       height: "100px",
       cursor: "pointer",
       "&:hover": {
           filter : "grayscale(100%)"
       }
    },
    divider: {
      width: "100%" ,
      margin: "10px 0 20px 0"
    },
    inputBox: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    input: {
        width: "100%",
        marginBottom: "20px"
    },
    badgeIcon: {
        backgroundColor: "white",
        color: "grey",
        borderRadius: "50%",
        padding: "5px",
    },
    form:{
        borderRadius: "10px",
        padding: "10px",
        marginLeft: "auto",
        marginRight: "auto",
        [theme.breakpoints.down("md")]: {
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
        }
    },
    container:{
        padding: "10px",
    },
    paper: {
        maxWidth: [theme.breakpoints.width("sm")],
        marginRight: "auto",
        marginLeft: "auto"
    },
    buttonBox: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between"
    },
    link: {
        textDecoration: "none",
        color: theme.palette.text.primary
    }
}))