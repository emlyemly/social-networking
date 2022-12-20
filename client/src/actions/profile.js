import api from '../utils/api';
import { setAlert } from './alert';

import {
    GET_PROFILE,
    GET_PROFILES,
    GET_REPOS,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    ACCOUNT_DELETED,
} from './types';

export const getCurrentProfile = () => async (dispatch) => {
    try {
        const res = await api.get('/profiles/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const getProfiles = () => async (dispatch) => {
    dispatch({
        type: CLEAR_PROFILE,
    });

    try {
        const res = await api.get('/profiles');

        dispatch({
            type: GET_PROFILES,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const getProfileById = (userId) => async (dispatch) => {
    try {
        const res = await api.get(`/profiles/user/${userId}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const getGithubRepos = (username) => async (dispatch) => {
    try {
        const res = await api.get(`/profiles/github/${username}`);

        dispatch({
            type: GET_REPOS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const createProfile =
    (formData, navigate, edit = false) =>
    async (dispatch) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };

            const res = await api.post('/profiles', formData, config);

            dispatch({
                type: GET_PROFILE,
                payload: res.data,
            });

            dispatch(
                setAlert(
                    edit ? 'Profile updated' : 'Profile created',
                    'success'
                )
            );

            if (!edit) {
                navigate('/dashboard');
            }
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, 'danger'))
                );
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        }
    };

export const addExperience = (formData, navigate) => async (dispatch) => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
        };

        const res = await api.put('/profiles/experience', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert('Experience added', 'success'));
        navigate('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const addEducation = (formData, navigate) => async (dispatch) => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
        };

        const res = await api.put('/profiles/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert('Education added', 'success'));
        navigate('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const deleteExperience = (id) => async (dispatch) => {
    try {
        const res = await api.delete(`profiles/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert('Experience deleted', 'success'));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const deleteEducation = (id) => async (dispatch) => {
    try {
        const res = await api.delete(`profiles/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });

        dispatch(setAlert('Education deleted', 'success'));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const deleteAccount = () => async (dispatch) => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
        try {
            const res = await api.delete(`/profile/`);

            dispatch({
                type: CLEAR_PROFILE,
            });

            dispatch({
                type: ACCOUNT_DELETED,
            });

            dispatch(setAlert('Profile and account permanently deleted'));
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, 'danger'))
                );
            }

            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        }
    }
};
