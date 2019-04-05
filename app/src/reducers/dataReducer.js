import {
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
    SET_XCSRF_TOKEN,
    SET_ALBUM_OWNER_ID,
    SEARCH_RESULT_IS_SHOWN
} from '../actions/types';

//const eventAccessCode = '123456';
//const eventAccessCode = '214672';
//const eventAccessCode = '164111';
//const eventAccessCode = '736303';
//const eventAccessCode = '444121';

//const attendee = 'fbracq@pauzzle.pro';
// const attendee = 'salon1@mariage.pro';
// const attendee = 'marion.durand@pauzzle.pro';

const initialState = {
    albumResponse: ['empty'],
    finalResponse: ['empty'],
    photosToRender: ['empty'],
    isLoading: true,
    galleryIsLoading: false,
    eventAccessCode: 'empty',//'697652',
    attendee: 'empty',//'mariage@fougeront.com',//fbracq@pauzzle.pro'empty//davos@popoi.com//frank@fr.com
    albumOwnerID: 'empty',
    totalResults: null,
    searchResult: ['empty'],
    xcsrfToken: 'empty',
    searchResultIsShown: false
};

export default function (state = initialState, action) {
    switch (action.type) {
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
        case SET_ALBUM_OWNER_ID:
            return {
                ...state,
                albumOwnerID: action.payload
            };
        case SEARCH_RESULT_IS_SHOWN:
            return {
                ...state,
                searchResultIsShown: action.payload
            };
        default:
            return state;
    }
}