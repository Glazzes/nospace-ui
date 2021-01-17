import {Button, Container, Paper, TextField, Typography} from '@material-ui/core';
import React, { useReducer } from 'react';
import {useStyles} from '../styles/LoginStyles';
import {signUp} from '../utils/authenticationUtil';
import MySnackbar from './MySnackbar';
import {Formik, Form, useField} from 'formik';
import * as yup from 'yup';

const CustomTextField = ({label, type, ...props}) => {
    const classes = useStyles();
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";
    return <TextField {...field} label={label} helperText={errorText} type={type} className={classes.input}/>
}

const ACTIONS = {
    OPEN_BANNER_ON_FAILURE: "open_banner_on_failure",
    OPEN_BANNER_ON_SUCCESS: "open_banner_on_success",
    CLOSE_BANNER: "close_banner",
}

function reducer(state, action){
    switch(action.type){
        case ACTIONS.OPEN_BANNER_ON_FAILURE:
            return {...state, snackContent: {
                ...state.content, severity: "error", content: "Invalid data, try again"
            }, openSnack: true}

        case ACTIONS.OPEN_BANNER_ON_SUCCESS:
            return {...state, snackContent: {
                ...state.content, severity: "success", content: "Account created succesfuly, check your email!"
            }, openSnack: true}

        case ACTIONS.CLOSE_BANNER:
            return {...state, openSnack: false}

        default:
            return state;
    }
}

const initialState = {
    openSnack: false,
    snackContent: {severity: "", content: ""}
}

const SignUp = () => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);

    const formValidation = yup.object({
        username: yup.string().required().min(5).max(10),
        email: yup.string().required().email(),
        password: yup.string().required().min(8).max(100),
        retype: yup.string().required().min(8).max(100)
    })

    return (
        <>
        <div className={classes.bg} />

        <Formik initialValues={{username: "", email: "", password: "", retype: ""}}
        validationSchema={formValidation} onSubmit={(values, {setSubmitting, resetForm, setFieldError}) => {
            setSubmitting(true);
            const user = {username: values.username, password: values.password, email: values.email};
            signUp(user)
                .then(_ => {
                    setSubmitting(false);
                    dispatch({type: ACTIONS.OPEN_BANNER_ON_SUCCESS});
                    resetForm();
                })
                .catch(errors => {
                    setSubmitting(false);
                    dispatch({type: ACTIONS.OPEN_BANNER_ON_FAILURE});
                })
        }} validate={(values) => {
            const errors = {};
            if(values.password !== values.retype) errors.retype = "Password do no match"

            return errors;
        }}>
            {({values, isSubmitting}) => (
                <Form className={classes.signup}>
                    <Paper elevation={6}>
                        <Container maxWidth={"sm"} className={classes.container}>
                            <Typography variant={"h5"} gutterBottom color={"secondary"} align={"center"}>
                                Sign up today!
                            </Typography>
                            <CustomTextField label={"Username"} name={"username"} value={values.username} type={"text"}
                            className={classes.input}/>
                            <CustomTextField label={"Email"} name={"email"} value={values.email} type={"text"}
                            className={classes.input}/>
                            <CustomTextField label={"Password"} name={"password"} value={values.password} type={"password"}
                            className={classes.input}/>
                            <CustomTextField label={"Retype your password"} name={"retype"} value={values.retype} type={"password"}
                            className={classes.input}/>
                            <Button variant={"contained"} type={"submit"} disabled={isSubmitting} color={"secondary"}
                            className={classes.btn}>
                                Create account
                            </Button>
                        </Container>
                    </Paper>
                </Form>
            )}
        </Formik>

        <MySnackbar open={state.openSnack} type={state.snackContent.severity}
        content={state.snackContent.content}
        close={() => dispatch({type: ACTIONS.CLOSE_BANNER})} />        
        </>
    )
}

export default SignUp;