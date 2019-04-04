import React from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SidebarComponent from "./components/SidebarComponent";
import TopBarComponent from "./components/TopBarComponent";
import FilestackComponent from "./components/FilestackComponent";
import {Pagination} from "antd";
import Pusher from 'pusher-js';
import {Badge, Icon} from 'antd';

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
const StyledBadge = styled(Badge)`
   position: absolute;
   padding: 7px 15px;
   top: 23px;
   right: 120px;
   cursor: pointer;
   z-index: 9999;
   color: #1890ff;
   background-color: rgba(30, 30, 30, 0.8) !important;
   border-radius: 4px;
   box-shadow: 2px 2px 4px rgba(24, 144, 255, 0.4) !important;
     &:hover {
              box-shadow: 2px 2px 10px rgba(24, 144, 255, 0.9) !important;
              }
`;

//const pusherKey = drupalSettings.pusherKey;
//const pusherCluster = drupalSettings.pusherCluster;

const pusherKey = 'cca8fcdd475e44334b1c';
const pusherCluster = 'eu';

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            pusherUpdate: [],
            newPuzzles: 0,
            pusherData: []
        };
    }

    onChange = async (page, pageSize) => {
        await this.props.toggleGalleryLoading();
        const {searchResult} = this.props.data;

        setTimeout(() => {
                this.props.setFinalResponse(searchResult[page - 1]);
            },
            10);
    };

    componentDidMount() {
        /*global drupalSettings:true*/
        /*eslint no-undef: "error"*/
        //this.props.setEventCode(drupalSettings.eventAccessCode);
        //this.props.setAttendee(drupalSettings.attendee);

        const pusher = new Pusher(pusherKey, {
            cluster: pusherCluster,
            encrypted: true,
        });

        const channel = pusher.subscribe(this.props.data.eventAccessCode);
        channel.bind('upload', data => {

            this.setState({
                pusherUpdate: [...this.state.pusherUpdate, data],
                newPuzzles: this.state.newPuzzles + 1
            });
        });
    }

    /*componentDidUpdate(prevProps, prevState) {

        if (this.state.pusherUpdate !== prevState.pusherUpdate) {
            let {dataFinal} = this.state;
            let dataSliced = dataFinal.pop();
            dataFinal.unshift({attributes: this.state.pusherUpdate});
            this.setState({
                dataFinal: dataFinal
            });
        }
    }*/

    handleRefreshClick = e => {
        e.preventDefault();
        console.log("click");
    }

    render() {
        const {newPuzzles} = this.state;

        return (
            <StyledWrapper>
                <StyledBadge count={newPuzzles} onClick={this.handleRefreshClick}>
                    <Icon type="sync" theme="outlined" style={{fontSize: 20}}/>
                </StyledBadge>

                <SidebarComponent/>
                {this.props.data.searchResultIsShown ?
                    <TopBarComponent/> : null}

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
    finalResponse: PropTypes.array,
    totalResults: PropTypes.number,
    eventAccessCode: PropTypes.string,
    searchResult: PropTypes.array,
    attendee: PropTypes.string,
    searchResultIsShown: PropTypes.bool
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