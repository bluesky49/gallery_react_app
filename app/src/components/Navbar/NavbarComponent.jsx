import React from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button} from 'antd/lib/index';
import PhotoBookComponent from "./PhotoBookComponent";
import HeaderComponent from "./HeaderComponent";
import {exifURL} from "../../keys";
import {
    downloadZIP,
    setSelectedAlbumID,
    toggleGalleryLoading
} from "../../actions/dataActions";
import intl from "react-intl-universal";

const axios = require('axios');

//CSS starts
const NavbarWrapper = styled.div`
 display: flex;
 justify-content: space-between;
 flex-wrap: wrap;
 @media (max-width: 800px) {
 padding: 0 10px;
 }
`;
const ButtonsWrapper = styled.div`
 display: flex;
 flex-wrap: nowrap;
 padding: 20px 89px 10px 0;
`;
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
    box-shadow: ${props => props.theme.boxShadowHover} !important;;
          } 
`;

//CSS Ends

class NavbarComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick = (e, data) => {
        e.preventDefault();
        const {downloadZIP} = this.props;
        downloadZIP(true);
        const {photosToRender, eventAccessCode, albumsList, selectedAlbumID} = data;
        const albumTitle = albumsList.find(el=>el.value === selectedAlbumID).label;
        axios.post(exifURL + "metadata", {photosToRender, eventAccessCode, albumTitle},{
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            console.log(response)
            const {filename} = response.data;
            let a = document.createElement('a');
            a.href = exifURL + 'download?filename=' + filename;
            a.download = filename;
            a.click();
            downloadZIP(false);
        })
        .catch(function (error) {
            console.log(error);
            downloadZIP(false);
        });
    };

    render() {
        const puzzles = this.props.data.puzzles;
        console.log(this.props.data.albumInfo)
        return (
            <NavbarWrapper>
                <HeaderComponent/>
                <ButtonsWrapper>
                    {this.props.data.albumInfo ?
                        puzzles !== "" && this.props.data.albumInfo.length ?
                            <React.Fragment>
                                <StyledButton size="small" type="primary" onClick={(e) => this.handleClick(e, this.props.data)}>
                                    {/* <a href={`https://process.filestackapi.com/security=policy:${filestackPolicy},signature:${filestackSignature}/zip/[${puzzles}]`}>
                                        {intl.get('DOWNLOAD_ZIP')}</a> */}
                                    {intl.get('DOWNLOAD_ZIP')}
                                </StyledButton>

                                <PhotoBookComponent/>
                            </React.Fragment>
                            : null
                        : null
                    }
                    {/*<StyledButton size="small" type="primary" onClick={this.handleClick}>
                    {intl.get('UPLOAD_GOOGLE_PHOTO')}
                </StyledButton>*/}
                </ButtonsWrapper>
            </NavbarWrapper>
        )
    }
}

NavbarComponent.propTypes = {
    albumResponse: PropTypes.array,
    selectedAlbumID: PropTypes.string,
    galleryIsLoading: PropTypes.bool,
    puzzlesResponse: PropTypes.array,
    puzzles: PropTypes.array,
    triggerDownloadZIP: PropTypes.bool,
    albumInfo: PropTypes.array,
};

const mapStateToProps = state => ({
    data: state.data
});

export default connect(mapStateToProps, {
    setSelectedAlbumID,
    toggleGalleryLoading,
    downloadZIP
})(NavbarComponent);