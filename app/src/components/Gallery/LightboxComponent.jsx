import React, {Component} from 'react';
import Gallery from "react-photo-gallery";
import Lightbox from 'react-images';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Icon, Modal} from "antd";
import axios from "axios";
import {IconContext} from "react-icons";
import {IoMdImages} from 'react-icons/io';
import {Keyframes, animated} from 'react-spring/renderprops';
import delay from 'delay';
import styled from "styled-components";
import _ from 'lodash';
import Loader from 'react-loader-spinner';

import {toggleLightbox, disableLightbox} from '../../actions/viewActions';
import {setAlbumResponse, setXcsrfToken} from '../../actions/dataActions';
import {fetchPassword, fetchUsername, prodURL} from "../../keys";

//CSS starts
const StyledAlbumControls = styled.div`
   position: absolute;
   top: 38px;
   left: 0;
   background-color: transparent;
   z-index: 2147483646;
`;
const AlbumInfo = styled.div`
   color: white;
   font-size: 14px !important;
   margin-right: 20px;
`;
const ControlsWrapper = styled.div`
   display: flex;
   flex-wrap: wrap;
   padding: 30px 20px 20px 20px;
`;
const StyledH3 = styled.h3`
   color: white;
   padding: 0 10px;
   font-size: 16px !important;
`;
const StyledUL = styled.ul`
   list-style-type: none !important;
   padding-left: 15px !important;
`;
const StyledLI = styled.li`
   display: flex;
   align-items: center; !important;
   margin-bottom: 7px !important;
`;
const DeleteIcon = styled(Icon)`
   color: red !important;
   padding-right: 5px !important;
   font-weight: bold !important;
   font-size: 18px !important; 
`;
const AddIcon = styled(Icon)`
   color: rgba(18, 175, 10, 1) !important;
   padding-right: 5px !important;
   font-weight: bold !important;
   font-size: 18px !important; 
`;
const StyledAlbumTitles = styled.div`
   display: flex;
   align-items: center;
   margin-top: -4px;
`;
const StyledSpinner = styled.div`
   display: flex;
   padding-right: 5px;
`;
//CSS Ends

const spinner = <StyledSpinner>
    <Loader
    type="Watch"
    color="rgba(18, 175, 10, 1)"
    height="16"
    width="16"/>
        </StyledSpinner>;

// Creates a spring with predefined animation slots
const Sidebar = Keyframes.Spring({
    // Slots can take arrays/chains,
    peek: [
        {x: 0, from: {x: -100}, delay: 500},
        {x: -100, delay: 800},
    ],
    // single items,
    open: {delay: 0, x: 0},
    // or async functions with side-effects
    close: async call => {
        await delay(400)
        await call({delay: 0, x: -100})
    },
})

// Creates a keyframed trail
const Content = Keyframes.Trail({
    peek: [
        {x: 0, opacity: 1, from: {x: -100, opacity: 0}, delay: 600},
        {x: -100, opacity: 0, delay: 0},
    ],
    open: {x: 0, opacity: 1, delay: 100},
    close: {x: -100, opacity: 0, delay: 0},
})

class LightboxComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentImage: 0,
            isLoading: false,
            albums: [],
            albumsWithPhotoUnfiltered: [],
            open: false,
            sidebarWidth: 0
        };
        this.lightboxRef = React.createRef();
    }

    toggle = () => this.setState(state => ({open: !state.open}));

    fetchAllAlbums() {
        const fetchURL = `${prodURL}/jsonapi/node/attendee/?fields[node--attendee]=title,uuid,field_attendee_albums&filter[attendee-filter][condition][path]=field_email&filter[attendee-filter][condition][value]=${this.props.data.attendee}&filter[event-filter][condition][path]=field_event_reference.field_event_access_code&filter[event-filter][condition][value]=${this.props.data.eventAccessCode}&include=field_attendee_albums`;
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
                this.props.setAlbumResponse(response.data)
            })
            .catch(error => console.log(error));
    }

    async fetchAlbumsSpecificToCurrentPhoto(method) {
        let currentLightboxImage;
        switch (method) {
            case 'prev':
                currentLightboxImage = this.lightboxRef.current.props.currentImage - 1;
                break;
            case 'next':
                currentLightboxImage = this.lightboxRef.current.props.currentImage + 1;
                break;
            default:
                currentLightboxImage = this.lightboxRef.current.props.currentImage;
        }

        const uuid = this.props.data.photosToRender[currentLightboxImage].uuid;
        const fetchURL = `${prodURL}/jsonapi/node/puzzle/${uuid}?fields[node--puzzle]=field_albums&include=field_albums`;

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
        }).then(response => response.data.included.map((item) => {
            return (
                {
                    label: item.attributes.title,
                    value: item.id
                }
            )
        }))
            .then(response => {
                this.setState({
                    albumsWithPhotoUnfiltered: response
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
    gotoPrevious2 = () => {
        this.setState({
            currentImage: this.state.currentImage - 1,
            showSelect: true,
            selectedOption: null
        });
    };
    gotoPrevious = async () => {
        this.setState({
            showSelect: false
        });
        await this.fetchAlbumsSpecificToCurrentPhoto('prev');
        this.gotoPrevious2();
    };

    gotoNext2 = () => {
        this.setState({
            currentImage: this.state.currentImage + 1,
            showSelect: true,
            selectedOption: null

        });
    };
    gotoNext = async () => {
        this.setState({
            showSelect: false
        });
        await this.fetchAlbumsSpecificToCurrentPhoto('next');
        this.gotoNext2();
    };

    photoAdded = () => {
        let secondsToGo = 1
        ;
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
        let secondsToGo = 1
        ;
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
        let secondsToGo = 1
        ;
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
            selectedOption: null
        });
        this.props.disableLightbox();
    };
    randomId = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        let randomInt = Math.floor(Math.random() * (max - min)) + min;

        return `${randomInt}`; //The maximum is exclusive and the minimum is inclusive`
    };

    addToAlbum = albumUUID => e => {
        e.preventDefault();
        this.setState({
            isLoading: true
        });

        const currentLightboxImage = this.lightboxRef.current.props.currentImage;
        const uuid = this.props.data.photosToRender[currentLightboxImage].uuid;
        axios({
            method: 'post',
            url: `${prodURL}/jsonapi/node/puzzle/${uuid}/relationships/field_albums`,
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
                        "type": "node--album",
                        "id": albumUUID
                    }
                ]
            }
        }).then((res) => {
            this.fetchAlbumsSpecificToCurrentPhoto();
            this.setState({
                isLoading: false
            });
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
    };

    deleteFromAlbum = albumUUID => e => {
        e.preventDefault();
        this.setState({
            isLoading: true
        });

        const currentLightboxImage = this.lightboxRef.current.props.currentImage;
        const uuid = this.props.data.photosToRender[currentLightboxImage].uuid;
        axios({
            method: 'delete',
            url: `${prodURL}/jsonapi/node/puzzle/${uuid}/relationships/field_albums`,
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
                        "type": "node--album",
                        "id": albumUUID
                    }
                ]
            }
        }).then((res) => {
            this.fetchAlbumsSpecificToCurrentPhoto();
            this.setState({
                isLoading: false
            });
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
    };

    componentDidMount() {
        this.fetchAllAlbums();
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.view.lightboxIsOpen !== prevProps.view.lightboxIsOpen &&
            this.props.view.lightboxIsOpen === true
            && this.props.data.albumResponse.included !== undefined
        ) {

            this.fetchAlbumsSpecificToCurrentPhoto();

            const albums = this.props.data.albumResponse.included.map((item) => {
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

        const {open} = this.state;

        if (open !== prevState.open && open) {
            this.setState({
                sidebarWidth: "100%",
            });
        } else if (open !== prevState.open && !open) {
            setTimeout(() => {
                this.setState({
                    sidebarWidth: '0',
                });
            }, 800);
        }
    }

    render() {
        const {albums, albumsWithPhotoUnfiltered} = this.state;
        const albumsWithPhotoWithDuplicates = albumsWithPhotoUnfiltered.concat(albums).filter(({label, value}) => {
            let foundOnFirst = albumsWithPhotoUnfiltered.some(
                x => x.label === label && x.value === value
            );
            let foundOnSecond = albums.some(
                y => y.label === label && y.value === value
            );
            return (foundOnFirst && foundOnSecond);
        });
        const albumsWithPhoto = _.uniqBy(albumsWithPhotoWithDuplicates, 'value');

        const albumsWithoutPhoto = albums.filter(o =>
            albumsWithPhoto.every(p =>
                !['label', 'value'].some(k => o[k] === p[k])));

        const albumButtons = <ControlsWrapper key="11">
            {albumsWithPhoto && albumsWithPhoto.length ?
                <AlbumInfo>
                    <StyledH3>Remove from Albums:</StyledH3>
                    <StyledUL>
                        {albumsWithPhoto.map((item, index) => {
                                return (
                                    <StyledLI key={index}>
                                        {this.state.isLoading ? spinner
                                            :
                                            <DeleteIcon type="close"
                                                        onClick={this.deleteFromAlbum(item.value)}/>
                                        }
                                        <StyledAlbumTitles>{item.label}</StyledAlbumTitles>
                                    </StyledLI>
                                )
                            }
                        )
                        }
                    </StyledUL>
                </AlbumInfo> :
                <StyledH3>The photo is not in your albums yet</StyledH3>}

            {albumsWithoutPhoto && albumsWithoutPhoto.length ?
                <AlbumInfo>
                    <StyledH3>Add to Albums:</StyledH3>
                    <StyledUL>
                        {albumsWithoutPhoto.map((item, index) => {
                                return (
                                    <StyledLI key={index}>
                                        {this.state.isLoading ? spinner
                                            :
                                            <AddIcon type="plus"
                                                     onClick={this.addToAlbum(item.value)}/>
                                        }
                                        <StyledAlbumTitles>{item.label}</StyledAlbumTitles>
                                    </StyledLI>
                                )
                            }
                        )
                        }
                    </StyledUL>
                </AlbumInfo> :
                <StyledH3>No albums</StyledH3>}
        </ControlsWrapper>;
        const state = this.state.open ? 'open' : 'close';
        const items = [
            albumButtons
        ];
        const albumControls = <StyledAlbumControls key="56841">
            <IconContext.Provider value={{
                color: albumsWithPhoto && albumsWithPhoto.length ? "rgba(18, 175, 10, 1)" : "#1890ff",
                className: "album-icon"
            }}>
                <div>
                    <IoMdImages onClick={this.toggle}/>
                </div>
            </IconContext.Provider>
            <Sidebar native state={state}>
                {({x}) => (
                    <animated.div
                        className="album-controls"
                        style={{
                            transform: x.interpolate(x => `translate3d(0,${x}%,0)`),
                            width: this.state.sidebarWidth
                        }}>
                        <Content
                            native
                            items={items}
                            reverse={!this.state.open}
                            state={state}>
                            {(item, i) => ({x, ...props}) => (
                                <animated.div
                                    style={{
                                        transform: x.interpolate(x => `translate3d(0,${x}%,0)`),
                                        ...props,
                                    }}>
                                    {item}
                                </animated.div>
                            )}
                        </Content>
                    </animated.div>
                )}
            </Sidebar>
        </StyledAlbumControls>;

        return (
            <React.Fragment>
                <Gallery photos={this.props.photos} columns={this.props.columns}
                         onClick={this.openLightbox}/>

                <Lightbox images={this.props.data.photosToRender}
                          onClose={this.closeLightbox}
                          onClickPrev={this.gotoPrevious}
                          onClickNext={this.gotoNext}
                          currentImage={this.state.currentImage}
                          isOpen={this.props.view.lightboxIsOpen}
                          customControls={[albumControls]}
                          ref={this.lightboxRef}
                />
            </React.Fragment>
        )
    }
}

LightboxComponent.propTypes = {
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
})(LightboxComponent);