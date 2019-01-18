import React, {Component} from 'react';
import Gallery from "react-photo-gallery";
import Measure from 'react-measure';
import Lightbox from 'react-images';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {toggleLightbox, disableLightbox} from '../actions/viewActions';

class GalleryComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            galleryPhotos: [],
            width: -1,
            currentImage: 0,
        };
    }

    openLightbox = (event, obj) => {
        this.setState({
            currentImage: obj.index,
        });
        this.props.toggleLightbox();
    };
    closeLightbox = () => {
        this.setState({
            currentImage: 0,
        });
        this.props.disableLightbox();
    };
    gotoPrevious = () => {
        this.setState({
            currentImage: this.state.currentImage - 1,
        });
    };
    gotoNext = () => {
        this.setState({
            currentImage: this.state.currentImage + 1,
        });
    };

    componentDidUpdate(prevProps) {
        if (this.props.data.photosToRender !== prevProps.data.photosToRender && this.props.data.photosToRender !== ['empty']) {

            const galleryPhotos = this.props.data.photosToRender.map((item) => {
                return (
                    {
                        src: item.src,
                        height: item.height,
                        width: item.width,
                        alt: item.alt,
                    }
                )
            });
            this.setState({
                galleryPhotos: galleryPhotos
            });
        }
    }

    render() {
        const width = this.state.width;

        return (
            <Measure bounds onResize={(contentRect) => this.setState({width: contentRect.bounds.width})}>
                {
                    ({measureRef}) => {
                        if (width < 1) {
                            return <div ref={measureRef}></div>;
                        }
                        let columns = 1;
                        if (width >= 268) {
                            columns = 2;
                        }
                        if (width >= 536) {
                            columns = 3;
                        }
                        if (width >= 804) {
                            columns = 4;
                        }
                        if (width >= 1072) {
                            columns = 5;
                        }
                        if (width >= 1340) {
                            columns = 6;
                        }
                        if (width >= 1608) {
                            columns = 7;
                        }
                        if (width >= 1876) {
                            columns = 8;
                        }
                        if (width >= 2144) {
                            columns = 9;
                        }
                        if (width >= 2412) {
                            columns = 10;
                        }
                        if (width >= 2680) {
                            columns = 11;
                        }
                        if (width >= 2948) {
                            columns = 12;
                        }
                        if (width >= 3216) {
                            columns = 13;
                        }
                        if (width >= 3484) {
                            columns = 14;
                        }
                        if (width >= 3752) {
                            columns = 15;
                        }
                        if (width >= 4020) {
                            columns = 16;
                        }
                        return <div ref={measureRef}>
                            <Gallery photos={this.state.galleryPhotos} columns={columns} onClick={this.openLightbox}/>
                            <Lightbox images={this.props.data.photosToRender}
                                      onClose={this.closeLightbox}
                                      onClickPrev={this.gotoPrevious}
                                      onClickNext={this.gotoNext}
                                      currentImage={this.state.currentImage}
                                      isOpen={this.props.view.lightboxIsOpen}
                            />
                        </div>
                    }
                }
            </Measure>
        );
    }
}

GalleryComponent.propTypes = {
    toggleLightbox: PropTypes.func,
    disableLightbox: PropTypes.func,
    lightboxIsOpen: PropTypes.bool,
    photosToRender: PropTypes.array
};

const mapStateToProps = state => ({
    view: state.view,
    data: state.data
});

export default connect(mapStateToProps, {toggleLightbox, disableLightbox})(GalleryComponent);
