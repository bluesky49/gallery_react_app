// Toggle fullscreen
export const fullscreenON = () => dispatch => {
    dispatch({
        type: 'TOGGLE_FULLSCREEN'
    })
};

// Turn off fullscreen
export const fullscreenOFF = () => dispatch => {
    dispatch({
        type: 'DISABLE_FULLSCREEN'
    })
};

// Toggle lightbox
export const toggleLightbox = () => dispatch => {
    dispatch({
        type: 'TOGGLE_LIGHTBOX'
    });
    dispatch({
        type: 'CLOSE_SEARCH_PANEL'
    })
};

// Turn off lightbox
export const disableLightbox = () => dispatch => {
    dispatch({
        type: 'DISABLE_LIGHTBOX'
    })
};

// Temporary disable fullscreen
export const disableTempFullscreen = () => dispatch => {
    dispatch({
        type: 'DISABLE_TEMP_FULLSCREEN'
    })
};

// Enable fullscreen after temp. disable
export const toggleTempFullscreen = () => dispatch => {
    dispatch({
        type: 'TOGGLE_TEMP_FULLSCREEN'
    })
};
// Open search panel
export const openSearchPanel = () => dispatch => {
    dispatch({
        type: 'OPEN_SEARCH_PANEL'
    })
};
// Close search panel
export const closeSearchPanel = () => dispatch => {
    dispatch({
        type: 'CLOSE_SEARCH_PANEL'
    })
};
export const toggleFaceTagging = response => dispatch => {
    dispatch({
        type: 'TOGGLE_FACE_TAGGING',
        payload: response
    })
};
export const toggleControls = response => dispatch => {
    dispatch({
        type: 'TOGGLE_CONTROLS',
        payload: response
    })
};