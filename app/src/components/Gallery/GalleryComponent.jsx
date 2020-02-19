import React, {Component} from 'react';
import Measure from 'react-measure';
import LightboxComponent from './LightboxComponent'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import axios from "axios";
import {prodURL} from "../../keys";

import {setXcsrfToken} from '../../actions/dataActions';

class GalleryComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            galleryPhotos: [],
            width: -1,
        };
    }

    getXcsrfToken() {
        const fetchURL = `${prodURL}/rest/session/token`;

        axios({
            method: 'get',
            url: `${fetchURL}`,
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            }
        })
            .then(response => {
                this.props.setXcsrfToken(response.data)
            })
            .catch(error => console.log(error));
    }

    componentDidMount() {
        this.getXcsrfToken();
    }

    componentDidUpdate(prevProps) {
        if (this.props.data.photosToRender !== prevProps.data.photosToRender && this.props.data.photosToRender !== ['empty']) {

            const galleryPhotos = this.props.data.photosToRender.map((item) => {
                return (
                    {
                        src: item.src,
                        height: item.height,
                        width: item.width,
                        alt: item.alt
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
                            <LightboxComponent columns={columns} photos={this.state.galleryPhotos}/>
                        </div>
                    }
                }
            </Measure>
        );
    }
}

GalleryComponent.propTypes = {
    photosToRender: PropTypes.array,
    setXcsrfToken: PropTypes.func,
    xcsrfToken: PropTypes.string
};

const
    mapStateToProps = state => ({
        data: state.data,
        view: state.view
    });

export default connect(mapStateToProps, {
    setXcsrfToken
})(GalleryComponent);