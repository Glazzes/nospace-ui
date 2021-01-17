import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import {Form, Formik, useField} from "formik";
import {createNewFolder} from "../utils/FolderUtils";
import {useStyles} from "../styles/MainSectionStyles";
import * as yup from "yup";

const CustomTextField = ({label, ...props}) => {
    const classes = useStyles();
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";
    return <TextField {...field} label={label} helperText={errorText} variant={"outlined"} className={classes.newFolderInput}/>
}

const NewFolderDialog = ({open, rootId, newFolder, folders}) => {
    const validationScheme = yup.object({
        folderName: yup.string().required()
    });

    return (
        <Dialog open={open}>
            <DialogTitle>Create a new folder</DialogTitle>
            <Formik initialValues={{folderName: ""}} onSubmit={(values, {setSubmitting}) => {
                setSubmitting(true);
                createNewFolder(rootId, values.folderName)
                    .then(response => {
                        newFolder({type: "success", data: response.data, folderName: response.data.folderName});
                    })
                    .catch(_ => {
                        newFolder({type: "failure"});
                        setSubmitting(false);
                    })
            }}
                    validationSchema={validationScheme} validate={(values) => {
                const errors = {};
                for(let folder of folders){
                    if(folder.folderName === values.folderName){
                        errors.folderName = `There's already a folder called ${values.folderName} on the`+
                            " current folder, try with a new name"
                    }
                }

                return errors;
            }}>
                {({values, isSubmitting}) => (
                    <Form>
                        <DialogContent>
                            <CustomTextField label={"Folder name"} name={"folderName"} value={values.folderName}/>
                        </DialogContent>
                        <DialogActions>
                            <Button variant={"contained"} color={"secondary"}
                                    onClick={() => newFolder({type: "close"})}>
                                Cancel
                            </Button>
                            <Button variant={"contained"} color={"primary"} type={"submit"}
                                    disabled={isSubmitting}>
                                Create folder
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default NewFolderDialog;