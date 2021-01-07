import React, { useContext, useEffect, useState } from 'react';
import {AppBar, Toolbar, Typography, Hidden, IconButton, SwipeableDrawer, Avatar, Drawer, Divider} from '@material-ui/core';
import {useStyles} from '../styles/MainMenuStyles';
import { Menu } from '@material-ui/icons';
import MainMenuContent from './MainMenuContent';
import {GlobalContext} from './GlobalState';
import { getCurrentUser } from '../utils/authenticationUtil';
import {getUsedSpace, convertBytesToReadableSize} from '../utils/contentUtil';

const MainMenu = ({history}) => {
    const classes = useStyles();

    const [state, setState] = useContext(GlobalContext);
    const [space, setSpace] = useState(0);

    const [open, setOpen] = useState(false);
    const handleOpen = () => {setOpen(true)}
    const handleClose = () => {setOpen(false)}

    useEffect( () => {
        getUsedSpace()
            .then(response => setSpace(response.data))
            .catch(_ => console.log("Could not get the used space"));

        getCurrentUser()
        .then( response => setState({...state, currentUser: response.data}) )
        .catch(_ => history.push("/login"))

    }, [] )

    return (
        <>
        <Hidden mdUp>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <IconButton onClick={handleOpen}><Menu className={classes.menuIcon}/></IconButton>
                    <Typography style={{textTransform: "capitalize"}}>{state.currentUser.nickname + "'s"} NoSpace</Typography>
                </Toolbar>
            </AppBar>
            <SwipeableDrawer anchor="left" open={open} onOpen={handleOpen} onClose={handleClose}
                classes={{paper: classes.drawerPaper}}
            >
                <div className={classes.swipAvatarBox}>
                    <Avatar className={classes.avatar} 
                    src={state.currentUser.profilePicture}/>
                </div>
                <MainMenuContent setOpen={setOpen}/>
                <Divider />
                <div className={classes.space}>
                    <progress className={classes.progress} value={space} max={1024 * 1024 * 2014} />
                    <Typography className={classes.progresText}>
                        {convertBytesToReadableSize(space)} used out of 1GB
                    </Typography>
                </div>
            </SwipeableDrawer>
        </Hidden>
        
        <Hidden mdDown>
            <Drawer variant="permanent">
                <div className={classes.permaAvatarBox}>
                    <Avatar className={classes.avatar} src={state.currentUser.profilePicture}/>
                </div>
                <MainMenuContent/>
                <Divider />
                <div className={classes.space}>
                    <progress className={classes.progress} value={space} max={1024 * 1024 * 2014} />
                    <Typography className={classes.progresText}>
                        {convertBytesToReadableSize(space)} used out of 1GB
                    </Typography>
                </div>
            </Drawer>
        </Hidden>
        </>
    )
}

export default MainMenu;