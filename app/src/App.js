import React from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SidebarComponent from "./components/SidebarComponent";
import DataFetchingComponent from "./components/DataFetchingComponent";
import NavbarComponent from "./components/Navbar/NavbarComponent";
import LoadingOverlay from 'react-loading-overlay';
import { DotLoader } from "react-spinners";
import {ConfigProvider} from 'antd';
import frFR from 'antd/lib/locale-provider/fr_FR';
import enGB from 'antd/lib/locale-provider/en_GB';

import {setAttendee, setAuthStatus, setEventCode, setLanguage} from "./actions/dataActions";
import intl from "react-intl-universal";

// CSS starts

const Wrapper = styled.div`
   margin-top: 0;
   display: flex;
   @media (max-width: 700px) {
   flex-wrap: wrap;
   }
`;
const RightPaneWrapper = styled.div`
   display: flex;
   flex-direction: column;
   width: 100%;
`;

// CSS ends
const locales = {
    "en": require('./locales/en-US.json'),
    "fr": require('./locales/fr-FR.json'),
};


class App extends React.Component {
    constructor() {
        super();

        this.state = {
            initDone: false
        };
    }

    loadLocales() {
        // init method will load CLDR locale data according to currentLocale
        // react-intl-universal is singleton, so you should init it only once in your app
        intl.init({
            currentLocale: this.props.data.language,
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
        await this.props.setLanguage('en');
        this.props.setEventCode(377867);
        this.props.setAttendee('fbracq@eventstory.live');
        this.props.setAuthStatus(false);
        await this.loadLocales();//do not remove locally
    }

    render() {
        const {authStatus, downloadingZip} = this.props.data;
        const {initDone} = this.state;
        const currentLocale = this.props.data.language;
        console.log(this.props.toggleGalleryLoading)
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
            initDone && !authStatus ?
                <ConfigProvider locale={AntdLocale}>
                    <LoadingOverlay
                        active={downloadingZip}
                        spinner={<DotLoader 
                            size={80} // or 150px
                            color={"#32C5D2"} />}
                    >
                        <Wrapper>
                            <SidebarComponent/>
                            <RightPaneWrapper>
                                <NavbarComponent/>
                                <DataFetchingComponent/>
                            </RightPaneWrapper>
                        </Wrapper>
                    </LoadingOverlay>
                </ConfigProvider>
                : null
        );
    }
}

App.propTypes = {
    eventAccessCode: PropTypes.string,
    attendee: PropTypes.string,
    language: PropTypes.string,
};

const mapStateToProps = state => ({
    data: state.data
});

export default connect(mapStateToProps, {
    setEventCode,
    setAttendee,
    setAuthStatus,
    setLanguage,
})(App);