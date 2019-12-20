import {
    DISABLE_FETCH_REQUEST,
    DISABLE_GALLERY_LOADING,
    DISABLE_LOADING,
    ENABLE_FETCH_REQUEST,
    SET_ALBUM_INFO,
    SET_ALBUM_OWNER_ID,
    SET_ALBUMS_LIST,
    SET_ATTENDEE,
    SET_AUTHSTATUS,
    SET_BUTTON_TYPE,
    SET_EVENT_CODE,
    SET_LANGUAGE,
    SET_PHOTOS_TO_RENDER,
    SET_PUZZLES,
    SET_PUZZLES_RESPONSE,
    SET_SELECTED_ALBUM_ID,
    SET_TOTAL_RESULTS,
    SET_XCSRF_TOKEN,
    TOGGLE_GALLERY_LOADING,
    TOGGLE_LOADING,
    TRIGGER_DOWNLOAD_ZIP
} from '../actions/types';

const initialState = {
    albumInfo: ['empty'],
    albumsList: ['empty'],
    selectedAlbumID: 'empty',
    puzzlesResponse: ['empty'],
    puzzles: ['empty'],
    photosToRender: ['empty'],
    isLoading: true,
    galleryIsLoading: true,
    eventAccessCode: 'empty',//'589089',//453045//996167
    attendee: 'empty',//'salon2@mariage.pro',//Fbracq@eventstory.live//fbracq@eventstory.live
    albumOwnerID: 'empty',
    totalResults: null,
    xcsrfToken: 'empty',
    requestFetch: false,
    authStatus: true,//false
    language: 'empty',//'empty',
    buttonType: 'Create photo book',
    downloadingZip: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TRIGGER_DOWNLOAD_ZIP:
            return {
                ...state,
                downloadingZip: action.payload
            };
        case SET_PUZZLES_RESPONSE:
            return {
                ...state,
                puzzlesResponse: action.payload
            };
        case SET_ALBUM_INFO:
            return {
                ...state,
                albumInfo: action.payload
            };
        case SET_ALBUMS_LIST:
            return {
                ...state,
                albumsList: action.payload
            };
        case SET_SELECTED_ALBUM_ID:
            return {
                ...state,
                selectedAlbumID: action.payload
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
        case ENABLE_FETCH_REQUEST:
            return {
                ...state,
                requestFetch: true
            };
        case DISABLE_FETCH_REQUEST:
            return {
                ...state,
                requestFetch: false
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
        case SET_PUZZLES:
            return {
                ...state,
                puzzles: action.payload
            };
        case SET_AUTHSTATUS:
            return {
                ...state,
                authStatus: action.payload
            };
        case SET_LANGUAGE:
            return {
                ...state,
                language: action.payload
            };
        case SET_BUTTON_TYPE:
            return {
                ...state,
                buttonType: action.payload
            };
        default:
            return state;
    }
}