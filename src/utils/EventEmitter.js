import {EventEmitter} from 'fbemitter';

export const EventConstants = {
    REMOVE_FILE_BY_ID: "remove_file_by_id",
    REMOVE_FILE_BY_ID_FAILURE: "remove_file_by_id_failure",
    FILE_RENAMED_SUCCESSFULLY: "file_renamed_successfully",
    FILE_RENAME_FAILURE: "file_rename_failure",
    FOLDER_RENAMED_SUCCESSFULLY: "folder_renamed_successfully",
    FOLDER_RENAMED_FAILURE: "folder_renamed_failure",
    GO_BACK: "go_back",
    ADD_NEW_ROUTE: "add_new_route",
    DELETE_FOLDER: "delete_folder",
    DELETE_FOLDER_FAILURE: "delete_folder_failure",
    UPDATE_STORAGE_USAGE: "update_storage_usage",
    FILE_DOWNLOAD_FAILURE: "file_download_failure"
}

export default new EventEmitter();