import React from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button, Popconfirm} from 'antd';
import {fetchPassword, fetchUsername, prodURL} from "../keys";
import {enableFetchRequest, setSelectedAlbumID, setButtonType} from "../actions/dataActions";
import AlbumControlsComponent from './AlbumControlsComponent';
import axios from "axios";
import intl from "react-intl-universal";

//CSS starts
const AlbumInfo = styled.div`
  min-width: 350px;
  margin-top: 60px;
  @media (max-width: 700px) {
  margin-top: 40px;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Wrapper = styled.div`
  margin: 5px;
`;

const StyledUL = styled.ul`
   list-style-type: none !important;
   padding-left: 0 !important;
   width: 100% !important;
`;
const StyledLI = styled.li`
   display: flex;
   justify-content: space-between !important;
   align-items: center;
   cursor: pointer !important;
   &:hover {
   background-color: rgba(247, 247, 247, 1);
   }
   background-color: ${
    props => props.isActive ?
            `rgba(247, 247, 247, 1)` :
        `white`
};
   border-right: ${
    props => props.isActive ?
        `3px solid rgba(50, 197, 210, 1)` :
        `3px solid white`
};
`;
const StyledAlbumTitles = styled.div`
    width: 100% !important; 
   text-transform: uppercase !important;
   padding: 10px 15px !important;
   font-family: "Roboto Condensed", sans-serif !important;
   font-size: 17px !important;
   font-weight: 600 !important;
   color: rgb(63, 68, 74) !important;
   outline-color: rgb(63, 68, 74) !important;
`;
const StyledButton = styled(Button)`
   min-width: 24px;
   border-style: none !important;
   color: rgba(245, 34, 45, 1) !important;
   background-color: transparent !important;
   margin: 5px;
   &:hover {
   background-color: rgba(245, 34, 45, 1) !important;
   color: white !important;
   }
`;

//CSS Ends

class SidebarComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
            loading: false
        };
    }

    handleAlbumClick = (albumID, contentOutputURL, index) => e => {
        e.preventDefault();

        this.props.setSelectedAlbumID(albumID);
        this.setState({
            activeIndex: index
        });
        if (contentOutputURL === null) {
            this.props.setButtonType('Create photo book')
        } else {
            this.props.setButtonType('Download PDF')
        }
    };

    deleteAlbum(albumID) {

        const albumOwnerId = this.props.data.albumOwnerID;
        const JSONfield = this.props.data.albumInfo;

        const newJSONfield = JSONfield.filter(item => item.albumID !== albumID);

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
                }
            )
        )
            .then(res => {
                return (
                    this.props.enableFetchRequest()
                )
            })
            .then(res => {
                return (
                    this.setState({
                        loading: false
                    })
                )
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

    }

    confirm = (albumID) => e => {
        this.setState({
            loading: true
        });
        this.deleteAlbum(albumID);
    };
    
    render() {
        const albums = this.props.data.albumsList;
        const text = intl.get('DELETE_ALBUM') + '?';

        return (
            <AlbumInfo>
                <Wrapper>
                    <AlbumControlsComponent/>
                </Wrapper>

                <StyledUL>
                    {albums.map((item, index) => {
                            return (
                                <StyledLI className={`albums-list-${index}`} isActive={this.state.activeIndex === index}
                                          key={index}>
                                    <StyledAlbumTitles
                                        onClick={this.handleAlbumClick(item.value, item.contentOutputURL, index)}>{item.label}</StyledAlbumTitles>

                                    {albums[0].value !== "na" ?
                                        <Popconfirm placement="top" title={text} onConfirm={this.confirm(item.value)}
                                                    okText={intl.get('YES')}
                                                    cancelText={intl.get('NO')}>

                                            <StyledButton loading={this.state.loading} type="danger" shape="circle"
                                                          icon="close-circle" size="small"/>

                                        </Popconfirm> : null}
                                </StyledLI>
                            )
                        }
                    )}
                </StyledUL>
            </AlbumInfo>
        )
    }
}

SidebarComponent.propTypes = {
    albumOwnerID: PropTypes.string,
    albumsList: PropTypes.array,
    selectedAlbumID: PropTypes.string,
    galleryIsLoading: PropTypes.bool,
    albumInfo: PropTypes.object,
};

const
    mapStateToProps = state => ({
        data: state.data
    });

export default connect(mapStateToProps, {
    setSelectedAlbumID,
    enableFetchRequest,
    setButtonType
})(SidebarComponent);