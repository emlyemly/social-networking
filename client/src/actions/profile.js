import axios from 'axios';
import api from '../utils/api';

import { GET_PROFILE, PROFILE_ERROR } from './types';

export const getCurrentProfile = () => async (dispatch) => {
    try {
        const res = await api.get('/profiles/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (err) {
        console.log(err);
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
    (formData, history, edit = false) =>
    async (dispatch) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };

            const res = await axios.post('/profile', formData);
        } catch (err) {}
    };
