// Toggle fullscreen
export const fullscreenON = () => dispatch => {
    dispatch({
        type:'TOGGLE_FULLSCREEN'
    })
};

// Turn off fullscreen
export const fullscreenOFF = () => dispatch => {
    dispatch({
        type:'DISABLE_FULLSCREEN'
    })
};

// Toggle lightbox
export const toggleLightbox = () => dispatch => {
    dispatch({
        type:'TOGGLE_LIGHTBOX'
    })
};

// Turn off lightbox
export const disableLightbox = () => dispatch => {
    dispatch({
        type:'DISABLE_LIGHTBOX'
    })
};

// Temporary disable fullscreen
export const disableTempFullscreen = () => dispatch => {
    dispatch({
        type:'DISABLE_TEMP_FULLSCREEN'
    })
};

// Enable fullscreen after temp. disable
export const toggleTempFullscreen = () => dispatch => {
    dispatch({
        type:'TOGGLE_TEMP_FULLSCREEN'
    })
};