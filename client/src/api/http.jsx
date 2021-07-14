import axios from "axios";
// import { NotificationError } from "../common/Notification";

// let BASE_URL = "http://localhost:5000/user"
let BASE_URL = "https://styleway-app.herokuapp.com/user"
// let BASE_URL = "http://localhost:5000"
const http = axios.create({
    baseURL: BASE_URL,
});

http.interceptors.request.use(function (config) {
    const token = localStorage.getItem("access_token");
    config.headers.Authorization = token ? token : '';
    config.headers['Accept-Language'] = "vi";
    return config;
}, function (error) {
    // Do something with request error
    if (error.response && error.response.data) {
        return Promise.reject(error.response.data);
    } else {
        return Promise.reject(error);
    }
});
http.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response && error.response.data) {
        // if (error.response.data.code === 401 && window.location.pathname !== '/login') {
        //     try {
        //         clearTimeout(timeoutTokenExpired)
        //         timeoutTokenExpired = setTimeout(() => {
        //             store.dispatch(clearToken());
        //             Promise.reject(error);
        //             localStorage.removeItem(EVN_TOKEN)
        //             sessionStorage.removeItem(EVN_TOKEN)
        //             history.push("/login");
        //             NotificationError(ERROR, TOKEN_EXPIRED)
        //         }, 300)
        //     } catch (ex) {
        //         console.log("interceptor -> ex", ex)
        //     }
        // }
        return Promise.reject(error.response.data);
    } else {
        return Promise.reject(error);
    }
});
export default http;

