import {
    Box, Button, Container, Fade, Hidden, IconButton, Menu, MenuItem, Modal, Paper,
    TableCell, TableRow, Typography
} from '@material-ui/core';
import { Folder, MoreHoriz } from '@material-ui/icons';
import {useStyles} from '../styles/TableRowStyles';
import React, {useReducer} from 'react';
import {deleteFolder, downloadFolder} from '../utils/contentUtil';

const ACTIONS = {
    OPEN_MENU: "display_menu",
    CLOSE_MENU: "close_menu",
    OPEN_WARNING: "open_warning",
    CLOSE_WARNING: "close_warning"
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

        default:
            return state;
    }
}

const initialState = {
    openMenu: false,
    displayWarning: false,
    anchorEl: null,
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
        deleteFolder(folder.id)
            .then(_ => {
                mainSectionDispatch({type: MAIN_ACTIONS.REMOVE_FOLDER, folderId: folder.id, 
                    folderName: folder.folderName});
            })
            .catch( _ => {
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

            <Modal open={state.displayWarning} onClose={() => dispatch({type: ACTIONS.CLOSE_WARNING})}
                   className={classes.warning}>
                <Fade in={state.displayWarning}>
                    <Paper elevation={6}>
                        <Container maxWidth={"xs"} className={classes.warningContainer}>
                            <Typography gutterBottom variant={"body1"} align={"center"}>
                                Are you sure you want to delete this folder? Deleting this folder will delete
                                all the files and folders contained in it.
                            </Typography>
                            <Box className={classes.warningBox}>
                                <Button variant={"contained"} color={"secondary"}
                                        onClick={() => dispatch({type: ACTIONS.CLOSE_WARNING})}>
                                    Cancel
                                </Button>
                                <Button variant={"outlined"} color={"primary"} onClick={deleteFolderById}>
                                    Delete
                                </Button>
                            </Box>
                        </Container>
                    </Paper>
                </Fade>
            </Modal>

        </>
    )
}

export default FileTableRow;