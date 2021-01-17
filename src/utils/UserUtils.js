import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const getCurrentUser = () => {
    return axios.get(`${BASE_URL}/account/me`, {withCredentials: true});
}

export const editUserAccount = (user) => {
    if (user.password === null || user.password === undefined){
        user.password = "";
    }

    const url = `${BASE_URL}/account/edit`;
    return axios.post(url, user, {withCredentials: true});
}

export const submitNewProfilePicture = (file) => {
    const url = `${BASE_URL}/account/edit/profile-picture`;
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(url, formData, {withCredentials: true});
}