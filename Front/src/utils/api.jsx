import { jwtStorage } from "./jwt_storage";

const REACT_APP_API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const getData = async (url) => {
    return fetch(REACT_APP_API_URL + url)
        .then((response) =>
            response.status >= 200 &&
                response.status <= 299 &&
                response.status !== 204
                ? response.json()
                : response,
        )
        .then((data) => {
            return data;
        })
        .catch((err) => console.log(err));
};

export const getDataPrivate = async (url) => {
    let token = await jwtStorage.retrieveToken();
    return fetch(REACT_APP_API_URL + url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) =>
            response.status >= 200 &&
                response.status <= 299 &&
                response.status !== 204
                ? response.json()
                : response,
        )
        .then((data) => {
            return data;
        })
        .catch((err) => {
            throw err;
        });
};

// Helper for fetching files/blobs privately
export const getPrivateBlob = async (url) => {
    let token = await jwtStorage.retrieveToken();
    return fetch(REACT_APP_API_URL + url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) =>
            response.status >= 200 &&
                response.status <= 299 &&
                response.status !== 204
                ? response.blob() // Expect a blob response for files
                : response,
        )
        .then((data) => {
            return data;
        })
        .catch((err) => {
            throw err;
        });
};

export const sendDataPrivate = async (url, data) => {
    let token = await jwtStorage.retrieveToken();
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: data,
    };

    return fetch(REACT_APP_API_URL + url, options)
        .then((response) =>
            response.status === 401
                ? { isExpiredJWT: true }
                : response.status >= 200 &&
                    response.status <= 299 &&
                    response.status !== 204
                    ? response.json()
                    : response,
        )
        .then((data) => data)
        .catch((err) => console.log(err));
};

export const editDataPrivateFormData = async (url, data) => {
    let token = await jwtStorage.retrieveToken();
    return fetch(REACT_APP_API_URL + url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: data,
    })
        .then((response) =>
            response.status === 401
                ? { isExpiredJWT: true }
                : response.status >= 200 &&
                    response.status <= 299 &&
                    response.status !== 204
                    ? response.json()
                    : response,
        )
        .then((data) => data)
        .catch((err) => console.log(err));
};

export const deleteDataPrivateJSON = async (url, data) => {
    let token = await jwtStorage.retrieveToken();
    return fetch(REACT_APP_API_URL + url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: data,
    })
        .then((response) =>
            response.status === 401
                ? { isExpiredJWT: true }
                : response.status >= 200 &&
                    response.status <= 299 &&
                    response.status !== 204
                    ? response.json()
                    : response,
        )
        .then((data) => data)
        .catch((err) => console.log(err));
};