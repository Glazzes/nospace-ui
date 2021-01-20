import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import {Form, Formik, useField} from "formik";
import {renameFolder} from "../../utils/FolderUtils";
import * as yup from 'yup';
import {useStyles} from "../../styles/MainSectionStyles";
import EventEmitter from "../../utils/EventEmitter";
import {EventConstants} from "../../utils/EventEmitter";
import ACTIONS from "../MainSection/MainSecionActions";

const validationSchema = yup.object({
    folderName: yup.string().required()
})

const CustomTextField = ({label, disabled, ...props}) => {
    const classes = useStyles();
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";
    return <TextField {...field} label={label} helperText={errorText} variant={"outlined"} className={classes.newFolderInput} disabled={disabled}/>
}

const RenameFolderDialog = ({allFolders, folder, open, close}) => {

    return (
        <Dialog open={open}>
            <DialogTitle>Rename folder {folder.folderName}</DialogTitle>
            <Formik initialValues={{folderName: ""}} onSubmit={(values, {setSubmitting}) =>{
                setSubmitting(true);
                renameFolder(folder.id, values.folderName)
                    .then(_ => {
                        EventEmitter.emit(EventConstants.FOLDER_RENAMED_SUCCESSFULLY, {
                            type: ACTIONS.FOLDER_RENAMED_SUCCESSFULLY,
                            oldName: folder.folderName, newName: values.folderName
                        })
                        setSubmitting(false);
                        close();
                    })
                    .catch(_ => {
                        EventEmitter.emit(EventConstants.FOLDER_RENAMED_FAILURE, {
                            type: ACTIONS.FOLDER_RENAMED_FAILURE,
                            oldName: folder.folderName, newName: values.folderName
                        })
                        setSubmitting(false);
                        close();
                    })
            }}
                    validationSchema={validationSchema}
                    validate={(values) => {
                        const errors = {};
                        for(let f of allFolders){
                            if(values.folderName === f.folderName){
                                errors.folderName = "There's a file already with these name";
                            }
                        }
                        return errors;
                    }}>
                {({values, isSubmitting}) => (
                    <Form>
                        <DialogContent>
                            <CustomTextField label={"New folder name"} name={"folderName"} value={values.folderName}
                                             disabled={isSubmitting} />
                        </DialogContent>
                        <DialogActions>
                            <Button variant={"contained"} color={"secondary"}
                                    onClick={close}>
                                Cancel
                            </Button>
                            <Button variant={"outlined"} color={"primary"} type={"submit"}
                                    disabled={isSubmitting}>
                                Rename Folder
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default RenameFolderDialog;