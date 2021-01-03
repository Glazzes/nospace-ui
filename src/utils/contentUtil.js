import axios from 'axios';

const BASE_URL = "http://localhost:8080/api/"

export const getUsedSpace = () => {
    const url = `${BASE_URL}account/used-space`;
    return axios.get(url, {withCredentials: true});
}

export const getCurrentContent = (routes) => {
    const depth = routes.length;
    const folderName = routes[routes.length-1];
    const url = `${BASE_URL}content/my-content?depth=${depth}&name=${folderName}`;
    return axios.get(url, {withCredentials: true});
}

export const createNewFolder = (currentFolderid, name) => {
    const url = `${BASE_URL}content/new?name=${name}&baseId=${currentFolderid}`;
    console.log(`Sending request tot ${url}`);
    return axios.post(url, {}, {withCredentials: true});
}

export const fileUpload = (destinationFolderId, formData) => {
    const url = `${BASE_URL}files/new?baseId=${destinationFolderId}`;
    return axios.post(url, formData, {withCredentials: true});
}

export const deleteFolder = (folderId) => {
    const url = `${BASE_URL}content/${folderId}`;
    return axios.delete(url, {withCredentials: true});
}

export const deleteFile = (fileId) => {
    const url = `${BASE_URL}files/${fileId}`;
    return axios.delete(url, {withCredentials: true});
}

export const downloadFile = (fileId) => {
    const url = `${BASE_URL}files/${fileId}/download`;
    return axios.get(url, {withCredentials: true, responseType: "blob"});
}

export const downloadFolder = (folderId) => {
    const url = `${BASE_URL}content/${folderId}/download`;
    return axios.get(url, {withCredentials: true, responseType: "blob"});
}

export const convertBytesToReadableSize = (size) => {
    const units = ["B", "KB", "MB", "GB"];
    let currentUnit = 0;

    while(size >= 1024){
        size = size / 1024;
        currentUnit++;
    }

    return `${size.toFixed(2)} ${units[currentUnit]}`;
}