import { GET_PROFILE, PROFILE_ERROR } from '../actions/types';

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
            return {
                ...state,
                profile: action.payload,
                isLoading: false,
            };
        case PROFILE_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };
        default:
            return state;
    }
};

export default profileReducer;
