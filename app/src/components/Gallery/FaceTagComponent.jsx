import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from "styled-components";
import ImageMapper from 'react-image-mapper';
import Measure from 'react-measure';

import {toggleLightbox, disableLightbox} from '../../actions/viewActions';


//CSS starts

//CSS Ends


class FaceTagComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: -1
        };
    }

    render() {
        const { width } = this.state;

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
                {({ measureRef }) => (
                    <div className="mapper__image--wrapper" ref={measureRef}>
                        <ImageMapper src="https://cdn.filestackcontent.com/output=format:pjpg,strip:true,quality:80,compress:true/cache=expiry:31536000/security=policy:eyJleHBpcnkiOjIwODAwNzI4MDB9,signature:b2d2458ecac6d894570690d1a64897201524e857d3f813e7507763c7d99c513c/vEhHAcexRi2RWA520QRr"
                                     map={map}
                                     imgWidth={1024}
                                     width={width}
                        />
                    </div>
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
