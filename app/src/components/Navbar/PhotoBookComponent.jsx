import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {picture} from 'filestack-adaptive';
import {filestackPolicy, filestackSignature} from "../../keys";
import {Button} from "antd";
import axios from "axios";
import styled from "styled-components";

import {prodURL} from "../../keys";
import {
    enableFetchRequest
} from "../../actions/dataActions";
import intl from "react-intl-universal";

const StyledButton = styled(Button)`
 display: flex;
 flex-wrap: wrap;
 justify-content: flex-end;
 margin-right: 15px;
 padding-top: 2px !important;
 background-color: ${props => props.theme.colorPrimary} !important;
 border-style: none !important;
 box-shadow: ${props => props.theme.boxShadow} !important;
  &:hover {
    box-shadow: ${props => props.theme.boxShadowHover} !important;
          } 
`;

const transformOptions = {
    security: {
        policy: filestackPolicy,
        signature: filestackSignature
    },
    keys: true,
    useValidator: false,
    cache: {
        expiry: 31536000
    }
};

class PhotoBookComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            PDFURL: '',
            isLoading: true,
            firstLoad: true
        };
    }

    handlePhotoBook = () => {
        let albumID;
        if (this.props.data.selectedAlbumID !== "empty") {
            albumID = this.props.data.selectedAlbumID
        } else {
            albumID = this.props.data.albumsList[0].value
        }
        axios({
            method: 'post',
            url: `${prodURL}/editor/webhook/redirect`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: {
                "AlbumID": albumID,
                "EventAccessCode": this.props.data.eventAccessCode,
                "Attendee": this.props.data.attendee,
            }
        })
            .then(response => {
                    window.location.assign(response.data.url);
                }
            )
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

    getPDF = () => {
        const {selectedAlbumID, albumInfo} = this.props.data;
        const currentAlbum = albumInfo.filter(album => album.albumID === selectedAlbumID);
        const contentOutputURL = currentAlbum[0].contentOutputURL;
        const PDFURL = picture(contentOutputURL, transformOptions).lastChild.src;
        this.setState({
            PDFURL: PDFURL,
            isLoading: false
        })
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.data.selectedAlbumID !== prevProps.data.selectedAlbumID && this.props.data.buttonType === 'Download PDF') {
            this.getPDF();
        }
        if (this.props.data.selectedAlbumID !== 'empty' && this.state.firstLoad && this.props.data.buttonType === 'Download PDF') {
            this.getPDF();
            this.setState({
                firstLoad: false
            })
        }
    }

    render() {
        const buttonType = this.props.data.buttonType;
        if (buttonType === 'Create photo book') {
            return (
                <React.Fragment>
                    <StyledButton size="small" type="primary" onClick={this.handlePhotoBook}>
                        {intl.get('CREATE_PHOTO_BOOK')}
                    </StyledButton>
                </React.Fragment>
            )
        } else if (buttonType === 'Download PDF' && !this.state.isLoading) {
            return (
                <React.Fragment>
                    <StyledButton size="small" type="primary" href={this.state.PDFURL} target="_blank">
                        {intl.get('DOWNLOAD_PDF')}
                    </StyledButton>
                </React.Fragment>
            )
        } else if (this.state.isLoading) {
            return (
                <React.Fragment>
                    <StyledButton size="small" type="primary">
                        ...
                    </StyledButton>
                </React.Fragment>
            )
        }
    }
}

PhotoBookComponent.propTypes = {
    selectedAlbumID: PropTypes.string,
    buttonType: PropTypes.string,
    albumsList: PropTypes.array,
    albumsInfo: PropTypes.array,
    eventAccessCode: PropTypes.string,
    attendee: PropTypes.string,
};

const mapStateToProps = state => ({
    data: state.data
});

export default connect(mapStateToProps, {
    enableFetchRequest,
})(PhotoBookComponent);