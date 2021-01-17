import { TableCell, TableRow, Box, Typography, Hidden } from '@material-ui/core';
import {useStyles} from '../styles/TableRowStyles';
import React from 'react'
import { ArrowBack } from '@material-ui/icons';

import MainSectionActions from "./MainSection/MainSecionActions";

const GoBackCell = ({mainDispatcher}) => {
    const classes = useStyles();

    const goBack = () => {
        mainDispatcher({type: MainSectionActions.GO_BACK})
    }

    return (
        <TableRow className={classes.goBack} onClick={goBack}>
            <TableCell className={classes.title}>
                <Box className={classes.titleBox}>
                    <ArrowBack />
                    <Typography>Go back...</Typography>
                </Box>
            </TableCell>
            <Hidden mdDown>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
            </Hidden>
            <TableCell>
            </TableCell>
        </TableRow>
    )
}

export default GoBackCell;
