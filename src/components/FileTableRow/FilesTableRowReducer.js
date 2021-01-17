import FilesTableRowActions from "./FilesTableRowActions";

function filesTableRowReducer(state, action){
    switch(action.type){
        case FilesTableRowActions.DISPLAY_WARNING:
            return {...state, displayWarning: true, openMenu: false}

        case FilesTableRowActions.CLOSE_WARNING:
            return {...state, displayWarning: false}

        case FilesTableRowActions.OPEN_MENU:
            return {...state, openMenu: true, anchorEl: action.anchorEl.currentTarget}

        case FilesTableRowActions.CLOSE_MENU:
            return {...state, openMenu: false}

        case FilesTableRowActions.DISABLE_DELETE_BUTTON:
            return {...state, isDeleteFileButtonDisabled: true};

        case FilesTableRowActions.OPEN_RENAME_DIALOG:
            return {...state, openRenameDialog: true, openMenu: false}

        case FilesTableRowActions.CLOSE_DIALOG:
            return {...state, openRenameDialog: false}

        default:
            return state;
    }
}

export default filesTableRowReducer;