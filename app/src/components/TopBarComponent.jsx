import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Icon} from "antd";
import {IconContext} from "react-icons";
import {IoMdImages} from 'react-icons/io';
import {Keyframes, animated} from 'react-spring/renderprops';
import delay from 'delay';
import styled from "styled-components";
import axios from "axios";
import _ from 'lodash';
import {fetchPassword, fetchUsername, prodURL} from "../keys";
import intl from "react-intl-universal";


//CSS starts
const StyledAlbumControls = styled.div`
   position: absolute;
   top: 54px;
   left: 95px;
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
    <img
        src="https://eventstory.live/sites/default/files/loader.gif"
        alt="Loading..."
        height="20px"
        width="20px"
    />
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

class TopBarComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            albums: [],
            open: false,
            sidebarWidth: 0
        };
    }

    toggle = () => this.setState(state => ({open: !state.open}));

    setAlbumsList = () => {
        const JSONfield = JSON.parse(this.props.data.albumResponse[0].attributes.field_attendee_albums_puzzles);

        if (JSONfield !== null && JSONfield.length) {
            var allAlbums = JSONfield.map(item => {
                return (
                    {
                        label: item.albumTitle,
                        value: item.albumID
                    })
            });
        } else {
            return (
                [{
                    label: 'No albums created',
                    value: 'na'
                }]
            )
        }
        this.setState({
            albums: allAlbums
        });
    };

    addToAlbum = albumID => e => {
        e.preventDefault();
        this.setState({isLoading: true});

        const puzzleHandle = this.props.data.finalResponse.map(puzzle => puzzle.filestack_handle[0]);

        const newPuzzles = this.props.data.photosToRender.map((puzzle, index) => {
            return (
                {
                    id: puzzle.uuid,
                    src: puzzle.src,
                    width: puzzle.width,
                    height: puzzle.height,
                    name: puzzle.alt,
                    filestack_handle: puzzleHandle[index],
                    utcCreated: puzzle.utcCreated,
                    type: puzzle.type
                }
            )
        });

        const albumOwnerId = this.props.data.albumOwnerID;
        const JSONfield = JSON.parse(this.props.data.albumResponse[0].attributes.field_attendee_albums_puzzles);

        const newJSONfield = JSONfield.map(item => {
            if (item.albumID === albumID) {

                const puzzlesArray = item.puzzles;
                const newPuzzlesArrayWithPossibleDuplicates = [...puzzlesArray, ...newPuzzles];
                const newPuzzlesArray = _.uniqBy(newPuzzlesArrayWithPossibleDuplicates, 'id');

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
        })
    )
    .
        then((res) => {
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
                }
            );
    };

    componentDidMount() {
        this.setAlbumsList()
    }

    componentDidUpdate(prevProps, prevState) {

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

        const {albums} = this.state;

        const albumButtons = <ControlsWrapper key="11314">
            {albums && albums.length ?
                <AlbumInfo>
                    <StyledH3>{intl.get('ADD_ALL_PHOTOS')}:</StyledH3>
                    <StyledUL>
                        {albums.map((item, index) => {
                                return (
                                    <StyledLI key={index + 10}>
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
                <StyledH3>{intl.get('NO_ALBUMS')}</StyledH3>}
        </ControlsWrapper>;
        const state = this.state.open ? 'open' : 'close';
        const items = [
            albumButtons
        ];

        return (
            <StyledAlbumControls key="56840547">
                <IconContext.Provider value={{
                    color: albums && albums.length ? "rgba(18, 175, 10, 1)" : "#1890ff",
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
            </StyledAlbumControls>
        )
    }
}

TopBarComponent.propTypes = {
    albumResponse: PropTypes.array,
    photosToRender: PropTypes.array,
    albumOwnerID: PropTypes.string,
    finalResponse: PropTypes.array
};

const
    mapStateToProps = state => ({
        data: state.data
    });

export default connect(mapStateToProps, {})(TopBarComponent);