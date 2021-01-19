import {EventEmitter} from 'events'

export const EventConstants = {
    REMOVE_FILE_BY_ID: "remove_file_by_id",
    REMOVE_FILE_BY_ID_FAILURE: "remove_file_by_id_failure",
    FILE_RENAMED_SUCCESSFULLY: "file_renamed_successfully",
    FILE_RENAME_FAILURE: "file_rename_failure",
    GO_BACK: "go_back",
    ADD_NEW_ROUTE: "add_new_route",
    DELETE_FOLDER: "delete_folder",
    DELETE_FOLDER_FAILURE: "delete_folder_failure"
}

export default new EventEmitter();