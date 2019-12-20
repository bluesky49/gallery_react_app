import React, {Component} from 'react';
import styled from "styled-components";
import SpinnerComponent from "./SpinnerComponent";
import {Pagination} from "antd";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import axios from "axios";
import {fetchPassword, fetchUsername, prodURL} from "../keys";
import GalleryComponent from "./GalleryComponent";
import _ from 'lodash';
import {
    setAlbumInfo,
    setAlbumsList,
    setPuzzlesResponse,
    setXcsrfToken,
    setTotalResults,
    setAlbumOwnerID,
    toggleGalleryLoading,
    disableFetchRequest,
    setPhotosToRender,
    setPuzzles,
    setButtonType,
    setSelectedAlbumID
} from '../actions/dataActions';
import intl from "react-intl-universal";

// CSS starts
const StyledLoaderWrapper = styled.div`
    text-align: center;
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const StyledWrapper = styled.div`
    min-height: 100vh;
    width: 100%;
`;
const PaginationWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   margin: 20px;
`;
const StyledHeader = styled.div`
   text-transform: uppercase;
   padding: 10px 15px;
   font-family: "Roboto Condensed", sans-serif ;
   font-size: 17px;
   font-weight: 600;
   color: rgb(63, 68, 74);
   outline-color: rgb(63, 68, 74);
   text-align: center;
   margin-top: 40px;
`;

// CSS ends

class DataFetchingComponent extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            currentPage: 1
        };
    }

    fetchAlbumInfo() {
        const fetchURL = `${prodURL}/jsonapi/node/attendee/?filter[attendee-filter][condition][path]=title&filter[attendee-filter][condition][value]=${this.props.data.attendee}&filter[event-filter][condition][path]=field_event_reference.field_event_access_code&filter[event-filter][condition][value]=${this.props.data.eventAccessCode}&fields[node--attendee]=field_attendee_albums_puzzles`;

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
                const JSONfield = JSON.parse(response.data.data[0].attributes.field_attendee_albums_puzzles);
                this.props.setAlbumOwnerID(response.data.data[0].id);
                this.props.setAlbumInfo(JSONfield);

                const albumID = this.props.data.albumInfo[0].albumID;
                this.props.setSelectedAlbumID(albumID);

                if (JSONfield !== null && JSONfield.length) {
                    const result = JSONfield.map(item => {
                        return (
                            {
                                label: item.albumTitle,
                                value: item.albumID,
                                contentOutputURL: item.contentOutputURL
                            }
                        )
                    });
                    return result
                } else {
                    return (
                        [{
                            label: intl.get('NO_ALBUMS'),
                            value: 'na'
                        }]
                    )
                }
            })
            .then(response => {
                this.props.setAlbumsList(response);
                if (response[0].contentOutputURL !== null) {
                    this.props.setButtonType('Download PDF')
                }
            })
            .catch(error => console.log(error));
    }

    async setAlbumPuzzles(albumID) {
        const albums = this.props.data.albumInfo;
        if (albums && albums.length) {
            const currentAlbum = albums.find(album => album.albumID === albumID);
            const currentAlbumPuzzles = currentAlbum.puzzles;

            const filestackHandles = currentAlbumPuzzles.map(puzzle => puzzle.filestack_handle);
            const string = filestackHandles.join();
            this.props.setPuzzles(string);

            const chunkedResults = _.chunk(currentAlbumPuzzles, 100);

            this.props.setTotalResults(currentAlbum.puzzles.length);
            await this.props.setPuzzlesResponse(chunkedResults);

            if (this.props.data.puzzlesResponse.length) {
                this.props.setPhotosToRender(this.props.data.puzzlesResponse[0]);
            } else {
                this.props.setPhotosToRender(null)
            }
            this.setState({
                isLoading: false
            });
        }
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

    onChange = async (page, pageSize) => {
        await this.props.toggleGalleryLoading();
        const {puzzlesResponse} = this.props.data;
        this.props.setPhotosToRender(puzzlesResponse[page - 1]);
        this.setState({
            currentPage: page
        })
    };

    componentDidMount() {
        this.fetchAlbumInfo();
        this.getXcsrfToken();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.data.requestFetch !== prevProps.data.requestFetch
            && this.props.data.requestFetch === true) {
            this.fetchAlbumInfo();
            this.props.disableFetchRequest();
        }
        if (this.props.data.albumsList !== prevProps.data.albumsList && this.props.data.albumsList !== ['empty'] && this.props.data.albumsList.length) {
            this.setAlbumPuzzles(this.props.data.albumsList[0].value)
        } else if (this.props.data.selectedAlbumID !== prevProps.data.selectedAlbumID) {
            this.props.toggleGalleryLoading();
            this.setAlbumPuzzles(this.props.data.selectedAlbumID);
            this.setState({
                currentPage: 1
            });
        }
        if (this.props.data.albumsList !== prevProps.data.albumsList && this.props.data.albumsList[0].value === "na") {
            this.props.setPhotosToRender(null);
            this.setState({
                isLoading: false
            });
        }
    }

    render() {

        return (
            this.state.isLoading ?
                <StyledLoaderWrapper>
                    <SpinnerComponent/>
                </StyledLoaderWrapper>
                :
                this.props.data.albumInfo ?
                    this.props.data.photosToRender !== null || !this.props.data.albumInfo.length ?
                        this.props.data.albumInfo.length ?
                            <StyledWrapper>
                                <GalleryComponent/>

                                <PaginationWrapper>
                                    <Pagination onChange={this.onChange} defaultPageSize={100}
                                                total={this.props.data.totalResults}
                                                current={this.state.currentPage}/>
                                </PaginationWrapper>
                            </StyledWrapper>
                            : null
                        :
                        <StyledWrapper>
                            <StyledHeader>{intl.get('NO_PHOTOS_IN_THIS_ALBUM')}</StyledHeader>
                        </StyledWrapper>
                    : null

        )
            ;
    }
}

DataFetchingComponent.propTypes = {
    photosToRender: PropTypes.array,
    albumsList: PropTypes.array,
    albumInfo: PropTypes.array,
    attendee: PropTypes.string,
    eventAccessCode: PropTypes.string,
    selectedAlbumID: PropTypes.string,
    xcsrfToken: PropTypes.string,
    totalResults: PropTypes.number,
    albumOwnerID: PropTypes.string,
    requestFetch: PropTypes.bool,
    puzzlesResponse: PropTypes.array,
    puzzles: PropTypes.array,
};

const
    mapStateToProps = state => ({
        data: state.data
    });

export default connect(mapStateToProps, {
    setAlbumInfo,
    setAlbumsList,
    setPuzzlesResponse,
    setXcsrfToken,
    setTotalResults,
    setSelectedAlbumID,
    setAlbumOwnerID,
    toggleGalleryLoading,
    disableFetchRequest,
    setPhotosToRender,
    setPuzzles,
    setButtonType
})(DataFetchingComponent);