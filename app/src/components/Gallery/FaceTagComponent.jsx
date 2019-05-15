import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from "styled-components";
import ImageMapper from 'react-image-mapper';
import Measure from 'react-measure';

import {toggleLightbox, disableLightbox} from '../../actions/viewActions';

//CSS starts
const FaceTaggingWrapper = styled.div`
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 16777201;
          width: 100%;
          height: 100vh;
         `;
const FaceTaggingInner = styled.div`
          position: relative;
          width: 100%;
          z-index: 16777201;
         `;
//CSS Ends

class FaceTagComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: -1
        };
    }
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
    toggleLightbox,
    disableLightbox
})(FaceTagComponent);
