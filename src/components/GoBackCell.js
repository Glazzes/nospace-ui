import { TableCell, TableRow, Box, Typography, Hidden } from '@material-ui/core';
import {useStyles} from '../styles/TableRowStyles';
import React from 'react'
import { ArrowBack } from '@material-ui/icons';

const GoBackCell = ({ACTIONS, mainSectionDispatch}) => {
    const classes = useStyles();

    const goBack = () => {
        mainSectionDispatch({type: ACTIONS.GO_BACK});
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
                <TableCell></TableCell>
                <TableCell></TableCell>
            </Hidden>
            <TableCell>
            </TableCell>
        </TableRow>
    )
}

export default GoBackCell;
