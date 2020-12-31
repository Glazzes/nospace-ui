import {
    Box,
    Button, Container,
    Fade,
    Hidden,
    IconButton,
    Menu,
    MenuItem,
    Modal,
    Paper,
    TableCell,
    TableRow,
    Typography
} from '@material-ui/core'
import { FileCopy, MoreHoriz } from '@material-ui/icons'
import {useStyles} from '../styles/TableRowStyles';
import React, {useReducer} from 'react'
import {deleteFile, downloadFile} from '../utils/contentUtil';

const ACTIONS = {
    OPEN_MENU: "open_menu",
    CLOSE_MENU: "close_menu",
    DISPLAY_WARNING: "display_warning",
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
    modal: {content: "", action: ""},
}

const FileTableRow = ({MAIN_ACTIONS, file, mainSectionDispatch}) => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);

    const deleteFileById = () => {
        deleteFile(file.id)
            .then(_ => {
                mainSectionDispatch({type: MAIN_ACTIONS.REMOVE_FILE, fileId: file.id, filename: file.filename})
            })
            .catch(_ => {
                mainSectionDispatch({type: MAIN_ACTIONS.REMOVE_FILE_FAILURE, filename: file.filename})
            })
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
            <MenuItem onClick={download}>Download</MenuItem>
            <MenuItem onClick={() => dispatch({type: ACTIONS.DISPLAY_WARNING})}>Delete</MenuItem>
        </Menu>

        <Modal open={state.displayWarning} onClose={() => dispatch({type: ACTIONS.CLOSE_WARNING})}
        className={classes.warning}>
            <Fade in={state.displayWarning}>
                <Paper elevation={6}>
                    <Container maxWidth={"xs"} className={classes.warningContainer}>
                        <Typography gutterBottom variant={"body1"} align={"center"}>
                            Are you sure you want to delete this file?
                        </Typography>
                        <Box className={classes.warningBox}>
                            <Button variant={"contained"} color={"secondary"}
                            onClick={() => dispatch({type: ACTIONS.CLOSE_WARNING})}>
                                Cancel
                            </Button>
                            <Button variant={"outlined"} color={"primary"} onClick={deleteFileById}>
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
