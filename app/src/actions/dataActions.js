// Set puzzles response
export const setPuzzlesResponse = response => dispatch => {
    dispatch({
        type: 'SET_PUZZLES_RESPONSE',
        payload: response
    })
};
// Set photos to be rendered
export const setPhotosToRender = response => dispatch => {
    dispatch({
        type: 'SET_PHOTOS_TO_RENDER',
        payload: response
    })
};
// Toggle loading
export const toggleLoading = () => dispatch => {
    dispatch({
        type: 'TOGGLE_LOADING'
    })
};
// Disable loading
export const disableLoading = () => dispatch => {
    dispatch({
        type: 'DISABLE_LOADING'
    })
};
// Toggle gallery loading
export const toggleGalleryLoading = () => dispatch => {
    dispatch({
        type: 'TOGGLE_GALLERY_LOADING'
    })
};
// Disable gallery loading
export const disableGalleryLoading = () => dispatch => {
    dispatch({
        type: 'DISABLE_GALLERY_LOADING'
    })
};
// Set Event code
export const setEventCode = response => dispatch => {
    dispatch({
        type: 'SET_EVENT_CODE',
        payload: response
    })
};
// Set Attendee
export const setAttendee = response => dispatch => {
    dispatch({
        type: 'SET_ATTENDEE',
        payload: response
    })
};
// Set total pages for the pager
export const setTotalResults = response => dispatch => {
    dispatch({
        type: 'SET_TOTAL_RESULTS',
        payload: response
    })
};
// Set response from Drupal
export const setAlbumInfo = response => dispatch => {
    dispatch({
        type: 'SET_ALBUM_INFO',
        payload: response
    })
};
export const setAlbumsList = response => dispatch => {
    dispatch({
        type: 'SET_ALBUMS_LIST',
        payload: response
    })
};
// Set selected album ID
export const setSelectedAlbumID = response => dispatch => {
    dispatch({
        type: 'SET_SELECTED_ALBUM_ID',
        payload: response
    })
};
// Set X-CSRF-Token
export const setXcsrfToken = response => dispatch => {
    dispatch({
        type: 'SET_XCSRF_TOKEN',
        payload: response
    })
};
// Set Album Owner ID
export const setAlbumOwnerID = response => dispatch => {
    dispatch({
        type: 'SET_ALBUM_OWNER_ID',
        payload: response
    })
};
// Fetch data using DataFetchingComponent
export const enableFetchRequest = () => dispatch => {
    dispatch({
        type: 'ENABLE_FETCH_REQUEST'
    })
};
// Set Album Owner ID
export const disableFetchRequest = () => dispatch => {
    dispatch({
        type: 'DISABLE_FETCH_REQUEST'
    })
};
// Set Puzzles
export const setPuzzles = response => dispatch => {
    dispatch({
        type: 'SET_PUZZLES',
        payload: response
    })
};
export const setAuthStatus = response => dispatch => {
    dispatch({
        type: 'SET_AUTHSTATUS',
        payload: response
    })
};
export const downloadZIP = response => dispatch => {
    dispatch({
        type: 'TRIGGER_DOWNLOAD_ZIP',
        payload: response
    })
};
// Set language
export const setLanguage = response => dispatch => {
    dispatch({
        type: 'SET_LANGUAGE',
        payload: response
    })
};
// Set button type
export const setButtonType = response => dispatch => {
    dispatch({
        type: 'SET_BUTTON_TYPE',
        payload: response
    })
};