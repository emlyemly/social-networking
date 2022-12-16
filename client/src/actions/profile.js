import api from '../utils/api';
import { setAlert } from './alert';

import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from './types';

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
