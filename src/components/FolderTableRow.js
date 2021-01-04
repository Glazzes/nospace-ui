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
import MySnackbar from "./MySnackbar";

const ACTIONS = {
    OPEN_MENU: "display_menu",
    CLOSE_MENU: "close_menu",
    OPEN_WARNING: "open_warning",
    CLOSE_WARNING: "close_warning",
    CLOSE_SNACKBAR: "close_snackbar",
    FOLDER_DELETE_SUCCESS: "folder_delete_success",
    FOLDER_DELETE_FAILURE: "folder_delete_failure",
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
            return {...state, snackbar: {...state.snackbar, isOpen: false}};

        case ACTIONS.FOLDER_DELETE_SUCCESS:
            return {...state, snackbar: {content: `${action.folderName} was deleted successfully`,
                    type: "error", isOpen: true}};

        case ACTIONS.FOLDER_DELETE_FAILURE:
            return {...state, snackbar: {content: `${action.folderName} couldn\t be deleted`, type: "error",
                isOpen: true}};

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
    snackbar: {content: "", type: "", isOpen: false},
    isDeleteFileButtonDisabled: false
}

const FileTableRow = ({MAIN_ACTIONS, folder, mainSectionDispatch}) => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);

    const updateRoutes = (name) => {
        mainSectionDispatch({type: MAIN_ACTIONS.ADD_NEW_ROUTE, route: name})
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
            .then(_ => {
                dispatch({type: ACTIONS.FOLDER_DELETE_SUCCESS, folderName: folder.folderName})
                mainSectionDispatch({type: MAIN_ACTIONS.REMOVE_FOLDER, folderId: folder.id, 
                    folderName: folder.folderName});
            })
            .catch( _ => {
                dispatch({type: ACTIONS.FOLDER_DELETE_FAILURE, folderName: folder.folderName});
                mainSectionDispatch({type: MAIN_ACTIONS.REMOVE_FOLDER_FAILURE, folderName: folder.folderName})
            })
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

            <MySnackbar open={state.snackbar.isOpen} content={state.snackbar.content} type={state.snackbar.type}
             close={() => dispatch({type: ACTIONS.CLOSE_SNACKBAR})} />
        </>
    )
}

export default FileTableRow;