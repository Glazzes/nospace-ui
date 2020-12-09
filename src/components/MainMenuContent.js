import { List, ListItem, ListItemIcon, Typography } from '@material-ui/core';
import { History, Home, Settings } from '@material-ui/icons';
import React from 'react'

const MainMenuContent = ({setOpen}) => {
    return (
        <List>
            <ListItem button onClick={() => setOpen(false)}>
                <ListItemIcon><Home/></ListItemIcon>
                <Typography>Home</Typography>
            </ListItem>

            <ListItem button onClick={() => setOpen(false)}>
                <ListItemIcon><History/></ListItemIcon>
                <Typography>History</Typography>
            </ListItem>

            <ListItem button onClick={() => setOpen(false)}>
                <ListItemIcon><Settings/></ListItemIcon>
                <Typography>Settings</Typography>
            </ListItem>
        </List>
    )
}

export default MainMenuContent;
