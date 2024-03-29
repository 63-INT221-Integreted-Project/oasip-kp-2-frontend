// @ts-ignore
import axios from "axios";
import AuthService from "../services/auth.service";

axios.interceptors.request.use((request) => {
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    if (!request.url.includes("login") && !request.url.includes("guest")) {
        //* For check not authen endpoint
        request.headers.Authorization = `Bearer ${token}`;
    }
    if (request.url.includes("refresh") && !request.url.includes("guest")) {
        request.headers.Authorization = `Bearer ${refreshToken}`;
    }
    return request;
});

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (
            error.response.status === 401 &&
            !error.config.url.includes("refresh")
        ) {
            const refreshToken = localStorage.getItem("refresh_token");
            if (refreshToken) {
                try {
                    const response = await AuthService.refreshToken();
                    localStorage.setItem("access_token", response.access_token);
                    error.config.headers["Authorization"] =
                        "Bearer " + response.access_token;
                    return axios.request(error.config);
                } catch (error) {}
            }
        }
        return Promise.reject(error);
    }
);
