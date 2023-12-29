import axios from 'axios';
import config from '~/config';
import {
    loginFailed,
    loginStart,
    loginSuccess,
    logOutFailed,
    logOutStart,
    logOutSuccess,
    registerFailed,
    registerStart,
    registerSuccess,
} from './authSlice';
import {
    deleteUserFailed,
    deleteUsersSuccess,
    deleteUserStart,
    getUsersFailed,
    getUsersStart,
    getUsersSuccess,
} from './userSlice';

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('/v1/auth/login', user);
        dispatch(loginSuccess(res.data));
        navigate(config.routes.home);

        return res;
    } catch (err) {
        dispatch(loginFailed());
    }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        const res = await axios.post('/v1/auth/register', user);
        dispatch(registerSuccess());
        navigate(config.routes.login);

        return res;
    } catch (err) {
        dispatch(registerFailed());
    }
};

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getUsersStart());
    try {
        const res = await axiosJWT.get('/v1/user', {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getUsersSuccess(res.data));

        return res;
    } catch (err) {
        dispatch(getUsersFailed());
    }
};

export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUserStart());
    try {
        const res = await axiosJWT.delete('/v1/user/' + id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(deleteUsersSuccess(res.data));

        return res;
    } catch (err) {
        dispatch(deleteUserFailed(err.response.data));
    }
};

export const logOut = async (dispatch, id, navigate, accessToken, axiosJWT) => {
    dispatch(logOutStart());
    try {
        const data = await axiosJWT.post('/v1/auth/logout', id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(logOutSuccess());
        navigate(config.routes.login);

        return data;
    } catch (err) {
        dispatch(logOutFailed());
    }
};
