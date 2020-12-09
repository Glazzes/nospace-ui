import { Box, Button, Fade, Hidden, IconButton, Menu, MenuItem, Modal, 
        TableCell, TableRow, Typography, Snackbar } from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import { Folder, MoreHoriz } from '@material-ui/icons';
import {useStyles} from '../styles/TableRowStyles';
import React, {useReducer} from 'react';
import {deleteFolder} from '../utils/contentUtil';
import MySnackbar from './MySnackbar';

const ACTIONS = {
    OPEN_MENU: "display_menu",
    CLOSE_MENU: "close_menu",
    OPEN_WARNING: "open_warning",
    CLOSE_WARNING: "close_warning",
    DELETE_FOLDER_SUCCESS: "delete_folder_success",
    CLOSE_SNACK: "close_snack"
}

function reducer(state, action){
    switch(action.type){
        case ACTIONS.OPEN_MENU:
            return {...state, openMenu: true, anchorEl: action.anchorEl.currentTarget};

        case ACTIONS.CLOSE_MENU:
            return {...state, anchorEl: null, openMenu: false};

        case ACTIONS.OPEN_WARNING:
            return {...state, openWarning: true, openMenu: false};

        case ACTIONS.CLOSE_WARNING:
            return {...state, openWarning: false};

        case ACTIONS.CLOSE_SNACK:
            return {...state, openSnack: false}

        case ACTIONS.DELETE_FOLDER_SUCCESS:
            return {...state, openSnack: true}

        default:
            return state;
    }
}

const initialState = {
    openMenu: false,
    openWarning: false,
    anchorEl: null,
    openSnack: false,
    snackContent: {content: "folder deleted", type: "success"}
}

const FileTableRow = ({MAIN_ACTIONS, folder, mainSectionDispatch}) => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);

    const updateRoutes = (name) => {
        mainSectionDispatch({type: MAIN_ACTIONS.ADD_NEW_ROUTE, route: name})
    }

    const deleteFolderById = () => {
        deleteFolder(folder.id)
            .then(_ => {
                dispatch({type: ACTIONS.DELETE_FOLDER_SUCCESS});
                mainSectionDispatch({type: MAIN_ACTIONS.REMOVE_FOLDER, folderId: folder.id});
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
            <MenuItem onClick={() => dispatch({type: ACTIONS.CLOSE_WARNING})}>Download</MenuItem>
            <MenuItem onClick={() => dispatch({type: ACTIONS.OPEN_WARNING})}>Delete</MenuItem>
        </Menu>

        <Modal open={state.openWarning} onClose={() => dispatch({type: ACTIONS.CLOSE_MENU})} >
            <Fade in={state.openWarning}>
                <div className={classes.warning}>
                    <Typography align="center">
                        Deleting this folder will delete all it's subfolders and all files inside of them,
                        are you sure you want to delete this folder?
                    </Typography>
                    <Box className={classes.warningBox}>
                        <Button variant="contained" color="secondary"
                        onClick={() => dispatch({type: ACTIONS.CLOSE_WARNING})}>
                            Cancel
                        </Button>

                        <Button variant="outlined" color="primary"
                        onClick={deleteFolderById}>
                            Delete folder
                        </Button>
                    </Box>
                </div>
            </Fade>
        </Modal>

        <Snackbar open={state.openSnack} anchorOrigin={{vertical: "top", horizontal: "center"}}>
            <Alert severity="success" onClose={() => dispatch({type: ACTIONS.CLOSE_SNACK})}>
                Hello world
            </Alert>
        </Snackbar>

        </>
    )
}

export default FileTableRow;