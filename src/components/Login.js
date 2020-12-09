import { Button, Grid, Link, Snackbar, TextField, Typography } from '@material-ui/core';
import { AccountCircle, Lock } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import {useStyles} from '../styles/LoginStyles';
import {login} from '../utils/authenticationUtil';

const Login = ({history}) => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const closeEror = () => {setOpen(false)}

    const [user, setUser] = useState({username: "", password: ""});

    const updateUser = (event) => {
        const fieldName = event.target.name;
        const currentValue = event.target.value;
        setUser({...user, [fieldName]: currentValue});
    }

    const logMe = (event) => {
        event.preventDefault();

        login(user)
        .then(_ => history.push("/"))
        .catch(_ => setOpen(true))
    }

    return (
        <>
        <div className={classes.bg}></div>
        <form className={classes.form} onSubmit={logMe}>
            <Typography variant="h4" color="secondary" align="center">Login</Typography>
            <Grid container alignItems="flex-end"  className={classes.formInput}>
                <Grid item>
                    <AccountCircle />
                </Grid>
                <Grid item>
                    <TextField label="username" className={classes.input} name="username" 
                        onChange={updateUser}
                    />
                </Grid>
            </Grid>
            <Grid container alignItems="flex-end" className={classes.formInput}>
                <Grid item>
                    <Lock />
                </Grid>
                <Grid item>
                    <TextField label="password" className={classes.input} name="password" 
                         onChange={updateUser} type="password"
                    />
                </Grid>
            </Grid>
            
            <Button variant="contained" color="secondary" className={classes.btn}
            type="submit"
            >Login
            </Button>

            <Link color="secondary" className={classes.link}>Need an account?</Link>
            <Link color="secondary" className={classes.link}>Sign up</Link>
        </form>

        <Snackbar open={open}  onClose={closeEror}
        anchorOrigin={{vertical: "top", horizontal: "center"}} message="bad credentials">
         <  Alert severity="error" onClose={closeEror}>
                Bad credentials
            </Alert>
        </Snackbar>
        </>
    )
}

export default Login;
