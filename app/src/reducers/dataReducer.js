import {SET_INITIAL_RESPONSE,
        SET_FINAL_RESPONSE,
        SET_PHOTOS_TO_RENDER,
        TOGGLE_LOADING,
        DISABLE_LOADING,
        TOGGLE_GALLERY_LOADING,
        DISABLE_GALLERY_LOADING
} from '../actions/types';

const initialState = {
    initialResponse: [],
    finalResponse: ['empty'],
    photosToRender: ['empty'],
    isLoading: true,
    galleryIsLoading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_RESPONSE:
            return {
                ...state,
                initialResponse: action.payload
            };
        case SET_FINAL_RESPONSE:
            return {
                ...state,
                finalResponse: action.payload
            };
        case SET_PHOTOS_TO_RENDER:
            return {
                ...state,
                photosToRender: action.payload
            };
        case TOGGLE_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case DISABLE_LOADING:
            return {
                ...state,
                isLoading: false
            };
        case TOGGLE_GALLERY_LOADING:
            return {
                ...state,
                galleryIsLoading: true
            };
        case DISABLE_GALLERY_LOADING:
            return {
                ...state,
                galleryIsLoading: false
            };
       default:
            return state;
    }
}