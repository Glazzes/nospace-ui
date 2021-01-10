import React from "react";
import {TextField} from "@material-ui/core";
import {useField} from "formik";
import {useStyles} from "../styles/SettingsStyles";

const FormTextField = ({label, type, ...props}) => {
    const classes = useStyles();

    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";

    return <TextField {...field} label={label} type={type} helperText={errorText}
     className={classes.input}/>
}

export default FormTextField;