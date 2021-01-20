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
import {useStyles} from '../../styles/TableRowStyles';
import React, {useReducer} from 'react'
import {deleteFile, downloadFile} from '../../utils/FileUtils';
import {convertBytesToReadableSize} from '../../utils/FolderUtils';
import RenameFileDialog from "./RenameFileDialog";
import EventEmitter, {EventConstants} from "../../utils/EventEmitter";
import FilesTableRowActions from "./FilesTableRowActions";
import filesTableRowReducer from "./FilesTableRowReducer";

import MainSectionActions from "../MainSection/MainSecionActions";

const initialState = {
    openMenu: false,
    anchorEl: null,
    displayWarning: false,
    isDeleteFileButtonDisabled: false,
    openRenameDialog: false
}

const FileTableRow = ({allFiles, file}) => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(filesTableRowReducer, initialState);

    const deleteFileById = () => {
        dispatch({type: FilesTableRowActions.DISABLE_DELETE_BUTTON});
        deleteFile(file.id)
            .then(_ => EventEmitter.emit(EventConstants.REMOVE_FILE_BY_ID, {
                type: MainSectionActions.REMOVE_FILE_BY_ID, id: file.id, filename: file.filename
            }))
            .catch(_ => EventEmitter.emit(EventConstants.REMOVE_FILE_BY_ID_FAILURE, {
                type: MainSectionActions.REMOVE_FILE_BY_ID_FAILURE, filename: file.filename
            }));
    }

    const download = () => {
        downloadFile(file.id)
            .then(response => {
                dispatch({type: FilesTableRowActions.CLOSE_MENU});
                const url = window.URL.createObjectURL(
                    new Blob([response.data], {type: response.headers.["content-type"]}));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", file.filename);
                document.body.appendChild(link);
                link.click();
            })
            .catch(_ => {
                dispatch({type: FilesTableRowActions.CLOSE_MENU});
                EventEmitter.emit(EventConstants.FILE_DOWNLOAD_FAILURE, {
                    type: MainSectionActions.FILE_DOWNLOAD_FAILURE, filename: file.filename });
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
                        onClick={(event) => dispatch({type: FilesTableRowActions.OPEN_MENU, anchorEl: event})}>
                        <MoreHoriz fontSize="small"/>
                    </IconButton>
                </TableCell>
            </TableRow>

        <Menu id="options" anchorOrigin={{vertical: "bottom", horizontal: "left"}}
            open={state.openMenu} anchorEl={state.anchorEl} 
            onClose={() => dispatch({type: FilesTableRowActions.CLOSE_MENU})}
        >
            <MenuItem onClick={download}>Download</MenuItem>
            <MenuItem onClick={() => dispatch({type: FilesTableRowActions.OPEN_RENAME_DIALOG})}>Rename</MenuItem>
            <MenuItem onClick={() => dispatch({type: FilesTableRowActions.DISPLAY_WARNING})}>Delete</MenuItem>
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
                         onClick={() => dispatch({type: FilesTableRowActions.CLOSE_WARNING})}>
                     Cancel
                 </Button>
                 <Button variant={"outlined"} color={"primary"} onClick={deleteFileById}
                 disabled={state.isDeleteFileButtonDisabled}>
                     Delete file
                 </Button>
             </DialogActions>
         </Dialog>

         <RenameFileDialog file={file} open={state.openRenameDialog}
                           close={() => dispatch({type: FilesTableRowActions.CLOSE_DIALOG})}
                           dispatch={dispatch}
                           actions={FilesTableRowActions} allFiles={allFiles}/>
        </>
    )
}

export default FileTableRow;
