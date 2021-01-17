import {Avatar, Badge, Box, Button, Container, Divider, Paper} from '@material-ui/core'
import React, {useContext, useEffect, useReducer, useState} from 'react';
import {useStyles} from "../styles/SettingsStyles";
import {Link} from 'react-router-dom';
import {Formik, Form} from 'formik';
import {GlobalContext} from "./GlobalState";
import * as yup from 'yup';
import FormTextField from "./FormTextField";
import MySnackbar from "./MySnackbar";
import {editUserAccount, getCurrentUser} from "../utils/UserUtils";
import {ImageSearch, NavigateBefore, Save} from "@material-ui/icons";
import {submitNewProfilePicture} from "../utils/UserUtils";
import {Skeleton} from "@material-ui/lab";

function reducer(state, action){
    switch (action.type){
        case ACTIONS.CLOSE_SNACKBAR:
            return {...state, snackbar: {...state.snackbar, isOpen: false}};

        case ACTIONS.UPDATE_AVATAR:
            return {...state, avatarUrl: action.avatarUrl};

        case ACTIONS.SET_IMAGE:
            return {...state, avatarImage: action.imageFile};

        case ACTIONS.PPF_REQUEST_SUCCESS:
            return {...state,
                snackbar: {content: "Profile picture updated successfully!", type: "success", isOpen: true}
            }

        case ACTIONS.PPF_REQUEST_FAILURE:
            return {...state,
                snackbar: {content: "Couldn't update profile picture, try later!", type: "error", isOpen: true}
            }

        case ACTIONS.FAILED_REQUEST:
            return {...state, snackbar: {
                content: "Couldn't not retrieve user info", type: "error", isOpen: true}}

        case ACTIONS.ACCOUNT_EDITED_SUCCESS:
            return {...state, snackbar: {
                content: "Your account has been successfully updated!", type: "success", isOpen: true}}

        case ACTIONS.ACCOUNT_EDITED_FAILURE:
            return {...state, snackbar: {
                    content: "Couldn't update your account", type: "error", isOpen: true}}

        default:
            return state;
    }
}

const ACTIONS = {
    UPDATE_AVATAR: "update_avatar",
    FAILED_REQUEST: "failed_request",
    CLOSE_SNACKBAR: "close_snackbar",
    SET_IMAGE: "set_image",
    PPF_REQUEST_SUCCESS: "ppf_request_success",
    PPF_REQUEST_FAILURE: "ppf_request_failure",
    ACCOUNT_EDITED_SUCCESS: "account_edited_success",
    ACCOUNT_EDITED_FAILURE: "account_edited_failure"
}

const initialState = {
    snackbar: {content: "", type: "", isOpen: false},
    avatarUrl: "",
    avatarImage: null
}

const Settings = () => {
    const classes = useStyles();
    const [state, setState] = useContext(GlobalContext);
    const [formikValues, setFormikVales] = useState({username: "", newPassword: "", retypeNewPassword: ""})
    const [isLoading, setIsLoading] = useState(true);
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
        newPassword: yup.string().min(8).max(100),
        retypeNewPassword: yup.string().min(8).max(100)
    })

    useEffect(() => {
        getCurrentUser()
            .then(response => {
                dispatch({type: ACTIONS.UPDATE_AVATAR, avatarUrl: response.data.profilePicture});
                setFormikVales({...formikValues, username: response.data.nickname});
                setState({...state, currentUser: response.data});
                setIsLoading(false);
            })
            .catch(_ => dispatch({type: ACTIONS.FAILED_REQUEST}));
    }, [])

    return (
        <React.Fragment>
            <Formik
                enableReinitialize
                initialValues={formikValues}
                onSubmit={(values, {setSubmitting, resetForm}) => {
                    if(compState.avatarImage){
                        setSubmitting(true);
                        submitNewProfilePicture(compState.avatarImage)
                            .then(response => {
                                setState({...state, currentUser: response.data});
                                dispatch({type: ACTIONS.PPF_REQUEST_SUCCESS})
                                dispatch({type: ACTIONS.UPDATE_AVATAR, avatarUrl: response.data.profilePicture});
                                setSubmitting(false);
                            })
                            .catch(_ => {
                                dispatch({type: ACTIONS.PPF_REQUEST_FAILURE})
                                setSubmitting(false);})
                    }

                    if(values.username || (values.newPassword && values.retypeNewPassword)){
                        setSubmitting(true);
                        editUserAccount({username: values.username, password: values.password})
                            .then(response => {
                                dispatch({type: ACTIONS.ACCOUNT_EDITED_SUCCESS})
                                setState({...state, currentUser: response.data});
                                setSubmitting(false);
                                resetForm();
                            }).catch(error => {
                                console.log(error.response.data);
                                dispatch({type: ACTIONS.ACCOUNT_EDITED_FAILURE});
                                setSubmitting(false);

                        });
                    }

                }}
                validationSchema={validationSchema}
                validate={(values) => {
                    const errors = {};
                    if(values.newPassword !== values.retypeNewPassword) errors.newPassword = "Passwords don't match";
                    return errors;
                }}>
                {({values, isSubmitting}) => (
                    <Form className={classes.form}>
                        <Paper elevation={6} className={classes.paper}>
                            <Container maxWidth={"sm"} className={classes.container}>
                                <Box className={classes.avatarBox}>
                                    {isLoading ?
                                        <Skeleton height={100} width={100} variant={"circle"} />
                                        :
                                        <label htmlFor={"pick-image"}>
                                            <Badge overlap={"circle"} anchorOrigin={{vertical: "bottom", horizontal:"right"}}
                                                   badgeContent={<ImageSearch className={classes.badgeIcon}/>}>
                                                <Avatar src={compState.avatarUrl}
                                                        alt={`${state.currentUser.profilePicture}'s profile picture`}
                                                        className={classes.avatar}/>
                                            </Badge>
                                        </label>
                                    }
                                </Box>
                                <input id={"pick-image"} type={"file"} accept={"image/*"} hidden onChange={displayPreview}/>

                                <FormTextField label={"Username"} type={"text"} name={"username"}
                                               value={values.username}/>

                                <Divider className={classes.divider}/>

                                <FormTextField label={"New password"} type={"password"} name={"newPassword"}
                                               value={values.newPassword}/>

                                <FormTextField label={"Retype new password"} type={"password"} name={"retypeNewPassword"}
                                               value={values.retypeNewPassword}/>

                                <Box className={classes.buttonBox}>
                                    <Link to={"/me"} className={classes.link}>
                                        <Button variant={"contained"} color={"secondary"} startIcon={<NavigateBefore/>}>
                                            Go back
                                        </Button>
                                    </Link>

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
        </React.Fragment>
    )
}

export default Settings;