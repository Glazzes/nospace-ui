import {
    Box,
    Button,
    Menu,
    MenuItem,
    TextField,
} from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons';
import React, {useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {useStyles} from '../../styles/MainSectionStyles';
import { getCurrentUser } from '../../utils/UserUtils';
import FilesTable from '../FilesTable';
import { GlobalContext } from '../GlobalState';
import { getCurrentContent } from '../../utils/FolderUtils';
import {fileUpload} from '../../utils/FileUtils';
import MySnackbar from '../MySnackbar';
import MyBreadcrumbs from '../MyBreadcrumbs';
import NewFolderDialog from "../NewFolderDialog";
import EventEmitter, {EventConstants} from "../../utils/EventEmitter";

import ACTIONS from "./MainSecionActions";
import mainSectionReducer from "./MainSectionReducer";

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
    const [compState, dispatch] = useReducer(mainSectionReducer, initialState);
    const [searchItem, setSearchItem] = useState("");

    // achieving performance by caching
    const memoRoutes = useMemo(() => compState.routes, [compState.routes]);
    const memoFiles = useMemo(() => {
        return compState.files.filter(file => file.filename.toLowerCase().includes(searchItem));
    }, [compState.files, searchItem]);
    
    const memoFolders = useMemo(() => {
        return compState.folders.filter(folder => folder.folderName.toLowerCase().includes(searchItem));
    }, [compState.folders, searchItem]);

    // Functions triggered by the component
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

    const calculateNewFilesSize = (files) => {
        let totalFilesSize = 0;
        for(let file of files) totalFilesSize+=file.fileSize;
        return totalFilesSize;
    }

    const uploadFiles = (event) => {
        let existingFiles =[];

        for(let file of event.target.files){
            for(let innerFile of compState.files){
                if(file.name === innerFile.filename){
                    existingFiles.push(file.name);
                }
            }
        }

        const failedMessage = `${existingFiles.join(",")} this/these names are already on use, rename your files` +
            " before uploading them";

        if(existingFiles.length === 0){
            let formData = new FormData();
            Array.from(event.target.files).forEach( file => {
                console.log(file)
                formData.append("file", file)
            });

            fileUpload(compState.rootId, formData)
                .then(response => {
                    dispatch({type: ACTIONS.UPLOADED_FILES, files: response.data});
                    EventEmitter.emit(EventConstants.UPDATE_STORAGE_USAGE, {usedSpace: calculateNewFilesSize(response.data)});
                })
                .catch(_ => dispatch({type: ACTIONS.FALIED_UPLOAD}));
        }else{
            dispatch({type: ACTIONS.RENAME_FILES, errorMessage: failedMessage})
        }
    }

    const goToRoute = (index) => {
        dispatch({type: ACTIONS.GO_TO_ROUTE, index: index});
    }

    useEffect( () => {
        getCurrentUser()
            .then( response => setState({...state, currentUser: response.data}) )
            .catch( _ => console.log("Couldn't get the files") )
    }, [])


    useEffect(() => {
        EventEmitter.addListener(EventConstants.ADD_NEW_ROUTE, function (event){
            dispatch({type: event.type, route: event.newRoute}); })

        EventEmitter.addListener(EventConstants.REMOVE_FILE_BY_ID, function(event){
            dispatch({type: event.type, id: event.id, filename: event.filename}) });

        EventEmitter.addListener(EventConstants.REMOVE_FILE_BY_ID_FAILURE, function(event){
            dispatch({type: event.type, filename: event.filename}) });

        EventEmitter.addListener(EventConstants.FILE_RENAMED_SUCCESSFULLY, function(event){
            dispatch({type: event.type, oldName: event.oldName, newName: event.newName}) });

        EventEmitter.addListener(EventConstants.FILE_RENAME_FAILURE, function(event){
            dispatch({type: event.type, oldName: event.oldName, newName: event.newName}) });

        EventEmitter.addListener(EventConstants.FOLDER_RENAMED_SUCCESSFULLY, function (event){
            dispatch({type: event.type, oldName: event.oldName, newName: event.newName}) })

        EventEmitter.addListener(EventConstants.FOLDER_RENAMED_FAILURE, function (event){
            dispatch({type: event.type, oldName: event.oldName, newName: event.newName}) });

        EventEmitter.addListener(EventConstants.DELETE_FOLDER, function(event){
            dispatch({type: event.type, id: event.id, folderName: event.folderName}) })
        
        EventEmitter.addListener(EventConstants.REMOVE_FILE_BY_ID_FAILURE, function(event){
            dispatch({type: event.type, folderName: event.folderName}) })

        EventEmitter.addListener(EventConstants.FILE_DOWNLOAD_FAILURE, function(event){
            dispatch({type: event.type, filename: event.filename}) });
        
        EventEmitter.addListener(EventConstants.GO_BACK, function(event){
            dispatch({type: event.type, filename: event.filename}) });
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

        <FilesTable mainRoutes={memoRoutes} files={memoFiles} folders={memoFolders}/>

        <NewFolderDialog open={compState.openNewFolder} rootId={compState.rootId} newFolder={newFolder}
            folders={compState.folders}/>

        <MySnackbar open={compState.openSnack} content={compState.snackContent.content} 
            type={compState.snackContent.type}
            close={() => dispatch({type: ACTIONS.CLOSE_SNACK})} />
    </>
)}

export default MainSection;