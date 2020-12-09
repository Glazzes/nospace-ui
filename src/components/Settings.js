import { Avatar, Button, TextField } from '@material-ui/core'
import React from 'react';
import {useStyles} from '../styles/SettingsStyles';

const Settings = () => {
    const classes = useStyles();

    return (
        <div>
            <label htmlFor="picture">
                <Avatar src="../assets/scree.png" className={classes.avatar} />
            </label>
            <input id="picture" hidden type="file" accept="image/*"/>

            <form className={classes.form}>
                <TextField label="username" className={classes.input}/>
                <TextField label="email" className={classes.input} />
                <TextField label="password" className={classes.input} />
                <TextField label="repeat password" className={classes.input} />
                <Button type="submit" variant="outlined" color="secondary" className={classes.btn}>Save changes</Button>
            </form>
        </div>
    )
}

export default Settings;