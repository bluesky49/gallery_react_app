import React, {Component} from 'react';
import Gallery from "react-photo-gallery";
import Lightbox from 'react-images';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Icon} from "antd";
import axios from "axios";
import {IconContext} from "react-icons";
import {IoMdImages} from 'react-icons/io';
import {Keyframes, animated} from 'react-spring/renderprops';
import delay from 'delay';
import styled from "styled-components";
import SpinnerComponent from "../SpinnerComponent";

import {toggleLightbox, disableLightbox} from '../../actions/viewActions';
import {setAlbumResponse, setXcsrfToken, setAlbumOwnerID} from '../../actions/dataActions';
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
`;
const StyledSpinner = styled.div`
   display: flex;
   padding-right: 5px;
   margin-bottom: -3px;
`;
//CSS Ends

const spinner = <StyledSpinner>
                    <SpinnerComponent/>
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
            albumsWithPhoto: [],
            albumsWithoutPhoto: [],
            open: false,
            sidebarWidth: 0
        };
        this.lightboxRef = React.createRef();
    }

    toggle = () => this.setState(state => ({open: !state.open}));

    openLightbox2 = async () => {
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
    gotoPrevious = async () => {
        await this.setState({
            currentImage: this.state.currentImage - 1,

        });
        this.setAlbumsLists();
    };
    gotoNext = async () => {
        await this.setState({
            currentImage: this.state.currentImage + 1,

        });
        this.setAlbumsLists();
    };
    closeLightbox = () => {
        this.setState({
            currentImage: 0,
            selectedOption: null
        });
        this.props.disableLightbox();
    };

    fetchAlbumInfo() {
        const fetchURL = `${prodURL}/jsonapi/node/attendee/?filter[attendee-filter][condition][path]=field_email&filter[attendee-filter][condition][value]=${this.props.data.attendee}&filter[event-filter][condition][path]=field_event_reference.field_event_access_code&filter[event-filter][condition][value]=${this.props.data.eventAccessCode}&fields[node--attendee]=field_attendee_albums_puzzles`;

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
                this.props.setAlbumResponse(response.data.data);
                this.props.setAlbumOwnerID(response.data.data[0].id);
            })
            .catch(error => console.log(error));
    }

    setAlbumsLists = () => {

        const JSONfield = JSON.parse(this.props.data.albumResponse[0].attributes.field_attendee_albums_puzzles);

        if (JSONfield !== null && JSONfield.length) {
            var allAlbums = JSONfield.map(item => {
                return (
                    {
                        label: item.albumTitle,
                        value: item.albumID
                    }
                )
            });
        } else {
            return (
                [{
                    label: 'No albums created',
                    value: 'na'
                }]
            )
        }
        const currentLightboxImage = this.lightboxRef.current.props.currentImage;
        const puzzleID = this.props.data.photosToRender[currentLightboxImage].uuid;

        const albumsWithPhoto = JSONfield.reduce((total, item, index) => {

            const puzzlesArray = item.puzzles;
            puzzlesArray.map(i => {
                if (i.id === puzzleID) {
                    return (
                        total.push({
                            label: item.albumTitle,
                            value: item.albumID
                        })
                    )
                }
            });
            return total;
        }, []);

        const albumsWithoutPhoto = (allAlbums, albumsWithPhoto) => allAlbums.filter(o1 => albumsWithPhoto.map(o2 => o2.value).indexOf(o1.value) === -1);

        this.setState({
            albumsWithPhoto: albumsWithPhoto,
            albumsWithoutPhoto: albumsWithoutPhoto(allAlbums, albumsWithPhoto)
        });
    };
    addToAlbum = albumID => e => {
        e.preventDefault();
        this.setState({isLoading: true});

        const currentLightboxImage = this.lightboxRef.current.props.currentImage;
        const albumOwnerId = this.props.data.albumOwnerID;
        const puzzle = this.props.data.photosToRender[currentLightboxImage];
        const puzzleHandle = this.props.data.finalResponse[currentLightboxImage].filestack_handle[0];

        const JSONfield = JSON.parse(this.props.data.albumResponse[0].attributes.field_attendee_albums_puzzles);

        const newJSONfield = JSONfield.map(item => {
            if (item.albumID === albumID) {

                const newPuzzle = {
                    id: puzzle.uuid,
                    src: puzzle.src,
                    width: puzzle.width,
                    height: puzzle.height,
                    alt: puzzle.alt,
                    filestack_handle: puzzleHandle
                };
                const puzzlesArray = item.puzzles;
                const newPuzzlesArray = [...puzzlesArray, newPuzzle];

                item = {...item, puzzles: newPuzzlesArray};
            }
            return item;
        });

        return (
            axios({
                method: 'patch',
                url: `${prodURL}/jsonapi/node/attendee/${albumOwnerId}`,
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
                    "data": {
                        "type": "node--attendee",
                        "id": albumOwnerId,
                        "attributes": {
                            "field_attendee_albums_puzzles": JSON.stringify(newJSONfield)
                        }
                    }
                }
            }))
            .then((res) => {
                this.fetchAlbumInfo()
            })
            .then((res) => {
                this.setState({
                    isLoading: false
                });
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

    deleteFromAlbum = albumID => e => {
        e.preventDefault();
        this.setState({isLoading: true});

        const currentLightboxImage = this.lightboxRef.current.props.currentImage;
        const puzzleID = this.props.data.photosToRender[currentLightboxImage].uuid;
        const albumOwnerId = this.props.data.albumOwnerID;

        const JSONfield = JSON.parse(this.props.data.albumResponse[0].attributes.field_attendee_albums_puzzles);

        const newJSONfield = JSONfield.map(item => {
            if (item.albumID === albumID) {

                const puzzlesArray = item.puzzles;
                const newPuzzlesArray = puzzlesArray.filter(item => item.id !== puzzleID);

                item = {...item, puzzles: newPuzzlesArray};
            }
            return item;
        });

        return (
            axios({
                method: 'patch',
                url: `${prodURL}/jsonapi/node/attendee/${albumOwnerId}`,
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
                    "data": {
                        "type": "node--attendee",
                        "id": albumOwnerId,
                        "attributes": {
                            "field_attendee_albums_puzzles": JSON.stringify(newJSONfield)
                        }
                    }
                }
            }))
            .then((res) => {
                this.fetchAlbumInfo()
            })
            .then((res) => {
                this.setState({
                    isLoading: false
                });
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
        this.fetchAlbumInfo();
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.view.lightboxIsOpen !== prevProps.view.lightboxIsOpen &&
            this.props.view.lightboxIsOpen === true
            ||
            this.props.data.albumResponse !== prevProps.data.albumResponse
        ) {
            this.setAlbumsLists();
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

        const {albumsWithPhoto, albumsWithoutPhoto} = this.state;

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
                         onClick={this.openLightbox}
                         direction={"column"}
                />

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
    xcsrfToken: PropTypes.string,
    attendee: PropTypes.string,
    albumOwnerID: PropTypes.string,
    finalResponse: PropTypes.array
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
    setXcsrfToken,
    setAlbumOwnerID
})(LightboxComponent);