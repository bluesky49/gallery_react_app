import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from "styled-components";
import ImageMapper from 'react-image-mapper';
import Measure from 'react-measure';

import {toggleFaceTagging} from '../../actions/viewActions';
import {Button, Icon, Tooltip} from "antd";

//CSS starts
const FaceTaggingWrapper = styled.div`
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 16777201;
          width: 100%;
          height: auto;
          padding-bottom: 65px;
         `;
const FaceTaggingInner = styled.div`
          position: relative;
          width: 100%;
          z-index: 16777201;
         `;
const ButtonWrapper = styled.div`
          margin: 24px 0 10px 0;
`;
const StyledButton = styled(Button)`
    border-style: none !important;
    background-color: rgba(30, 30, 30, 0.8) !important;
    box-shadow: 2px 2px 4px rgba(24, 144, 255, 0.4) !important;
     &:hover {
    box-shadow: 2px 2px 10px rgba(24, 144, 255, 0.9) !important;
  }
`;

//CSS Ends

class FaceTagComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: -1
        };
    }

    doneTagging = () => {
        this.props.toggleFaceTagging(false);
    };

    render() {
        const {currentImage} = this.props;
        const maxWidth = this.props.data.photosToRender[currentImage].width;
        const {width} = this.state;
        const src = this.props.data.photosToRender[currentImage].originalSizeSRC;
        /*const currentLightboxImage = this.lightboxRef.current.props.currentImage;
        const originalSizeSRC = this.props.data.photosToRender[currentLightboxImage].originalSizeSRC;*/

        const map = {
            name: 'generated',
            areas: [
                {
                    name: "attendee 1",
                    shape: "rect",
                    coords: [700, 161, 787, 262]
                }
            ]
        };
        return (
            <Measure bounds onResize={(contentRect) => this.setState({width: contentRect.bounds.width})}>
                {({measureRef}) => (
                    <FaceTaggingWrapper>
                        <FaceTaggingInner ref={measureRef}
                                          style={{
                                              maxWidth: maxWidth,
                                          }}>
                            <ButtonWrapper>
                                <Tooltip placement="right" title="Done tagging" overlayClassName="lightbox__tooltip">
                                    <StyledButton type="ghost" onClick={this.doneTagging}>
                                        <Icon type="check" theme="outlined"
                                              style={{fontSize: '22px', color: 'rgba(18, 175, 10, 1)'}}/>
                                    </StyledButton>
                                </Tooltip>
                            </ButtonWrapper>

                            <ImageMapper
                                src={src}
                                map={map}
                                imgWidth={maxWidth}
                                width={width}
                            />
                        </FaceTaggingInner>
                    </FaceTaggingWrapper>
                )}
            </Measure>
        )
    }
}

FaceTagComponent.propTypes = {
    photosToRender: PropTypes.array,
};

const
    mapStateToProps = state => ({
        view: state.view,
        data: state.data
    });

export default connect(mapStateToProps, {
    toggleFaceTagging
})(FaceTagComponent);
