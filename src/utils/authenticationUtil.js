import axios from 'axios';

export const login = (user) => {
    return axios.post(`http://localhost:8080/api/login`, user, {withCredentials: true});
}

export const signUp = (user) => {
    let options = {
        withCredentials: true,
        responseType: "application/json"
    };

    return axios.post(`http://localhost:8080/api/account/register`, user, options);
}

export const getCurrentUser = () => {
    return axios.get("http://localhost:8080/api/account/me", {withCredentials: true});
}