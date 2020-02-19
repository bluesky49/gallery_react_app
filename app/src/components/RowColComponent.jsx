import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Icon} from "antd";
import styled from "styled-components";
import ScrollComponent from "./ScrollComponent";
import {connect} from 'react-redux';

import {rowOn, colOn} from '../actions/viewActions';

// CSS starts
const StyledRowColScreen = styled.div`
    background-color: white;
`;
const ButtonWrapper = styled.div`
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

export class RowColToggleComponent extends Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.isRowView !== nextProps.isRowView) {
            // Fullscreen status has changed.
            switch (nextProps.isRowView) {
                case false:
                    return this.props.colOn();
                case true:
                    return this.props.rowOn();
            }
        }
    }

    render() {
        const {isRowView, toggleRowCol} = this.props;

        const buttonLabel = isRowView ?
            <Icon type="column-height" theme="outlined" style={{fontSize: '22px', color: '#1890ff'}}/>
            :
            <Icon type="column-width" theme="outlined" style={{fontSize: '22px', color: '#1890ff'}}/>;

        return (
            <StyledRowColScreen>

                {this.props.view.showControls ?
                    <ButtonWrapper>
                        <StyledButton type="ghost" onClick={toggleRowCol}>
                            {buttonLabel}
                        </StyledButton>
                    </ButtonWrapper> : null}

                <ScrollComponent isRowView={isRowView}/>
            </StyledRowColScreen>
        );
    }
}

RowColToggleComponent.displayName = 'RowColToggleComponent';

RowColToggleComponent.propTypes = {
    isRowView: PropTypes.bool,
    toggleRowCol: PropTypes.func,
    viewportDimensions: PropTypes.object,
    rowOn: PropTypes.func,
    colOn: PropTypes.func,
    showControls: PropTypes.bool
};

const mapStateToProps = state => ({
    view: state.view
});

export default connect(mapStateToProps, {
    rowOn,
    colOn
})(RowColToggleComponent);