import {Button, Container, Divider, Link, Paper, Snackbar, TextField, Typography} from '@material-ui/core';
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
        console.log(user);
    }

    const logMe = (event) => {
        event.preventDefault();

        login(user)
        .then(_ => history.push("/"))
        .catch(_ => setOpen(true))
    }

    return (
        <>
            <div className={classes.bg} />
        <form onSubmit={(event) => logMe(event)} className={classes.login}>
            <Paper elevation={6}>
                <Container maxWidth={"md"} className={classes.container}>
                    <Typography variant={"h6"} color={"secondary"} align={"center"} gutterBottom>Log in!</Typography>
                    <TextField label={"Username"} onChange={(event) =>  updateUser(event)}
                    className={classes.input} name={"username"}/>
                    <TextField label={"Password"} onChange={(event) =>  updateUser(event)}
                    className={classes.input} type={"password"} name={"password"}/>
                    <Button variant={"contained"} color={"secondary"} className={classes.btn} type={"submit"}>
                        Log me in!
                    </Button>
                    <Divider/>
                    <Link color={"secondary"}>Don't you have and account?</Link>
                </Container>
            </Paper>
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
