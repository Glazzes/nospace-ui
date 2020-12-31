import React from 'react'
import {useStyles} from '../styles/FilesTableStyles';
import {Hidden, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@material-ui/core';
import FileTableRow from './FileTableRow';
import FolderTableRow from './FolderTableRow';
import GoBackCell from './GoBackCell';

const FilesTable = ({ACTIONS, mainSectionRoutes, mainSectionDispatch, files, folders}) => {
    const classes = useStyles();

    return (
        <TableContainer className={classes.container}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.fileTitle}><Typography>File name</Typography></TableCell>
                        <Hidden mdDown>
                            <TableCell className={classes.headTitle}><Typography>size</Typography></TableCell>
                            <TableCell className={classes.headTitle}><Typography>Last modified</Typography></TableCell>
                        </Hidden>
                        <TableCell className={classes.headTitle}><Typography>options</Typography></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {mainSectionRoutes.length > 1 && 
                        <GoBackCell  ACTIONS={ACTIONS} mainSectionDispatch={mainSectionDispatch} />
                    }
                    {folders.map( folder => <FolderTableRow key={folder.id} folder={folder} 
                    mainSectionDispatch={mainSectionDispatch} MAIN_ACTIONS={ACTIONS}
                    /> )}

                    {files.map( file => <FileTableRow key={file.id} file={file}
                    mainSectionDispatch={mainSectionDispatch} MAIN_ACTIONS={ACTIONS}/>)}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default FilesTable;
