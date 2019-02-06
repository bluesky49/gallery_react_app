import React, {Component} from 'react';
import Gallery from "react-photo-gallery";
import Measure from 'react-measure';
import Lightbox from 'react-images';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Form, Button, Icon, Input} from "antd";
import axios from "axios";
import Select from 'react-select';

import {toggleLightbox, disableLightbox} from '../actions/viewActions';
import {fetchPassword, fetchUsername, prodURL} from "../keys";


class GalleryComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            galleryPhotos: [],
            width: -1,
            currentImage: 0,
            selectedOption: null,
            albums: []
        };
        this.lightboxRef = React.createRef();
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
    addToAlbum = () => {
        const currentLightboxImage = this.lightboxRef.current.props.currentImage;
        const uuid = this.props.data.photosToRender[currentLightboxImage].uuid;

        axios({
            method: 'post',
            url: `${prodURL}/jsonapi/node/album`,
            auth: {
                username: `${fetchUsername}`,
                password: `${fetchPassword}`
            },
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            },
            data: {
                "data": {
                    "type": "node--album",
                    "attributes": {
                        "title": "Test title"
                    },
                    "relationships": {
                        "field_puzzles": {
                            "data": [
                                {
                                    "type": "node--puzzle",
                                    "id": uuid
                                }
                            ]
                        }
                    }
                }
            }
        })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
    };
    deleteFromAlbum = () => {
        console.log("delete button is pressed")
    };

    handleChange = (selectedOption) => {
        this.setState({selectedOption});
        console.log(`Option selected:`, selectedOption);
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
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
        if (this.props.view.lightboxIsOpen !== prevProps.view.lightboxIsOpen &&
            this.props.view.lightboxIsOpen === true &&
            this.props.data.photosToRender[this.lightboxRef.current.props.currentImage].albumTitles !== null) {
            const currentLightboxImage = this.lightboxRef.current.props.currentImage;

            const attendeeEmails = this.props.data.photosToRender[currentLightboxImage].attendeeEmail;

            const albums = attendeeEmails.reduce((total, item, index) => {
                const currentAttendee = this.props.data.attendee;
                const albumTitlesUnfiltered = this.props.data.photosToRender[currentLightboxImage].albumTitles;
                const albumUuidsUnfiltered = this.props.data.photosToRender[currentLightboxImage].albumUuids;

                if (item === currentAttendee) {
                    total.push({
                        label: albumTitlesUnfiltered[index],
                        value: albumUuidsUnfiltered[index]
                    });
                }
                return total;
            }, []);

            this.setState({
                albums: albums,
            });
        } else if (this.props.view.lightboxIsOpen !== prevProps.view.lightboxIsOpen &&
            this.props.view.lightboxIsOpen === true &&
            this.props.data.photosToRender[this.lightboxRef.current.props.currentImage].albumTitles == null) {
            this.setState({
                albums: null,
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const width = this.state.width;
        const ButtonGroup = Button.Group;
        const {albums} = this.state;

        const albumButtons = <div key="11">
            <ButtonGroup key="1">
                <Button size="small" type="primary" onClick={this.addToAlbum}>
                    <Icon type="plus"/>
                    To album
                </Button>;

                <Button size="small" type="danger" onClick={this.deleteFromAlbum}>
                    <Icon type="minus"/>
                    Remove
                </Button>;
            </ButtonGroup>,
            {albums && albums.length ?
                <Select
                    value={this.state.selectedOption}
                    onChange={this.handleChange}
                    options={albums}
                    key="2"
                    placeholder="Select existing album"
                /> : null}
            <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                    {getFieldDecorator('albumName', {
                        rules: [{ required: true, message: 'Please enter album name' }],
                    })(
                        <Input key="3" placeholder="Enter new album name"/>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary">Submit</Button>
                </Form.Item>
            </Form>
        </div>;

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
                                      customControls={[albumButtons]}
                                      ref={this.lightboxRef}
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

const WrappedGalleryComponent = Form.create({name: 'register'})(GalleryComponent);

export default connect(mapStateToProps, {toggleLightbox, disableLightbox})(WrappedGalleryComponent);
