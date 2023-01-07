import api from '../utils/api';
import { setAlert } from './alert';
import {
    GET_POSTS,
    GET_POST,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    ADD_COMMENT,
    REMOVE_COMMENT,
} from './types';

export const getPosts = () => async (dispatch) => {
    try {
        const res = await api.get('/posts');

        dispatch({
            type: GET_POSTS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const getPost = (id) => async (dispatch) => {
    try {
        const res = await api.get(`/posts/${id}`);

        dispatch({
            type: GET_POST,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const addLike = (id) => async (dispatch) => {
    try {
        const res = await api.put(`/posts/like/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data },
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const unlike = (id) => async (dispatch) => {
    try {
        const res = await api.put(`/posts/unlike/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data },
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const deletePost = (id) => async (dispatch) => {
    try {
        await api.delete(`/posts/${id}`);

        dispatch({
            type: DELETE_POST,
            payload: id,
        });

        dispatch(setAlert('Post deleted', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const addPost = (formData) => async (dispatch) => {
    try {
        const res = await api.post(`/posts/`, formData);

        dispatch({
            type: ADD_POST,
            payload: res.data,
        });

        dispatch(setAlert('Post created', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const addComment = (id, formData) => async (dispatch) => {
    try {
        const res = await api.post(`/posts/comment/${id}`, formData);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data,
        });

        dispatch(setAlert('Comment added', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

export const deleteComment = (id, commentId) => async (dispatch) => {
    try {
        await api.delete(`/posts/comment/${id}/${commentId}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId,
        });

        dispatch(setAlert('Comment deleted', 'success'));
    } catch (err) {
        console.log(err);
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};
