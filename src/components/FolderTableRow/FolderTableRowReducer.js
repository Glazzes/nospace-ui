import FolderTableRowActions from "./FolderTableRowActions";

function folderTableRowReducer(state, action){
    switch(action.type){
        case FolderTableRowActions.OPEN_MENU:
            return {...state, openMenu: true, anchorEl: action.anchorEl.currentTarget};

        case FolderTableRowActions.CLOSE_MENU:
            return {...state, anchorEl: null, openMenu: false};

        case FolderTableRowActions.DISPLAY_WARNING:
            return {...state, displayWarning: true, openMenu: false};

        case FolderTableRowActions.CLOSE_WARNING:
            return {...state, displayWarning: false};

        case FolderTableRowActions.CLOSE_SNACKBAR:
            return {...state, folderSnackbar: {...state.folderSnackbar, isOpen: false}};

        case FolderTableRowActions.DISABLE_DELETE_BUTTON:
            return {...state, isDeleteFileButtonDisabled: true};

        case FolderTableRowActions.OPEN_RENAME_DIALOG:
            return {...state, openRenameFolderDialog: true, openMenu: false};

        case FolderTableRowActions.CLOSE_RENAME_DIALOG:
            return {...state, openRenameFolderDialog: false};

        default:
            return state;
    }
}

export default folderTableRowReducer;