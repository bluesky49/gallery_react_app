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

// Toggle loading
export const toggleGalleryLoading = () => dispatch => {
    dispatch({
        type:'TOGGLE_GALLERY_LOADING'
    })
};

// Disable loading
export const disableGalleryLoading = () => dispatch => {
    dispatch({
        type:'DISABLE_GALLERY_LOADING'
    })
};