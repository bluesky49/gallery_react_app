import React, {Component} from 'react';
import Gallery from "react-photo-gallery";
import Measure from 'react-measure';
import Lightbox from 'react-images';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button, Icon, Modal} from "antd";
import axios from "axios";
import Select from 'react-select';

import {toggleLightbox, disableLightbox} from '../actions/viewActions';
import {setAlbumResponse, setXcsrfToken} from '../actions/dataActions';
import {fetchPassword, fetchUsername, prodURL} from "../keys";

class GalleryComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            galleryPhotos: [],
            width: -1,
            currentImage: 0,
            selectedOption: null,
            albums: [],
            albumsWithPhoto: []
        };
        this.lightboxRef = React.createRef();
    }

    fetchAllAlbums() {
        const fetchURL = `${prodURL}/jsonapi/node/album/?fields[node--album]=field_album_owner,title&filter[owner-filter][condition][path]=field_album_owner.field_email&filter[owner-filter][condition][value]=${this.props.data.attendee}&filter[event-filter][condition][path]=field_album_owner.field_event_reference.field_event_access_code&filter[event-filter][condition][value]=${this.props.data.eventAccessCode}`;

        axios({
            method: 'get',
            url: `${fetchURL}`,
            auth: {
                username: `${fetchUsername}`,
                password: `${fetchPassword}`
            },
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            }
        })
            .then(response => {
                this.props.setAlbumResponse(response.data.data)
            })
            .catch(error => console.log(error));
    }

    async fetchAlbumsSpecificToCurrentPhoto() {

            const currentLightboxImage = this.lightboxRef.current.props.currentImage;
            const uuid = this.props.data.photosToRender[currentLightboxImage].uuid;
            const fetchURL = `${prodURL}/jsonapi/node/album/?fields[node--album]=field_album_owner,title&filter[owner-filter][condition][path]=field_album_owner.field_email&filter[owner-filter][condition][value]=${this.props.data.attendee}&filter[event-filter][condition][path]=field_album_owner.field_event_reference.field_event_access_code&filter[event-filter][condition][value]=${this.props.data.eventAccessCode}&filter[puzzle-filter][condition][path]=field_puzzles.id&filter[puzzle-filter][condition][operator]=%3D&filter[puzzle-filter][condition][value]=${uuid}`;

            await axios({
                method: 'get',
                url: `${fetchURL}`,
                auth: {
                    username: `${fetchUsername}`,
                    password: `${fetchPassword}`
                },
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                }
            }).then(response => response.data.data.map((item) => {
                return (
                    {
                        label: item.attributes.title,
                        value: item.id
                    }
                )
            })).then(response => {

                this.setState({
                    albumsWithPhoto: response
                });
            })
                .catch(error => console.log(error));
    }

    openLightbox2 = async () => {
        await this.fetchAlbumsSpecificToCurrentPhoto();
        this.props.toggleLightbox();
    };

    openLightbox = (event, obj) => {
        this.setState({
                currentImage: obj.index,
            }, () => {
                this.openLightbox2()
            }
        )
    };

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

    photoAdded = () => {
        let secondsToGo = 2;
        const modal = Modal.success({
            title: 'Photo added to album!',
            zIndex: 16777201,
            width: 300,
            centered: true
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    };
    photoDeleted = () => {
        let secondsToGo = 2;
        const modal = Modal.success({
            title: 'Photo deleted from album!',
            zIndex: 16777201,
            width: 300,
            centered: true
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    };
    selectAlbumMessage = () => {
        let secondsToGo = 2;
        const modal = Modal.error({
            title: 'Please select the album!',
            zIndex: 16777201,
            width: 300,
            centered: true
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
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
        if (this.state.selectedOption) {
            const currentLightboxImage = this.lightboxRef.current.props.currentImage;
            const uuid = this.props.data.photosToRender[currentLightboxImage].uuid;
            const album_uuid = this.state.selectedOption.value;

            axios({
                method: 'post',
                url: `${prodURL}/jsonapi/node/album/${album_uuid}/relationships/field_puzzles`,
                auth: {
                    username: `${fetchUsername}`,
                    password: `${fetchPassword}`
                },
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    'X-CSRF-Token': this.props.data.xcsrfToken
                },
                data: {
                    "data": [
                        {
                            "type": "node--puzzle",
                            "id": uuid
                        }
                    ]
                }
            }).then(response => {
                this.fetchAllAlbums();
                this.fetchAlbumsSpecificToCurrentPhoto();
            }).then(response => {
                this.photoAdded();
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
        } else {
            this.selectAlbumMessage();
        }
    };
    deleteFromAlbum = () => {
        if (this.state.selectedOption) {
            const currentLightboxImage = this.lightboxRef.current.props.currentImage;
            const uuid = this.props.data.photosToRender[currentLightboxImage].uuid;
            const album_uuid = this.state.selectedOption.value;

            axios({
                method: 'delete',
                url: `${prodURL}/jsonapi/node/album/${album_uuid}/relationships/field_puzzles`,
                auth: {
                    username: `${fetchUsername}`,
                    password: `${fetchPassword}`
                },
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    'X-CSRF-Token': this.props.data.xcsrfToken
                },
                data: {
                    "data": [
                        {
                            "type": "node--puzzle",
                            "id": uuid
                        }
                    ]
                }
            }).then(response => {
                this.fetchAllAlbums();
                this.fetchAlbumsSpecificToCurrentPhoto();
            }).then(response => {
                this.photoDeleted();
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
        } else {
            this.selectAlbumMessage();
        }
    };

    handleChange = (selectedOption) => {
        const selectedOptionLast = selectedOption[selectedOption.length - 1];
        this.setState({
            selectedOption: selectedOptionLast,
        });
    };

    componentDidMount() {
        this.fetchAllAlbums();
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
                        alt: item.alt,
                    }
                )
            });
            this.setState({
                galleryPhotos: galleryPhotos
            });
        }
        if (this.props.view.lightboxIsOpen !== prevProps.view.lightboxIsOpen &&
            this.props.view.lightboxIsOpen === true) {
            this.fetchAlbumsSpecificToCurrentPhoto();
            const albums = this.props.data.albumResponse.map((item) => {
                return (
                    {
                        label: item.attributes.title,
                        value: item.id
                    }
                )
            });
            this.setState({
                albums: albums,
            });
        }
        /*
            const currentLightboxImage = this.lightboxRef.current.props.currentImage;

                        if (this.props.data.photosToRender[currentLightboxImage].attendeeEmail) {

                            const attendeeEmails = this.props.data.photosToRender[currentLightboxImage].attendeeEmail;

                            const albumsWithPhoto = attendeeEmails.reduce((total, item, index) => {
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
                                albumsWithPhoto: albumsWithPhoto
                            });
                        }*/
    }

    render() {
        const width = this.state.width;
        const ButtonGroup = Button.Group;
        const {albums} = this.state;
        const {albumsWithPhoto} = this.state;

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
                    //value={this.state.selectedOption}
                    defaultValue={albumsWithPhoto}
                    isMulti
                    onChange={this.handleChange}
                    options={albums}
                    key="2"
                    placeholder="Select album"
                /> : null}
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
                            <Gallery photos={this.state.galleryPhotos} columns={columns}
                                     onClick={this.openLightbox}/>

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

GalleryComponent
    .propTypes = {
    toggleLightbox: PropTypes.func,
    disableLightbox: PropTypes.func,
    lightboxIsOpen: PropTypes.bool,
    photosToRender: PropTypes.array,
    albumResponse: PropTypes.array,
    setXcsrfToken: PropTypes.func,
    xcsrfToken: PropTypes.string
};

const
    mapStateToProps = state => ({
        view: state.view,
        data: state.data
    });

export default connect(mapStateToProps, {
    toggleLightbox,
    disableLightbox,
    setAlbumResponse,
    setXcsrfToken
})(GalleryComponent);