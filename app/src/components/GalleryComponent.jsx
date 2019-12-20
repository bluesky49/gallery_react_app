import React, {Component} from 'react';
import Measure from 'react-measure';
import Gallery from "react-photo-gallery";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class GalleryComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: -1,
        };
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
                            <Gallery direction={"column"} columns={columns} photos={this.props.data.photosToRender}/>
                        </div>
                    }
                }
            </Measure>
        );
    }
}

GalleryComponent.propTypes = {
    photosToRender: PropTypes.array
};

const
    mapStateToProps = state => ({
        data: state.data
    });

export default connect(mapStateToProps)(GalleryComponent);