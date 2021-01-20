import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import {Form, Formik, useField} from "formik";
import {renameFile} from "../utils/FileUtils";
import * as yup from 'yup';
import {useStyles} from "../styles/MainSectionStyles";
import EventEmitter from "../utils/EventEmitter";
import {EventConstants} from "../utils/EventEmitter";
import ACTIONS from "./MainSection/MainSecionActions";

const validationSchema = yup.object({
    filename: yup.string().required()
})

const CustomTextField = ({label, disabled, ...props}) => {
    const classes = useStyles();
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";
    return <TextField {...field} label={label} helperText={errorText} variant={"outlined"} className={classes.newFolderInput} disabled={disabled}/>
}

const RenameFileDialog = ({allFiles, file, open, close}) => {

    return (
        <Dialog open={open}>
            <DialogTitle>Rename file {file.filename}</DialogTitle>
            <Formik initialValues={{filename: ""}} onSubmit={(values, {setSubmitting}) =>{
                setSubmitting(true);
                renameFile(file.id, values.filename)
                    .then(_ => {
                        EventEmitter.emit(EventConstants.FILE_RENAMED_SUCCESSFULLY, {
                            type: ACTIONS.FILE_RENAMED_SUCCESSFULLY, oldName: file.filename, newName: values.filename
                        })
                        setSubmitting(false);
                        close();
                    })
                    .catch(_ => {
                        EventEmitter.emit(EventConstants.FILE_RENAME_FAILURE, {
                            type: ACTIONS.FILE_RENAME_FAILURE, oldName: file.filename, newName: values.filename
                        })
                        setSubmitting(false);
                        close();
                    })
            }}
            validationSchema={validationSchema}
            validate={(values) => {
                const errors = {};
                for(let f of allFiles){
                    if(values.filename === f.filename){
                        errors.filename = "There's a file already with these name";
                    }
                }
                return errors;
            }}>
                {({values, isSubmitting}) => (
                    <Form>
                        <DialogContent>
                            <CustomTextField label={"New filename"} name={"filename"} value={values.filename} disabled={isSubmitting} />
                        </DialogContent>
                        <DialogActions>
                            <Button variant={"contained"} color={"secondary"}
                            onClick={close}>
                                Cancel
                            </Button>
                            <Button variant={"outlined"} color={"primary"} type={"submit"}
                                    disabled={isSubmitting}>
                                Rename file
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default RenameFileDialog;