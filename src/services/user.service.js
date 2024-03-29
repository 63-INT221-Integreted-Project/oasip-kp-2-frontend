import axios from "axios";
import BaseUrl from "../utils/BaseUrl";

const findAll = async function () {
    let { data } = await axios.get(`${BaseUrl.getUrl()}/users`, {});
    return data;
    // return await fetch(`${BaseUrl.getUrl()}/users`, {
    //     headers: {
    //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    //     },
    // }).then((res) => res.json());
};

const findByRole = async function (role) {
    let { data } = await axios.get(
        `${BaseUrl.getUrl()}/users?role=${role}`,
        {}
    );
    return data;
    // return await fetch(`${BaseUrl.getUrl()}/users`, {
    //     headers: {
    //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    //     },
    // }).then((res) => res.json());
};

const createUser = async function (user) {
    return await fetch(`${BaseUrl.getUrl()}/users`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: user.name.trim(),
            email: user.email.trim(),
            role: user.role,
            password: user.password,
        }),
    }).then((res) => res.json());
};

const updateUser = async function (userId, user) {
    return await fetch(`${BaseUrl.getUrl()}/users/${userId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: user.name.trim(),
            email: user.email.trim(),
            role: user.role,
        }),
    }).then((res) => res.json());
};

const deleteUser = async function (userId) {
    return await axios.delete(`${BaseUrl.getUrl()}/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
        },
    });
};

export default {
    findAll,
    createUser,
    updateUser,
    deleteUser,
    findByRole,
};
