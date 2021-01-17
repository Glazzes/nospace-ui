import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const fileUpload = (destinationFolderId, formData) => {
    const url = `${BASE_URL}/files/new?baseId=${destinationFolderId}`;
    return axios.post(url, formData, {withCredentials: true});
}

export const renameFile = (fileId, newFilename) => {
    const url = `${BASE_URL}/files/${fileId}/rename?filename=${newFilename}`;
    return axios.post(url, {}, {withCredentials: true});
}

export const downloadFile = (fileId) => {
    const url = `${BASE_URL}/files/${fileId}/download`;
    return axios.get(url, {withCredentials: true, responseType: "blob"});
}

export const deleteFile = (fileId) => {
    const url = `${BASE_URL}/files/${fileId}`;
    return axios.delete(url, {withCredentials: true});
}