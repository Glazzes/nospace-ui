import { Box, Button, Fade, Hidden, IconButton, Menu, MenuItem, Modal, TableCell, TableRow, Typography } from '@material-ui/core'
import { FileCopy, MoreHoriz } from '@material-ui/icons'
import {useStyles} from '../styles/TableRowStyles';
import React, {useReducer} from 'react'

const ACTIONS = {
    OPEN_MENU: "open_menu",
    CLOSE_MENU: "close_menu",
    DISPLAY_WARNING: "display_warning"
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

        default:
            return state;
    }
}

const initialState = {
    openMenu: false,
    anchorEl: null,
    displayWarning: false,
    modal: {content: "", action: ""}
}

const FileTableRow = ({file}) => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);

    const deleteFile = () => {
        console.log("File deleted");
    }

    return (
        <>
        <TableRow>
            <TableCell className={classes.title}>
                <Box className={classes.titleBox}>
                    <FileCopy />
                    <Typography>{file.filename}</Typography>
                </Box>
            </TableCell>
            <Hidden mdDown>
                <TableCell>{file.size}</TableCell>
                <TableCell>{file.uploaded}</TableCell>
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
            <MenuItem onClick={() => dispatch({type: ACTIONS.CLOSE_MENU})}>Download</MenuItem>
            <MenuItem onClick={() => dispatch({type: ACTIONS.DISPLAY_WARNING})}>Delete</MenuItem>
        </Menu>

        <Modal open={state.displayWarning} onClose={() => dispatch({type: ACTIONS.CLOSE_WARNING})}>
            <Fade in={state.displayWarning}>
                <div className={classes.warning} >
                    <Typography align="center">Do you really want to delete this file?</Typography>
                    <Box className={classes.warningBox}>
                        <Button variant="contained" color="secondary"
                            onClick={() => dispatch({type: ACTIONS.CLOSE_WARNING})}
                        >cancel</Button>
                        <Button variant="outlined" onClick={deleteFile}>Delete it</Button>
                    </Box>
                </div>
            </Fade>
        </Modal>
        </>
    )
}

export default FileTableRow;
