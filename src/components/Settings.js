import {Avatar, Badge, Box, Button, Container, Paper} from '@material-ui/core'
import React, {useContext, useEffect, useReducer} from 'react';
import {useStyles} from "../styles/SettingsStyles";
import {Formik, Form} from 'formik';
import {GlobalContext} from "./GlobalState";
import * as yup from 'yup';
import FormTextField from "./FormTextField";
import MySnackbar from "./MySnackbar";
import {getCurrentUser} from "../utils/authenticationUtil";
import {ImageSearch, NavigateBefore, Save} from "@material-ui/icons";

function reducer(state, action){
    switch (action.type){
        case ACTIONS.CLOSE_SNACKBAR:
            return {...state, snackbar: {...state.snackbar, isOpen: false}};

        case ACTIONS.UPDATE_AVATAR:
            return {...state, avatarUrl: action.avatarUrl};

        case ACTIONS.SET_IMAGE:
            return {...state, avatarImage: action.imageFile};

        case ACTIONS.FAILED_REQUEST:
            return {...state, snackbar: {
                content: "Couldn't not retrieve user info", type: "error", isOpen: true}}

        default:
            return state;
    }
}

const ACTIONS = {
    UPDATE_AVATAR: "update_avatar",
    FAILED_REQUEST: "failed_request",
    CLOSE_SNACKBAR: "close_snackbar",
    SET_IMAGE: "set_image"
}

const initialState = {
    snackbar: {content: "", type: "", isOpen: false},
    avatarUrl: "",
    avatarImage: null
}

const Settings = () => {
    const classes = useStyles();
    const [state, setState] = useContext(GlobalContext);
    const [compState, dispatch] = useReducer(reducer, initialState);

    const displayPreview = (event) => {
        const fileReader = new FileReader();
        const file = event.target.files[0];
        dispatch({type: ACTIONS.SET_IMAGE, imageFile: file});

        fileReader.onload = function (){
            dispatch({type: ACTIONS.UPDATE_AVATAR, avatarUrl: fileReader.result});
        }

        fileReader.readAsDataURL(file);
    }

    const validationSchema = yup.object({
        username: yup.string().min(3).max(50).required(),
        password: yup.string().min(8).max(100).required(),
        retype: yup.string().min(8).max(100).required(),
    })

    useEffect(() => {
        getCurrentUser()
            .then(response => setState(response.data))
            .catch(_ => dispatch({type: ACTIONS.FAILED_REQUEST}));
    }, [])

    return (
        <>
            <Formik
                initialValues={{username: "Hello", password: "glazeglaze", retype: "glazeglaze"}}
                onSubmit={(values, {setSubmitting, resetForm, setErrors}) => {
                    setSubmitting(true);

                    if(state.currentUser.profilePicture !== compState.avatarUrl){
                        console.log("They're different pictures");
                    }

                    setTimeout(() => {
                        setSubmitting(false);
                    }, 2000);
                }}
                validationSchema={validationSchema}
                validate={(values) => {
                    const errors = {};
                    if(values.password !== values.retype) errors.password = "Passwords don't match";
                    return errors;
                }}>
                {({values, isSubmitting}) => (
                    <Form className={classes.form}>
                        <Paper elevation={6} className={classes.paper}>
                            <Container maxWidth={"sm"} className={classes.container}>
                                <Box className={classes.avatarBox}>
                                    <label htmlFor={"pick-image"}>
                                        <Badge overlap={"circle"} anchorOrigin={{vertical: "bottom", horizontal:"right"}}
                                               badgeContent={<ImageSearch className={classes.badgeIcon}/>}>
                                            <Avatar src={compState.avatarUrl}
                                                    alt={`${state.currentUser.profilePicture}'s profile picture`}
                                                    className={classes.avatar}/>
                                        </Badge>
                                    </label>
                                </Box>
                                <input id={"pick-image"} type={"file"} accept={"image/*"} hidden onChange={displayPreview}/>

                                <FormTextField label={"Username"} type={"text"} name={"username"}
                                               value={values.username}/>

                                <FormTextField label={"Username"} type={"password"} name={"password"}
                                               value={values.password}/>

                                <FormTextField label={"Username"} type={"password"} name={"retype"}
                                               value={values.retype}/>

                                <Box className={classes.buttonBox}>
                                    <Button variant={"contained"} color={"secondary"} startIcon={<NavigateBefore/>}>
                                        Go back
                                    </Button>
                                    <Button variant={"contained"} color={"primary"} type={"submit"}
                                            endIcon={<Save/>} disabled={isSubmitting}>
                                        Save changes
                                    </Button>
                                </Box>
                            </Container>
                        </Paper>
                    </Form>
                )}
            </Formik>

            <MySnackbar open={compState.snackbar.isOpen} type={compState.snackbar.type}
                        content={compState.snackbar.content} close={() => dispatch({type: ACTIONS.CLOSE_SNACKBAR})} />
        </>
    )
}

export default Settings;