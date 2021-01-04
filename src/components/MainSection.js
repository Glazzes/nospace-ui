import {
    Box,
    Breadcrumbs,
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Menu,
    MenuItem,
    TextField,
    Typography
} from '@material-ui/core'
import { ExpandMore, NavigateNext } from '@material-ui/icons';
import React, {useContext, useEffect, useReducer, useRef} from 'react';
import {useStyles} from '../styles/MainSectionStyles';
import { getCurrentUser } from '../utils/authenticationUtil';
import FilesTable from './FilesTable';
import { GlobalContext } from './GlobalState';
import { createNewFolder, getCurrentContent, fileUpload } from '../utils/contentUtil';
import MySnackbar from './MySnackbar';
import {Formik, Form, useField} from 'formik';
import * as yup from 'yup';

const ACTIONS = {
    NEW_FOLDER: "new_folder",
    SET_FILES: "set_files",
    SET_FOLDERS: "set_folders",
    SET_ROOT_ID: "set_root_id",
    OPEN_NEW_FOLDER: "open_new_folder",
    CLOSE_NEW_FOLDER: "close_new_folder",
    OPEN_MENU: "open_menu",
    CLOSE_MENU: "close_menu",
    OPEN_SNACK: "open_success_snack",
    CLOSE_SNACK: "close_snack",
    GO_TO_ROUTE: "go_to_route",
    GO_BACK: "go_back",
    ADD_NEW_ROUTE: "add_new_route",
    UPLOADED_FILES: "uploaded_files",
    FALIED_UPLOAD: "failed_upload",
    FAILED_CONTENT_REQUEST: "failed_content_request",
    FAILED_FOLDER_CREATION: "failed_folder_creation",
    REMOVE_FOLDER: "remove_folder",
    REMOVE_FILE: "remove_file"
}

function reducer(state, action){
    switch(action.type){
        case ACTIONS.OPEN_MENU:
            return {...state, openMenu: true, anchorEl: action.event.currentTarget}

        case ACTIONS.CLOSE_MENU:
            return {...state, openMenu: false}

        case ACTIONS.OPEN_NEW_FOLDER:
            return {...state, openNewFolder:true, openMenu: false}

        case ACTIONS.FAILED_CONTENT_REQUEST:
            return {...state, openSnack: true, snackContent: {
                ...state.snackContent, content: "Could not retrieve your files, try again later", type: "error"
            }}

        case ACTIONS.CLOSE_SNACK:
            return {...state, openSnack: false, snackContent: {content: "", type: ""}}

        case ACTIONS.CLOSE_NEW_FOLDER:
            return {...state, newFolderName: "", openNewFolder: false}

        case ACTIONS.SET_ROOT_ID:
            return {...state, rootId: action.id};

        case ACTIONS.SET_FOLDERS:
            return {...state, folders: action.folders};
    
        case ACTIONS.SET_FILES:
            return {...state, files: action.files};

        case ACTIONS.UPLOADED_FILES:
            return {...state, snackContent: {...state.snackContent, content: "Files uploaded successfuly", type: "success"},
            files: [...state.files, ...action.files], renderFiles: [...state.files, ...action.files], 
            openSnack: true}

        case ACTIONS.FALIED_UPLOAD:
            return {...state, snackContent: 
                {...state.snackContent, content: "An error ocurred, try again later", type: "error"}, 
                openSnack: true}

        case ACTIONS.ADD_NEW_ROUTE:
            return {...state, routes: [...state.routes, action.route]}

        case ACTIONS.GO_TO_ROUTE:
            return {...state, routes: state.routes.slice(0, action.index+1)};

        case ACTIONS.GO_BACK:
            return {...state, routes: state.routes.slice(0, state.routes.length-1)};

        case ACTIONS.NEW_FOLDER:
            return {...state,
                    folders: [...state.folders, action.newFolder],
                    snackContent:
                        {...state.snackContent, content: `${action.folderName} folder was created successfully`, type: "success"},
                    openNewFolder: false, openSnack: true
                }

        case ACTIONS.FAILED_FOLDER_CREATION:
            return {...state, 
                snackContent: {...state.snackContent, content: "Could not create new folder", type: "error"},
                openSnack: true
            }

        case ACTIONS.REMOVE_FOLDER:
            const updatedFolders = state.folders.filter(folder => folder.id !== action.folderId);
            return {...state, folders: updatedFolders, renderFolders: updatedFolders,
            snackContent: {content: `${action.folderName} folder was successfuly deleted`, type: "success"},
            openSnack: true};

        case ACTIONS.REMOVE_FOLDER_FAILURE:
            return {...state, snackContent: 
                {content: `${action.folderName} could no be deleted, try later.`, type: "error"},
                openSnack: true}

        case ACTIONS.REMOVE_FILE:
            const updatedFiles = state.files.filter(file => file.id !== action.fileId);
            return {...state, files: updatedFiles, renderFiles: updatedFiles,
            snackContent: {content: `${action.filename} was deleted successfuly`, type: "success"},
            openSnack: true};

        case ACTIONS.REMOVE_FILE_FAILURE:
            return {...state, snackContent: 
                {content: `${action.folderName} couldn't be deleted, try later.`, type: "error"},
                openSnack: true}

        default:
            return state;
    }
}

const initialState = {
    anchorEl: null,
    files: [],
    folders: [],
    openNewFolder: false,
    openMenu: false,
    openSnack: false,
    newFolderName: "",
    snackContent: {content: "", type: ""},
    routes: ["root"],
    rootId: ""
}

const CustomTextField = ({label, ...props}) => {
    const classes = useStyles();
    const [field, meta] = useField(props);
    const errorText = meta.error && meta.touched ? meta.error : "";
    return <TextField {...field} label={label} helperText={errorText} variant={"outlined"} className={classes.newFolderInput}/>
}

const SearchBar = () => {
    const classes = useStyles();
    const [state, setState] = useContext(GlobalContext);
    const [compState, dispatch] = useReducer(reducer, initialState);
    const inputRef = useRef();

    const goToRoute = (index) => {
        dispatch({type: ACTIONS.GO_TO_ROUTE, index: index});
    }

    const filterFilesAndFolders = (event) => {
        const value = event.target.value;
        dispatch({type: ACTIONS.FILTER_FILES, value: value});
        dispatch({type: ACTIONS.FILTER_FOLDERS, value: value});
    }

    const uploadFiles = (event) => {
        let formData = new FormData();
        Array.from(event.target.files).forEach( file => {
            console.log(file)
            formData.append("file", file)
        });

        fileUpload(compState.rootId, formData)
            .then(response => dispatch({type: ACTIONS.UPLOADED_FILES, files: response.data}) )
            .catch(_ => dispatch({type: ACTIONS.FALIED_UPLOAD}));
    }

    useEffect( () => {
        getCurrentUser()
            .then( response => setState({...state, currentUser: response.data}) )
            .catch( _ => console.log("Couldnt get the files") )
    }, [])

    useEffect( () => {
        getCurrentContent(compState.routes)
            .then(response => {
                dispatch({type: ACTIONS.SET_ROOT_ID, id: response.data.id})
                dispatch({type: ACTIONS.SET_FOLDERS, folders: response.data.subFolders})
                dispatch({type: ACTIONS.SET_FILES, files: response.data.files})
            })
            .catch(_ => dispatch({type: ACTIONS.FAILED_CONTENT_REQUEST}));
    }, [compState.routes] )

    const validationScheme = yup.object({
        folderName: yup.string().required()
    })

    return (
        <>
        <Box className={classes.serchBox}>
            <Button endIcon={<ExpandMore/>} aria-controls="menu" aria-haspopup={true} className={classes.drop}
                onClick={(event) => dispatch({type: ACTIONS.OPEN_MENU, event: event})}
            >
                My NoSpace
            </Button>

            <Menu id="menu" open={compState.openMenu} anchorEl={compState.anchorEl} keepMounted
                onClose={() => dispatch({type: ACTIONS.CLOSE_MENU})} 
                anchorOrigin={{vertical: "bottom",horizontal: "right"}}
            >
                <input id="fileUpload" type="file" multiple hidden onChange={uploadFiles} />
                <label htmlFor="fileUpload">
                    <MenuItem onClick={() => dispatch({type: ACTIONS.CLOSE_MENU})}>Upload file</MenuItem>
                </label>
                <MenuItem onClick={() => dispatch({type: ACTIONS.OPEN_NEW_FOLDER})}>New folder</MenuItem>
            </Menu>

            <TextField className={classes.searchInput} variant="outlined" ref={inputRef}
                label="Search your files and folders" onChange={filterFilesAndFolders}
            />
        </Box>
        <Breadcrumbs separator={<NavigateNext/>} className={classes.url}>
            {compState.routes.map( (item, index) => <Typography key={index} className={classes.breadCrumb}
            onClick={() => goToRoute(index)}> 
            {item}</Typography>
            )}
        </Breadcrumbs>

        <FilesTable 
            ACTIONS={ACTIONS}
            mainSectionRoutes={compState.routes} mainSectionDispatch={dispatch}
            files={compState.files} folders={compState.folders}
        />

        <Dialog open={compState.openNewFolder}>
            <DialogTitle>Create a new folder</DialogTitle>
            <Formik initialValues={{folderName: ""}} onSubmit={(values, {setSubmitting}) => {
                setSubmitting(true);
                createNewFolder(compState.rootId, values.folderName)
                    .then(response => {
                        dispatch({type: ACTIONS.NEW_FOLDER, newFolder: response.data,
                        folderName: response.data.folderName});
                    })
                    .catch(_ => {
                        dispatch({type: ACTIONS.FAILED_FOLDER_CREATION});
                        setSubmitting(false);
                    })
            }}
            validationSchema={validationScheme} validate={(values) => {
                const errors = {};
                for(let folder of compState.folders){
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
                            <CustomTextField label={"Folder name"} name={"folderName"} values={values.folderName}/>
                        </DialogContent>
                        <DialogActions>
                            <Button variant={"contained"} color={"secondary"}
                                    onClick={() => dispatch({type: ACTIONS.CLOSE_NEW_FOLDER})}>
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

        <MySnackbar open={compState.openSnack} content={compState.snackContent.content} 
            type={compState.snackContent.type}
            close={() => dispatch({type: ACTIONS.CLOSE_SNACK})} />
    </>
)}

export default SearchBar;