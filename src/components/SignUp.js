import { Button, Grid, Link, TextField, Typography } from '@material-ui/core';
import { AccountCircle, Email, Lock } from '@material-ui/icons';
import React, { useReducer } from 'react';
import {useStyles} from '../styles/LoginStyles';
import {signUp} from '../utils/authenticationUtil';
import MySnackbar from './MySnackbar';

const ACTIONS = {
    UPDATE_USER: "update_user",
    RESET_USER: "reset_user",
    OPEN_BANNER_ON_FAILURE: "open_banner_on_failure",
    OPEN_BANNER_ON_SUCCESS: "open_banner_on_success",
    CLOSE_BANNER: "close_banner",
    SET_ERRORS: "errors"
}

function reducer(state, action){
    switch(action.type){
        case ACTIONS.UPDATE_USER: 
            const value = action.event.target.value;
            const name = action.event.target.name;
            return {...state, user: {...state.user, [name]: value}}

        case ACTIONS.OPEN_BANNER_ON_FAILURE:
            return {...state, snackContent: {
                ...state.content, severity: "error", content: "Invalid data, try again"
            }, openSnack: true}

        case ACTIONS.OPEN_BANNER_ON_SUCCESS:
            return {...state, snackContent: {
                ...state.content, severity: "success", content: "Account created succesfuly, check your email!"
            }, openSnack: true, errors: []}

        case ACTIONS.CLOSE_BANNER:
            return {...state, openSnack: false, errors: []}
        
        case ACTIONS.RESET_USER:
            return {...state, user: {username: "", password: "", email: ""}}

        case ACTIONS.SET_ERRORS:
            return {...state, errors: action.errors}

        default:
            return state;
    }
}

const initialState = {
    user: {username: "", password: "", email: ""},
    openSnack: false,
    snackContent: {severity: "", content: ""},
    errors: []
}

const SignUp = () => {
    const classes = useStyles();

    const [state, dispatch] = useReducer(reducer, initialState);

    const createNewUser = (event) => {
        event.preventDefault();
        signUp(state.user)
        .then(_ => {
            dispatch({type: ACTIONS.OPEN_BANNER_ON_SUCCESS})
            dispatch({type: ACTIONS.RESET_USER})
        })
        .catch(err => {
            dispatch({type: ACTIONS.SET_ERRORS, errors: err.response.data.errors})
            dispatch({type: ACTIONS.OPEN_BANNER_ON_FAILURE})
        });
    }

    const displayErrors = (field) => {
        return state.errors.filter( error => error.field === field )
        .map( (error, index) => <p key={index}>{error.defaultMessage}</p> )
    }

    return (
        <>
        <div className={classes.bg}></div>
        <form className={classes.form} onSubmit={createNewUser}>
            <Typography variant="h4" color="secondary" align="center">Sign Up</Typography>
            <Grid container alignItems="flex-end" className={classes.formInput}>
                <Grid item>
                    <Email />
                </Grid>
                <Grid item>
                    <TextField name="email" label="email" className={classes.input} 
                    value={state.user.email}
                    onChange={(event) => dispatch({type: ACTIONS.UPDATE_USER, event: event})}/>
                </Grid>
                <Grid item>
                    {state.errors.length > 0 && displayErrors("email") }
                </Grid>
            </Grid>

            <Grid container alignItems="flex-end"  className={classes.formInput}>
                <Grid item>
                    <AccountCircle />
                </Grid>
                <Grid item>
                    <TextField name="username" label="username" className={classes.input}
                    value={state.user.username}
                    onChange={(event) => dispatch({type: ACTIONS.UPDATE_USER, event: event})}/>
                </Grid>
                <Grid item>
                    {state.errors.length > 0 && displayErrors("username") }
                </Grid>
            </Grid>
            <Grid container alignItems="flex-end" className={classes.formInput}>
                <Grid item>
                    <Lock />
                </Grid>
                <Grid item>
                    <TextField name="password" label="password" type="password" className={classes.input} 
                    value={state.user.password}
                    onChange={(event) => dispatch({type: ACTIONS.UPDATE_USER, event: event})}/>
                </Grid>
                <Grid item>
                    {state.errors.length > 0 && displayErrors("password") }
                </Grid>
            </Grid>

            <Button variant="contained" color="secondary" className={classes.btn}
            type="submit"
            >Sing up
            </Button>
            <Link color="secondary" className={classes.link}>Sign up</Link>
        </form>

        <MySnackbar open={state.openSnack} type={state.snackContent.severity}
        content={state.snackContent.content}
        close={() => dispatch({type: ACTIONS.CLOSE_BANNER})} />        
        </>
    )
}

export default SignUp;