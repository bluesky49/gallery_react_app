import {
    TOGGLE_FULLSCREEN,
    DISABLE_FULLSCREEN,
    TOGGLE_LIGHTBOX,
    DISABLE_LIGHTBOX,
    TOGGLE_TEMP_FULLSCREEN,
    DISABLE_TEMP_FULLSCREEN,
    OPEN_SEARCH_PANEL,
    CLOSE_SEARCH_PANEL,
    TOGGLE_FACE_TAGGING, SEARCH_RESULT_IS_SHOWN
} from '../actions/types';

const initialState = {
    fullscreenCustom: false,
    lightboxIsOpen: false,
    fullscreenTempDisabled: false,
    searchPanelIsOpen: false,
    faceTaggingIsOpen: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TOGGLE_FULLSCREEN:
            return {
                ...state,
                fullscreenCustom: true
            };
        case DISABLE_FULLSCREEN:
            return {
                ...state,
                fullscreenCustom: false
            };
        case TOGGLE_LIGHTBOX:
            return {
                ...state,
                lightboxIsOpen: true
            };
        case DISABLE_LIGHTBOX:
            return {
                ...state,
                lightboxIsOpen: false
            };
        case OPEN_SEARCH_PANEL:
            return {
                ...state,
                searchPanelIsOpen: true
            };
        case CLOSE_SEARCH_PANEL:
            return {
                ...state,
                searchPanelIsOpen: false
            };
        case TOGGLE_TEMP_FULLSCREEN:
            return {
                ...state,
                fullscreenTempDisabled: true
            };
        case DISABLE_TEMP_FULLSCREEN:
            return {
                ...state,
                fullscreenTempDisabled: false
            };
        case TOGGLE_FACE_TAGGING:
            return {
                ...state,
                faceTaggingIsOpen: action.payload
            };
        default:
            return state;
    }
}