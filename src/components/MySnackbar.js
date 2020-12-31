import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import React from 'react'

const MySnackbar = ({open, content, close, type}) => {
    return (
        <Snackbar open={open} anchorOrigin={{vertical: "top", horizontal: "center"}}>
            <MuiAlert elevation={5} variant={"filled"} severity={type} onClose={close}>
                {content}
            </MuiAlert>
        </Snackbar>
    )
}

export default MySnackbar;