import {
    Box,
    Button,
    Menu,
    MenuItem,
    TextField,
} from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons';
import React, {useContext, useEffect, useReducer, useState} from 'react';
import {useStyles} from '../styles/MainSectionStyles';
import { getCurrentUser } from '../utils/authenticationUtil';
import FilesTable from './FilesTable';
import { GlobalContext } from './GlobalState';
import { getCurrentContent, fileUpload } from '../utils/contentUtil';
import MySnackbar from './MySnackbar';
import MyBreadcrumbs from './MyBreadcrumbs';
import NewFolderDialog from "./NewFolderDialog";

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
    REMOVE_FILE_BY_ID: "remove_file_by_id",
    REMOVE_FILE_BY_ID_FAILURE: "remove_file_by_id_failure",
    DELETE_FOLDER: "delete_folder",
    DELETE_FOLDER_FAILURE: "delete_folder_failure",
    FILTER_CONTENT: "filter_content"
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

        case ACTIONS.REMOVE_FILE_BY_ID:
            const newFiles = state.files.filter(file => file.id !== action.id);
            return {...state, files: newFiles, snackContent:
                    {content: `${action.filename} was deleted successfully`, type: "success"}, openSnack: true};

        case ACTIONS.REMOVE_FILE_BY_ID_FAILURE:
            return {...state, snackContent:
                    {content: `${action.filename} could not be deleted, try again later`, type: "error"}, openSnack: true};

        case ACTIONS.DELETE_FOLDER:
            const newFolders = state.folders.filter(folder => folder.id !== action.id);
            return {...state, folders: newFolders, snackContent: {
                    content: `${action.folderName} was deleted successfully`, type: "success"}, openSnack: true};

        case ACTIONS.DELETE_FOLDER_FAILURE:
            return {...state, snackContent:
                    {content: `${action.folderName} could not be deleted, try again later`, type: "error"}, openSnack: true}

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

const MainSection = () => {
    const classes = useStyles();
    const [state, setState] = useContext(GlobalContext);
    const [compState, dispatch] = useReducer(reducer, initialState);
    const [serchItem, setSearchItem] = useState("");

    const goToRoute = (index) => {
        dispatch({type: ACTIONS.GO_TO_ROUTE, index: index});
    }

    const newFolder = (action) => {
        switch (action.type){
            case 'success':
                dispatch({type: ACTIONS.NEW_FOLDER, newFolder: action.data,
                    folderName: action.folderName});
                break;
            case "close":
                dispatch({type: ACTIONS.CLOSE_NEW_FOLDER});
                break;
            default:
                dispatch({type: ACTIONS.FAILED_FOLDER_CREATION});
                break;
        }
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

    return (
        <>
        <Box className={classes.serchBox}>
            <Button endIcon={<ExpandMore/>} aria-controls="menu" aria-haspopup={true} className={classes.drop}
                onClick={(event) => dispatch({type: ACTIONS.OPEN_MENU, event: event})}>
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

            <TextField className={classes.searchInput} variant="outlined" label="Search your files and folders"
            onChange={event => setSearchItem(event.target.value)}/>
        </Box>

        <MyBreadcrumbs routes={compState.routes} goTo={goToRoute}/>

        <FilesTable
            mainActions={ACTIONS} mainDispatcher={dispatch} mainRoutes={compState.routes}
            files={compState.files.filter(file => file.filename.toLowerCase().includes(serchItem))}
            folders={compState.folders.filter(folders => folders.folderName.toLowerCase().includes(serchItem))}
            />

        <NewFolderDialog open={compState.openNewFolder} rootId={compState.rootId} newFolder={newFolder}
        folders={compState.folders}/>

        <MySnackbar open={compState.openSnack} content={compState.snackContent.content} 
            type={compState.snackContent.type}
            close={() => dispatch({type: ACTIONS.CLOSE_SNACK})} />
    </>
)}

export default MainSection;