import {
    Box,
    Button,
    Menu,
    MenuItem,
    TextField,
} from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons';
import React, {useCallback, useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {useStyles} from '../../styles/MainSectionStyles';
import { getCurrentUser } from '../../utils/UserUtils';
import FilesTable from '../FilesTable';
import { GlobalContext } from '../GlobalState';
import { getCurrentContent } from '../../utils/FolderUtils';
import {fileUpload} from '../../utils/FileUtils';
import MySnackbar from '../MySnackbar';
import MyBreadcrumbs from '../MyBreadcrumbs';
import NewFolderDialog from "../NewFolderDialog";

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

    // achieving performance
    const memoDispatch = useCallback(dispatch, [dispatch]);
    const memoRoutes = useMemo(() => compState.routes, [compState.routes]);
    const memoFiles = useMemo(() => {
        return compState.files.filter(file => file.filename.toLowerCase().includes(searchItem));
    }, [compState.files, searchItem]);

    const memoFolders = useMemo(() => {
        return compState.folders.filter(folder => folder.folderName.toLowerCase().includes(searchItem));
    }, [compState.folders, searchItem]);

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
        let existingFiles =[];

        console.log(event.target.files)
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
                .then(response => dispatch({type: ACTIONS.UPLOADED_FILES, files: response.data}) )
                .catch(_ => dispatch({type: ACTIONS.FALIED_UPLOAD}));
        }else{
            dispatch({type: ACTIONS.RENAME_FILES, errorMessage: failedMessage})
        }
    }

    useEffect( () => {
        getCurrentUser()
            .then( response => setState({...state, currentUser: response.data}) )
            .catch( _ => console.log("Couldn't get the files") )
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

        <FilesTable mainDispatcher={memoDispatch} mainRoutes={memoRoutes} files={memoFiles} folders={memoFolders}/>

        <NewFolderDialog open={compState.openNewFolder} rootId={compState.rootId} newFolder={newFolder}
            folders={compState.folders}/>

        <MySnackbar open={compState.openSnack} content={compState.snackContent.content} 
            type={compState.snackContent.type}
            close={() => dispatch({type: ACTIONS.CLOSE_SNACK})} />
    </>
)}

export default MainSection;