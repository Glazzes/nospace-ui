import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react'

const MySnackbar = ({open, content, close, type}) => {
    return (
        <Snackbar open={open} anchorOrigin={{vertical: "top", horizontal: "center"}}>
            <Alert severity={type} onClose={close}>
                {content}
            </Alert>
        </Snackbar>
    )
}

export default MySnackbar;
