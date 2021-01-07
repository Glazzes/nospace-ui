import {
    Box,
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText, DialogTitle,
    Hidden,
    IconButton,
    Menu,
    MenuItem,
    TableCell,
    TableRow,
    Typography
} from '@material-ui/core';
import { Folder, MoreHoriz } from '@material-ui/icons';
import {useStyles} from '../styles/TableRowStyles';
import React, {useReducer} from 'react';
import {deleteFolder, downloadFolder} from '../utils/contentUtil';

const ACTIONS = {
    OPEN_MENU: "display_menu",
    CLOSE_MENU: "close_menu",
    OPEN_WARNING: "open_warning",
    CLOSE_WARNING: "close_warning",
    DISABLE_DELETE_BUTTON: "disable_delete_button"
}

function reducer(state, action){
    switch(action.type){
        case ACTIONS.OPEN_MENU:
            return {...state, openMenu: true, anchorEl: action.anchorEl.currentTarget};

        case ACTIONS.CLOSE_MENU:
            return {...state, anchorEl: null, openMenu: false};

        case ACTIONS.DISPLAY_WARNING:
            return {...state, displayWarning: true, openMenu: false};

        case ACTIONS.CLOSE_WARNING:
            return {...state, displayWarning: false};

        case ACTIONS.CLOSE_SNACKBAR:
            return {...state, folderSnackbar: {...state.folderSnackbar, isOpen: false}};

        case ACTIONS.DISABLE_DELETE_BUTTON:
            return {...state, isDeleteFileButtonDisabled: true};

        default:
            return state;
    }
}

const initialState = {
    openMenu: false,
    displayWarning: false,
    anchorEl: null,
    folderSnackbar: {content: "", type: "", isOpen: false},
    isDeleteFileButtonDisabled: false
}

const FileTableRow = ({folder, mainActions, mainDispatcher}) => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);

    const updateRoutes = (name) => {
        mainDispatcher({type: mainActions.ADD_NEW_ROUTE, route: name});
    }

    const download = () => {
        downloadFolder(folder.id)
            .then(response => {
                dispatch({type: ACTIONS.CLOSE_MENU});
                const url = window.URL.createObjectURL(
                    new Blob([response.data], {type: response.headers.["content-type"]})
                );

                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", folder.folderName+".zip");
                document.body.appendChild(link);
                link.click();
            })
    }

    const deleteFolderById = () => {
        dispatch({type: ACTIONS.DISABLE_DELETE_BUTTON});
        deleteFolder(folder.id)
            .then(_ => mainDispatcher({type: mainActions.DELETE_FOLDER, id: folder.id, folderName: folder.folderName}))
            .catch(_ => mainDispatcher({type: mainActions.DELETE_FOLDER_FAILURE, folderName: folder.folderName}))
    }

    return (
        <>
        <TableRow className={classes.folderRow}>
            <TableCell className={classes.title} onClick={() => updateRoutes(folder.folderName)}>
                <Box className={classes.titleBox}>
                    <Folder className={classes.folderIcon}/>
                    <Typography>{folder.folderName}</Typography>
                </Box>
            </TableCell>
            <Hidden mdDown>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
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
            <DialogTitle>Delete folder {folder.folderName}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Deleting this folder will delete all the files and folders that are inside of it, are you
                    sure you want to delete this folder?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant={"contained"} color={"secondary"} onClick={() => dispatch({type: ACTIONS.CLOSE_WARNING})}>
                    Cancel
                </Button>
                <Button variant={"outlined"} color={"primary"} onClick={deleteFolderById}
                disabled={state.isDeleteFileButtonDisabled}>
                    Delete folder
                </Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

export default FileTableRow;