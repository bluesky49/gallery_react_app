import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Fullscreenable from 'react-fullscreenable';
import {Button, Icon} from "antd";
import styled from "styled-components";
import ScrollComponent from "./ScrollComponent";
import {connect} from 'react-redux';

import {fullscreenON, fullscreenOFF, disableTempFullscreen, toggleTempFullscreen} from '../actions/viewActions';

// CSS starts
const StyledFullScreen = styled.div`
    background-color: white;
`;
const ButtonWrapper = styled.div`
    text-align: right;
    position: absolute;
    top: 15px;
    right: 30px;
    z-index: 9999;
`;

// CSS ends

export class FullscreenComponent extends Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.isFullscreen !== nextProps.isFullscreen) {
            // Fullscreen status has changed.
            switch (nextProps.isFullscreen) {
                case false:
                    return this.props.fullscreenOFF();
                case true:
                    return this.props.fullscreenON();
            }
        }
        if (this.props.view.lightboxIsOpen !== nextProps.view.lightboxIsOpen) {

            const {toggleFullscreen} = this.props;

            switch (nextProps.isFullscreen) {
                case true:
                    let a = toggleFullscreen();
                    let b = this.props.toggleTempFullscreen();
                    return a && b
            }

            switch (nextProps.view.fullscreenTempDisabled) {
                case true:
                    let a = toggleFullscreen();
                    let b = this.props.disableTempFullscreen();
                    return a && b
            }
        }
    }

    render() {
        const {isFullscreen, toggleFullscreen} = this.props;

        const buttonLabel = isFullscreen ?
            <Icon type="fullscreen-exit" theme="outlined" style={{fontSize: '24px', color: '#1890ff'}}/>
            :
            <Icon type="fullscreen" theme="outlined" style={{fontSize: '24px', color: '#1890ff'}}/>;

        return (
            <StyledFullScreen>
                <ButtonWrapper>
                    <Button type="ghost" onClick={toggleFullscreen}>
                        {buttonLabel}
                    </Button>
                </ButtonWrapper>
                <ScrollComponent isFullscreen={isFullscreen}/>
            </StyledFullScreen>
        );
    }
}

FullscreenComponent.displayName = 'FullscreenComponent';

FullscreenComponent.propTypes = {
    isFullscreen: PropTypes.bool,
    toggleFullscreen: PropTypes.func,
    viewportDimensions: PropTypes.object,
    fullscreenON: PropTypes.func,
    fullscreenOFF: PropTypes.func,
    lightboxIsOpen: PropTypes.bool,
    fullscreenTempDisabled: PropTypes.bool
};

const FullscreenToggleComponent = Fullscreenable()(FullscreenComponent);

const mapStateToProps = state => ({
    view: state.view
});

export default connect(mapStateToProps, {fullscreenON, fullscreenOFF, disableTempFullscreen, toggleTempFullscreen})(FullscreenToggleComponent);