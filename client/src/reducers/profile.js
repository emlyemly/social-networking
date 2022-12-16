import {
    GET_PROFILE,
    PROFILE_ERROR,
    CLEAR_PROFILE,
    UPDATE_PROFILE,
} from '../actions/types';

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    isLoading: true,
    error: {},
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: action.payload,
                isLoading: false,
            };
        case PROFILE_ERROR:
            return {
                ...state,
                profile: null,
                error: action.payload,
                isLoading: false,
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

export default profileReducer;
