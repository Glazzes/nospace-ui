import React, {useEffect} from 'react'
import {useStyles} from '../styles/FilesTableStyles';
import {Hidden, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@material-ui/core';
import FileTableRow from './FileTableRow/FileTableRow';
import FolderTableRow from './FolderTableRow/FolderTableRow';
import GoBackCell from './GoBackCell';

const FilesTable = ({mainDispatcher, mainRoutes, files, folders}) => {
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
                    {mainRoutes.length > 1 && <GoBackCell mainDispatcher={mainDispatcher}/>}

                    {folders.map( folder => <FolderTableRow key={folder.id} folder={folder}
                    mainDispatcher={mainDispatcher}/>)}

                    {files.map( file => <FileTableRow key={file.id} file={file} allFiles={files}
                    mainDispatcher={mainDispatcher}/>)}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default React.memo(FilesTable);