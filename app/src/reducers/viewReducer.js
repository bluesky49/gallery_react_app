import {TOGGLE_FULLSCREEN,
        DISABLE_FULLSCREEN,
        TOGGLE_LIGHTBOX,
        DISABLE_LIGHTBOX,
        TOGGLE_TEMP_FULLSCREEN,
        DISABLE_TEMP_FULLSCREEN
} from '../actions/types';

const initialState = {
    fullscreenCustom: false,
    lightboxIsOpen: false,
    fullscreenTempDisabled: false
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
        default:
            return state;
    }
}