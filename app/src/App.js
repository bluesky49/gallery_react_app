import React from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SidebarComponent from "./components/SidebarComponent";
import TopBarComponent from "./components/TopBarComponent";
import FilestackComponent from "./components/FilestackComponent";
import HeaderComponent from "./components/layout/HeaderComponent";
import {Pagination} from "antd";
import Pusher from 'pusher-js';
import {Badge, Icon} from 'antd';
import intl from 'react-intl-universal';
import {LocaleProvider} from 'antd';
import frFR from 'antd/lib/locale-provider/fr_FR';
import enGB from 'antd/lib/locale-provider/en_GB';


import {
    setEventCode,
    setAttendee,
    setLanguage,
    toggleGalleryLoading,
    setFinalResponse,
    setAlbumResponse,
    setSearchResult
} from "./actions/dataActions"
import {
    toggleControls,
    closeSearchPanel
} from "./actions/viewActions";

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
   padding: 6px 15px;
   top: 15px;
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

const locales = {
    "en": require('./locales/en-US.json'),
    "fr": require('./locales/fr-FR.json'),
};

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            pusherUpdate: [],
            newPuzzles: 0,
            initDone: false
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

    loadLocales() {
        // init method will load CLDR locale data according to currentLocale
        // react-intl-universal is singleton, so you should init it only once in your app
        intl.init({
            currentLocale: this.props.data.language, // TODO: determine locale here
            locales,
        })
            .then(() => {
                // After loading CLDR locale data, start to render
                this.setState({initDone: true});
            });
    }

    async componentDidMount() {
        /*global drupalSettings:true*/
        /*eslint no-undef: "error"*/
        this.props.setEventCode(drupalSettings.eventAccessCode);
        this.props.setAttendee(drupalSettings.attendee);
        await this.props.setLanguage(drupalSettings.language);
        const pusherKey = drupalSettings.pusherKey;
        const pusherCluster = drupalSettings.pusherCluster;
        /*const pusherKey = 'cca8fcdd475e44334b1c';
        const pusherCluster = 'eu';*/

        const pusher = new Pusher(pusherKey, {
            cluster: pusherCluster,
            encrypted: true,
        });

        const channel = pusher.subscribe(
            drupalSettings.eventAccessCode
            //this.props.data.eventAccessCode
        );
        channel.bind('upload', data => {

            this.setState({
                pusherUpdate: [...this.state.pusherUpdate, data],
                newPuzzles: this.state.newPuzzles + 1
            });
        });
        await this.loadLocales();
    }

    handleRefreshClick = async e => {
        e.preventDefault();
        await this.props.toggleGalleryLoading();
        await this.props.closeSearchPanel();

        const updatedData = [...this.state.pusherUpdate, ...this.props.data.finalResponse];

        const SearchResult = this.props.data.searchResult;
        SearchResult[0] = updatedData;

        this.props.setSearchResult(SearchResult);

        await setTimeout(() => {
                this.props.setFinalResponse(updatedData);
            },
            50);

        this.setState({
            pusherUpdate: [],
            newPuzzles: 0
        });

    };

    render() {
        const {attendee} = this.props.data;
        let securityCheck = false;
        if (attendee && attendee !== "Anonymous" && attendee !== "Anonyme") {
            securityCheck = true;
        }
        const {newPuzzles, initDone} = this.state;
        const currentLocale = this.props.data.language;
        let AntdLocale;
        switch (currentLocale) {
            case 'en': {
                AntdLocale = enGB;
                break;
            }
            case 'fr': {
                AntdLocale = frFR;
                break;
            }
            default: {
                AntdLocale = enGB;
                break;
            }
        }

        return (
            initDone && securityCheck ?
                <LocaleProvider locale={AntdLocale}>
                    <StyledWrapper>
                        <HeaderComponent/>
                        {newPuzzles > 0 ?
                            <StyledBadge count={newPuzzles} onClick={this.handleRefreshClick}>
                                <Icon type="sync" theme="outlined" style={{fontSize: 20}}/>
                            </StyledBadge> : null}

                        <SidebarComponent/>
                        {this.props.data.searchResultIsShown && this.props.view.showControls ?
                            <TopBarComponent/> : null}

                        <StyledGallery>
                            <FilestackComponent/>
                            {!this.props.view.faceTaggingIsOpen ?
                                <PaginationWrapper>
                                    <Pagination onChange={this.onChange} defaultPageSize={50}
                                                total={this.props.data.totalResults}/>
                                </PaginationWrapper> : null}
                        </StyledGallery>
                    </StyledWrapper>
                </LocaleProvider>
                : null
        );
    }
}

App.propTypes = {
    finalResponse: PropTypes.array,
    totalResults: PropTypes.number,
    eventAccessCode: PropTypes.string,
    searchResult: PropTypes.array,
    attendee: PropTypes.string,
    language: PropTypes.string,
    searchResultIsShown: PropTypes.bool,
    faceTaggingIsOpen: PropTypes.bool,
    showControls: PropTypes.bool
};

const mapStateToProps = state => ({
    data: state.data,
    view: state.view
});

export default connect(mapStateToProps, {
    setEventCode,
    setLanguage,
    setAttendee,
    toggleGalleryLoading,
    setFinalResponse,
    setAlbumResponse,
    closeSearchPanel,
    setSearchResult,
    toggleControls
})(App);