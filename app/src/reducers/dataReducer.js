import {
    SET_INITIAL_RESPONSE,
    SET_FINAL_RESPONSE,
    SET_ALBUM_RESPONSE,
    SET_PHOTOS_TO_RENDER,
    TOGGLE_LOADING,
    DISABLE_LOADING,
    TOGGLE_GALLERY_LOADING,
    DISABLE_GALLERY_LOADING,
    SET_EVENT_CODE,
    SET_ATTENDEE,
    SET_TOTAL_RESULTS,
    SET_SEARCH_RESULT,
    SET_XCSRF_TOKEN
} from '../actions/types';

//const eventAccessCode = '123456';
//const eventAccessCode = '071404';
//const eventAccessCode = '164111';
//const eventAccessCode = '736303';
//const eventAccessCode = '444121';

//const attendee = 'fbracq@pauzzle.pro';
// const attendee = 'salon1@mariage.pro';
// const attendee = 'marion.durand@pauzzle.pro';

const initialState = {
    initialResponse: [],
    albumResponse: ['empty'],
    finalResponse: ['empty'],
    photosToRender: ['empty'],
    isLoading: true,
    galleryIsLoading: false,
    eventAccessCode: 'empty',
    attendee: 'empty',//fbracq@pauzzle.pro'empty
    totalResults: null,
    searchResult: ['empty'],
    xcsrfToken: 'empty'
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
        case SET_ALBUM_RESPONSE:
            return {
                ...state,
                albumResponse: action.payload
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
        case SET_EVENT_CODE:
            return {
                ...state,
                eventAccessCode: action.payload
            };
        case SET_ATTENDEE:
            return {
                ...state,
                attendee: action.payload
            };
        case SET_TOTAL_RESULTS:
            return {
                ...state,
                totalResults: action.payload
            };
        case SET_SEARCH_RESULT:
            return {
                ...state,
                searchResult: action.payload
            };
        case SET_XCSRF_TOKEN:
            return {
                ...state,
                xcsrfToken: action.payload
            };
        default:
            return state;
    }
}