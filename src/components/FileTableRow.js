import {
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Hidden,
    IconButton,
    Menu,
    MenuItem,
    TableCell,
    TableRow,
    Typography
} from '@material-ui/core'
import { FileCopy, MoreHoriz } from '@material-ui/icons'
import {useStyles} from '../styles/TableRowStyles';
import React, {useReducer} from 'react'
import {deleteFile, downloadFile, convertBytesToReadableSize} from '../utils/contentUtil';

const ACTIONS = {
    OPEN_MENU: "open_menu",
    CLOSE_MENU: "close_menu",
    CLOSE_SNACKBAR: "close_snackbar",
    DISPLAY_WARNING: "display_warning",
    DISABLE_DELETE_BUTTON: "disable_delete_button"
}

function reducer(state, action){
    switch(action.type){
        case ACTIONS.DISPLAY_WARNING:
            return {...state, displayWarning: true, openMenu: false}

        case ACTIONS.CLOSE_WARNING:
            return {...state, displayWarning: false}

        case ACTIONS.OPEN_MENU:
            return {...state, openMenu: true, anchorEl: action.anchorEl.currentTarget}

        case ACTIONS.CLOSE_MENU:
            return {...state, openMenu: false}

        case ACTIONS.DISABLE_DELETE_BUTTON:
            return {...state, isDeleteFileButtonDisabled: true};

        default:
            return state;
    }
}

const initialState = {
    openMenu: false,
    anchorEl: null,
    displayWarning: false,
    isDeleteFileButtonDisabled: false
}

const FileTableRow = ({file, mainActions, mainDispatcher}) => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);

    const deleteFileById = () => {
        dispatch({type: ACTIONS.DISABLE_DELETE_BUTTON});
        deleteFile(file.id)
            .then(_ => mainDispatcher({type: mainActions.REMOVE_FILE_BY_ID, id: file.id, filename: file.filename}))
            .catch(_ => mainDispatcher({type: mainActions.REMOVE_FILE_BY_ID_FAILURE, filename: file.filename}));
    }

    const download = () => {
        downloadFile(file.id)
            .then(response => {
                dispatch({type: ACTIONS.CLOSE_MENU});
                const url = window.URL.createObjectURL(
                    new Blob([response.data], {type: response.headers.["content-type"]}));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", file.filename);
                document.body.appendChild(link);
                link.click();
            })
            .catch(_ => {
                console.log("Something went wrong while downloading the file");
            })
    }

    return (
        <>
        <TableRow>
            <TableCell className={classes.title}>
                <Box className={classes.titleBox}>
                    <FileCopy className={classes.fileIcon} />
                    <Typography>{file.filename}</Typography>
                </Box>
            </TableCell>
            <Hidden mdDown>
                <TableCell>{convertBytesToReadableSize(file.fileSize)}</TableCell>
                <TableCell>{file.uploadedAt}</TableCell>
            </Hidden>
            <TableCell>
                <IconButton aria-controls="options" 
                    onClick={(event) => dispatch({type: ACTIONS.OPEN_MENU, anchorEl: event})}>
                    <MoreHoriz fontSize="small"/>
                </IconButton>
            </TableCell>
        </TableRow>

        <Menu id="options" anchorOrigin={{vertical: "bottom", horizontal: "left"}}
            open={state.openMenu} anchorEl={state.anchorEl} 
            onClose={() => dispatch({type: ACTIONS.CLOSE_MENU})}
        >
            <MenuItem onClick={download}>Download</MenuItem>
            <MenuItem onClick={() => dispatch({type: ACTIONS.DISPLAY_WARNING})}>Delete</MenuItem>
        </Menu>

         <Dialog open={state.displayWarning}>
             <DialogTitle>Delete file {file.filename}</DialogTitle>
             <DialogContent>
                 <DialogContentText>
                     Are you sure you want to delete this file?
                 </DialogContentText>
             </DialogContent>
             <DialogActions>
                 <Button variant={"contained"} color={"secondary"}
                         onClick={() => dispatch({type: ACTIONS.CLOSE_WARNING})}>
                     Cancel
                 </Button>
                 <Button variant={"outlined"} color={"primary"} onClick={deleteFileById}
                 disabled={state.isDeleteFileButtonDisabled}>
                     Delete file
                 </Button>
             </DialogActions>
         </Dialog>
        </>
    )
}

export default FileTableRow;
