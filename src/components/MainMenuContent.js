import { List, ListItem, ListItemIcon, Typography, makeStyles } from '@material-ui/core';
import {AccountCircle, History, Home} from '@material-ui/icons';
import {Link} from 'react-router-dom';
import React from 'react'

const useStyles = makeStyles(theme => ({
    link: {
        textDecoration: "none",
        color: theme.palette.text.primary
    }
}))

const MainMenuContent = ({setOpen}) => {
    const classes = useStyles();

    return (
        <List>
            <Link to={"/me"} className={classes.link}>
                <ListItem button onClick={() => setOpen(false)}>
                    <ListItemIcon><Home/></ListItemIcon>
                    <Typography>My content</Typography>
                </ListItem>
            </Link>

            <Link to={"/me/edit"} className={classes.link}>
                <ListItem button onClick={() => setOpen(false)}>
                    <ListItemIcon><AccountCircle/></ListItemIcon>
                    <Typography>Edit account</Typography>
                </ListItem>
            </Link>

            <Link to={"/me/historial"} className={classes.link}>
                <ListItem button onClick={() => setOpen(false)}>
                    <ListItemIcon><History/></ListItemIcon>
                    <Typography>File download hisotry</Typography>
                </ListItem>
            </Link>
        </List>
    )
}

export default MainMenuContent;
