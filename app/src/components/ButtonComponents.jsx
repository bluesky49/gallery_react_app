import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Fullscreenable from 'react-fullscreenable';
import {Button, Icon} from "antd";
import styled from "styled-components";
import ScrollComponent from "./ScrollComponent";
import {connect} from 'react-redux';

import {fullscreenON, fullscreenOFF, rowOn, colOn, disableTempFullscreen, toggleTempFullscreen} from '../actions/viewActions';

// CSS starts
const StyledFullScreen = styled.div`
    background-color: white;
`;
const FullScreenButtonWrapper = styled.div`
    text-align: right;
    position: absolute;
    top: 14px;
    right: 30px;
    z-index: 9999;
`;

const RowColButtonWrapper = styled.div`
    text-align: right;
    position: absolute;
    top: 14px;
    right: 100px;
    z-index: 9999;
`;

const StyledButton = styled(Button)`
    border-style: none !important;
    background-color: rgba(30, 30, 30, 0.8) !important;
    box-shadow: 2px 2px 4px rgba(24, 144, 255, 0.4) !important;
     &:hover {
    box-shadow: 2px 2px 10px rgba(24, 144, 255, 0.9) !important;
  }
`;

// CSS ends

export class ButtonComponents extends Component {
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

    toggleRowCol = (ev) => {
        ev.preventDefault();
        const {view: {isRowView}, rowOn, colOn} = this.props;
        if(isRowView) {
            colOn();
        }else {
            rowOn();
        }
    }

    render() {
        const {isFullscreen, toggleFullscreen, view: {isRowView}} = this.props;

        const fullscreenBut = isFullscreen ?
            <Icon type="fullscreen-exit" theme="outlined" style={{fontSize: '22px', color: '#1890ff'}}/>
            :
            <Icon type="fullscreen" theme="outlined" style={{fontSize: '22px', color: '#1890ff'}}/>;
        const rowcolBut = isRowView ?
            <Icon type="column-height" theme="outlined" style={{fontSize: '22px', color: '#1890ff'}}/>
            :
            <Icon type="column-width" theme="outlined" style={{fontSize: '22px', color: '#1890ff'}}/>;
        return (
            <StyledFullScreen>
                {this.props.view.showControls ?
                    <RowColButtonWrapper>
                        <StyledButton type="ghost" onClick={this.toggleRowCol}>
                            {rowcolBut}
                        </StyledButton>
                    </RowColButtonWrapper> : null}

                {this.props.view.showControls ?
                    <FullScreenButtonWrapper>
                        <StyledButton type="ghost" onClick={toggleFullscreen}>
                            {fullscreenBut}
                        </StyledButton>
                    </FullScreenButtonWrapper> : null}

                <ScrollComponent isFullscreen={isFullscreen}/>
            </StyledFullScreen>
        );
    }
}

ButtonComponents.displayName = 'ButtonComponents';

ButtonComponents.propTypes = {
    isRowView: PropTypes.bool,
    toggleRowCol: PropTypes.func,
    isFullscreen: PropTypes.bool,
    toggleFullscreen: PropTypes.func,
    viewportDimensions: PropTypes.object,
    fullscreenON: PropTypes.func,
    fullscreenOFF: PropTypes.func,
    lightboxIsOpen: PropTypes.bool,
    rowOn: PropTypes.func,
    colOn: PropTypes.func,
    fullscreenTempDisabled: PropTypes.bool,
    showControls: PropTypes.bool
};

const ButtonToggleComponent = Fullscreenable()(ButtonComponents);

const mapStateToProps = state => ({
    view: state.view
});

export default connect(mapStateToProps, {
    fullscreenON,
    fullscreenOFF,
    rowOn,
    colOn,
    disableTempFullscreen,
    toggleTempFullscreen
})(ButtonToggleComponent);