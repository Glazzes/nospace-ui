import axios from 'axios';

const BASE_URL = "http://localhost:8080/api/"

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

export const fileUpload = (destinationFolderId, file) => {
    const url = `${BASE_URL}files/new?baseId=${destinationFolderId}`;
    return axios.post(url, file, {withCredentials: true});
}

export const deleteFolder = (folderId) => {
    const url = `${BASE_URL}content/${folderId}`;
    return axios.delete(url, {withCredentials: true});
}

export const deleteFile = (fileId) => {
    const url = `${BASE_URL}files/${fileId}`;
    return axios.delete(url, {withCredentials: true});
}