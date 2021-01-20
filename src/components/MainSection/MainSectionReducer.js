import MainSectionActions from "./MainSecionActions";

const mainSectionReducer = (state, action) => {
    switch(action.type){
        case MainSectionActions.OPEN_MENU:
            return {...state, openMenu: true, anchorEl: action.event.currentTarget}

        case MainSectionActions.CLOSE_MENU:
            return {...state, openMenu: false}

        case MainSectionActions.OPEN_NEW_FOLDER:
            return {...state, openNewFolder:true, openMenu: false}

        case MainSectionActions.FAILED_CONTENT_REQUEST:
            return {...state, openSnack: true, snackContent: {
                    ...state.snackContent, content: "Could not retrieve your files, try again later", type: "error"
                }}

        case MainSectionActions.CLOSE_SNACK:
            return {...state, openSnack: false, snackContent: {content: "", type: ""}}

        case MainSectionActions.CLOSE_NEW_FOLDER:
            return {...state, newFolderName: "", openNewFolder: false}

        case MainSectionActions.SET_ROOT_ID:
            return {...state, rootId: action.id};

        case MainSectionActions.SET_FOLDERS:
            return {...state, folders: action.folders};

        case MainSectionActions.SET_FILES:
            return {...state, files: action.files};

        case MainSectionActions.RENAME_FILES:
            return {...state, snackContent: {content: action.errorMessage, type: "error"}, openSnack: true};

        case MainSectionActions.UPLOADED_FILES:
            return {...state, snackContent: {...state.snackContent, content: "Files uploaded successfully", type: "success"},
                files: [...state.files, ...action.files], renderFiles: [...state.files, ...action.files],
                openSnack: true}

        case MainSectionActions.FAILED_UPLOAD:
            return {...state, snackContent:
                    {...state.snackContent, content: "An error occurred, try again later", type: "error"},
                openSnack: true}

        case MainSectionActions.ADD_NEW_ROUTE:
            return {...state, routes: [...state.routes, action.route]}

        case MainSectionActions.GO_TO_ROUTE:
            return {...state, routes: state.routes.slice(0, action.index+1)};

        case MainSectionActions.GO_BACK:
            return {...state, routes: state.routes.slice(0, state.routes.length-1)};

        case MainSectionActions.NEW_FOLDER:
            return {...state,
                folders: [...state.folders, action.newFolder],
                snackContent:
                    {...state.snackContent, content: `${action.folderName} folder was created successfully`, type: "success"},
                openNewFolder: false, openSnack: true
            }

        case MainSectionActions.FAILED_FOLDER_CREATION:
            return {...state,
                snackContent: {...state.snackContent, content: "Could not create new folder", type: "error"},
                openSnack: true
            }

        case MainSectionActions.REMOVE_FILE_BY_ID:
            const newFiles = state.files.filter(file => file.id !== action.id);
            return {...state, files: newFiles, snackContent:
                    {content: `${action.filename} was deleted successfully`, type: "success"}, openSnack: true};

        case MainSectionActions.REMOVE_FILE_BY_ID_FAILURE:
            return {...state, snackContent:
                    {content: `${action.filename} could not be deleted, try again later`, type: "error"}, openSnack: true};

        case MainSectionActions.DELETE_FOLDER:
            const newFolders = state.folders.filter(folder => folder.id !== action.id);
            return {...state, folders: newFolders, snackContent: {
                    content: `${action.folderName} was deleted successfully`, type: "success"}, openSnack: true};

        case MainSectionActions.DELETE_FOLDER_FAILURE:
            return {...state, snackContent:
                    {content: `${action.folderName} could not be deleted, try again later`, type: "error"}, openSnack: true}

        case MainSectionActions.FILE_RENAMED_SUCCESSFULLY:
            const renamedAppliedFiles = state.files.map(file => {
                if(file.filename === action.oldName) file.filename = action.newName;
                return file;
            });

            return {...state, snackContent: {content: `File ${action.oldName} renamed to ${action.newName}`,
            type: "success"}, openSnack: true, files: renamedAppliedFiles};

        case MainSectionActions.FILE_RENAME_FAILURE:
            return {...state, snackContent: {content: `Couldn't rename ${action.oldName} to ${action.newName}`,
                    type: "error"}, openSnack: true};

        case MainSectionActions.FOLDER_RENAMED_SUCCESSFULLY:
            const renamedAppliedFolders = state.folders.map(folder => {
                if(folder.folderName === action.oldName) folder.folderName = action.newName;
                return folder;
            });

            return {...state, snackContent: {content: `Folder ${action.oldName} renamed to ${action.newName}`,
                    type: "success"}, openSnack: true, folders: renamedAppliedFolders};

        case MainSectionActions.FOLDER_RENAMED_FAILURE:
            return {...state, snackContent: {content: `Couldn't rename ${action.oldName} to ${action.newName}`,
                    type: "error"}, openSnack: true};

        case MainSectionActions.FILE_DOWNLOAD_FAILURE:
            return {...state, snackContent: {content: `Something went wrong, could not download file ${action.filename}`,
                    type: "error"}, openSnack: true};

        default:
            return state;
    }
}

export default mainSectionReducer;