import axios from '../../shared/axiosConfig';
export const AUTH_START = 'AUTH_START';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const SET_AUTH_REDIRECT_PATH = 'SET_AUTH_REDIRECT_PATH';

export const authStart = () => {
    return {
        type: AUTH_START
    };
};

export const authSuccess = (token, userInfo) => {
    return {
        type: AUTH_SUCCESS,
        token: token,
        userInfo: userInfo
    };
};

export const authFail = (error) => {
    return {
        type: AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    axios.defaults.headers.common['Authorization'] = '';
    return {
        type: AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

export const auth = (credentials, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        let url = '/signupNewUser';
        if (!isSignup) {
            url = 'token/generate-token';
        }
        axios.post(url, credentials)
            .then(res => {
                const jwt = res.data.jwt.token;
                const userInfo = res.data.userInfo;
                localStorage.setItem('token', jwt);
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
                dispatch(authSuccess(jwt, userInfo));
            })
            .catch(err => {
                console.log(`[auth.js] error`)
                dispatch(authFail("Error in Auth."));
            });
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: SET_AUTH_REDIRECT_PATH,
        path: path
    };
};


export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('userInfo');
        if (!token) {
            dispatch(logout());
        } else {
            dispatch(authSuccess(token, JSON.parse(userInfo)));  
        }
    };
};
