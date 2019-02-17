import React from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SidebarComponent from "./components/SidebarComponent";
import FilestackComponent from "./components/FilestackComponent";
import {Pagination} from "antd";
import {
    setEventCode,
    setAttendee,
    toggleGalleryLoading,
    setFinalResponse,
    setAlbumResponse
} from "./actions/dataActions";

// CSS starts

const StyledWrapper = styled.div`
   margin-top: 0;
`;
const StyledGallery = styled.div`
   width:100%;
   height: auto;
`;

const PaginationWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   margin: 20px;
`;

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    onChange = (page, pageSize) => {
        this.props.toggleGalleryLoading();
        const {searchResult} = this.props.data;
        this.props.setFinalResponse(searchResult[page - 1]);
    };

    componentDidMount() {
        /*global drupalSettings:true*/
        /*eslint no-undef: "error"*/
        this.props.setEventCode(drupalSettings.eventAccessCode);
        this.props.setAttendee(drupalSettings.attendee);
    }

    render() {

        return (
            <StyledWrapper>

                <SidebarComponent/>

                <StyledGallery>
                    <FilestackComponent/>
                    <PaginationWrapper>
                        <Pagination onChange={this.onChange} defaultPageSize={50} total={this.props.data.totalResults}/>
                    </PaginationWrapper>
                </StyledGallery>

            </StyledWrapper>
        );
    }
}

App.propTypes = {
    initialResponse: PropTypes.array,
    finalResponse: PropTypes.array,
    totalResults: PropTypes.number,
    eventAccessCode: PropTypes.string,
    searchResult: PropTypes.array,
    attendee: PropTypes.string
};

const mapStateToProps = state => ({
    data: state.data
});

export default connect(mapStateToProps, {
    setEventCode,
    setAttendee,
    toggleGalleryLoading,
    setFinalResponse,
    setAlbumResponse
})(App);