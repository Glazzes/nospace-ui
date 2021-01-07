import React, {useEffect} from 'react'
import {useStyles} from '../styles/FilesTableStyles';
import {Hidden, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@material-ui/core';
import FileTableRow from './FileTableRow';
import FolderTableRow from './FolderTableRow';
import GoBackCell from './GoBackCell';

const FilesTable = ({mainActions, mainRoutes, mainDispatcher, files, folders}) => {
    const classes = useStyles();

    useEffect(() => {
        console.log("Files table just re-rendered")
    })

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
                    {mainRoutes.length > 1 &&
                        <GoBackCell  mainActions={mainActions} mainDispatcher={mainDispatcher} />
                    }

                    {folders.map( folder => <FolderTableRow key={folder.id} folder={folder}
                    mainDispatcher={mainDispatcher} mainActions={mainActions}
                    /> )}

                    {files.map( file => <FileTableRow key={file.id} file={file}
                    mainDispatcher={mainDispatcher} mainActions={mainActions}/>)}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default FilesTable;
