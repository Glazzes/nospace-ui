import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const getCurrentUser = () => {
    return axios.get("http://localhost:8080/api/account/me", {withCredentials: true});
}

export const editUserAccount = (user) => {
    const url = `${BASE_URL}/account/me/edit`;
    return axios.post(url, user, {withCredentials: true});
}

export const submitNewProfilePicture = (file) => {
    const url = `${BASE_URL}account/edit/profile-picture`;
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(url, formData, {withCredentials: true});
}