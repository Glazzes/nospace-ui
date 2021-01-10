import {Button, Container, Divider, Link, Paper, TextField, Typography} from '@material-ui/core';
import React, {useState} from 'react';
import {useStyles} from '../styles/LoginStyles';
import {Formik, Form, useField} from 'formik';
import {login} from '../utils/authenticationUtil';
import MySnackbar from "./MySnackbar";
import * as yup from "yup";

const CustomTextField = ({label, type, ...props}) => {
    const classes = useStyles();
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";
    return <TextField {...field} label={label} helperText={errorText} className={classes.input} type={type}/>
}

const Login = () => {
    const classes = useStyles();
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const validationScheme = yup.object({
        username: yup.string().required(),
        password: yup.string().required()
    })

    return (
        <>
            <div className={classes.bg} />
            <Formik initialValues={{username: "", password: ""}}
            onSubmit={(values, {setSubmitting}) => {
                setSubmitting(true);
                login(values)
                    .then(_ => console.log("Log in made successfully!"))
                    .catch(_ => {
                        setSubmitting(false);
                        setOpenSnackbar(true);
                    })
            }}
            validationSchema={validationScheme}>
                {({values, isSubmitting}) => (
                    <Form className={classes.form}>
                        <Paper elevation={6} className={classes.container}>
                            <Typography gutterBottom variant={"h5"} align={"center"} color={"secondary"}>Log in!</Typography>
                            <Container maxWidth={"sm"} className={classes.container}>
                                <CustomTextField label={"Username"} name={"username"} value={values.username} type={"text"} />
                                <CustomTextField label={"Password"} name={"password"} value={values.password} type={"password"} />
                                <Button type={"submit"} variant={"contained"} color={"secondary"}
                                        className={classes.btn} disabled={isSubmitting}>
                                    Log me in
                                </Button>
                                <Divider />
                                <Link color={"secondary"}>Don't you have an account?</Link>
                            </Container>
                        </Paper>
                    </Form>
                )}
            </Formik>

            <MySnackbar open={openSnackbar}
            content={"Bad credentials"}
            type={"error"}
            close={() => setOpenSnackbar(false)}/>
        </>
    )
}

export default Login;
