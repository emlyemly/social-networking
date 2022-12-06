import {
    REGISTER_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGOUT,
    CLEAR_PROFILE,
    PROFILE_ERROR,
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
            };
        case AUTH_ERROR:
        case LOGOUT:
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                user: null,
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
            };
        case PROFILE_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                profile: null,
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                isLoading: false,
            };
        default:
            return state;
    }
};

export default authReducer;
