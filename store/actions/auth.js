import { AsyncStorage } from 'react-native';

const API_KEY = 'AIzaSyB4O569bbjFcoqDnie8LmSE_5U3JvDJAH4';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({
            type: AUTHENTICATE,
            userId,
            token
        });
    };
};

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    };
};

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`
            , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            });

        if (!response.ok) {
            const errorResData = await response.json();
            const errorID = errorResData.error.message;
            let message = 'Something went wrong!';

            if (errorID === 'EMAIL_EXISTS') {
                message = 'This email exists already!';
            };
            throw new Error(message);
        };

        const resData = await response.json();
        dispatch(
            authenticate(
                resData.localId,
                resData.idToken,
                parseInt(resData.expiresIn) * 1000
            )
        );
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        saveDataToStorage(
            resData.idToken, resData.localId, expirationDate
        );
    };
};

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
            , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            });
        if (!response.ok) {
            const errorResData = await response.json();
            const errorID = errorResData.error.message;
            let message = 'Something went wrong!';

            if (errorID === 'EMAIL_NOT_FOUND') {
                message = 'This email you entered could not be found!';
            } else if (errorID === 'INVALID_PASSWORD') {
                message = 'This PW is not valid!';
            };
            throw new Error(message);
        };
        const resData = await response.json();
        dispatch(
            authenticate(
                resData.localId,
                resData.idToken,
                parseInt(resData.expiresIn) * 1000
            )
        );
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
        );
        saveDataToStorage(
            resData.idToken, resData.localId, expirationDate
        );
    };
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
};

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({
            token,
            userId,
            expiryDate: expirationDate.toISOString()
        })
    );
};
