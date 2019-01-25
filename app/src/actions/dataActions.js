// Set initial response
export const setInitialResponse = response => dispatch => {
    dispatch({
        type:'SET_INITIAL_RESPONSE',
        payload: response
    })
};

// Set final response
export const setFinalResponse = response => dispatch => {
    dispatch({
        type:'SET_FINAL_RESPONSE',
        payload: response
    })
};

// Set photos to be rendered
export const setPhotosToRender = response => dispatch => {
    dispatch({
        type:'SET_PHOTOS_TO_RENDER',
        payload: response
    })
};

// Toggle loading
export const toggleLoading = () => dispatch => {
    dispatch({
        type:'TOGGLE_LOADING'
    })
};

// Disable loading
export const disableLoading = () => dispatch => {
    dispatch({
        type:'DISABLE_LOADING'
    })
};

// Toggle gallery loading
export const toggleGalleryLoading = () => dispatch => {
    dispatch({
        type:'TOGGLE_GALLERY_LOADING'
    })
};

// Disable gallery loading
export const disableGalleryLoading = () => dispatch => {
    dispatch({
        type:'DISABLE_GALLERY_LOADING'
    })
};

// Set Event code
export const setEventCode = response => dispatch => {
    dispatch({
        type:'SET_EVENT_CODE',
        payload: response
    })
};

// Set total pages for the pager
export const setTotalResults = response => dispatch => {
    dispatch({
        type:'SET_TOTAL_RESULTS',
        payload: response
    })
};

// Set search result
export const setSearchResult = response => dispatch => {
    dispatch({
        type:'SET_SEARCH_RESULT',
        payload: response
    })
};