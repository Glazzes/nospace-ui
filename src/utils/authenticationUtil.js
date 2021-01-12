import axios from 'axios';

export const login = (user) => {
    return axios.post(`http://localhost:8080/api/login`, user, {withCredentials: true});
}

export const signUp = (user) => {
    return axios.post(`http://localhost:8080/api/account/register`, user, {withCredentials: true});
}