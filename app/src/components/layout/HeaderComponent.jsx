import React, {Component} from 'react';
import styled from "styled-components";
import {fetchPassword, fetchUsername, prodURL} from "../../keys";
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Moment from 'react-moment';

//CSS starts
const StyledHeader = styled.div`
   width: 100%;
   min-height: 60px;
   padding: 10px 15px 15px 265px;
   font-size: 26px;
   font-weight: bold;
   @media (max-width: 1000px) {
    padding: 60px 15px 15px 25px;
  }
`;

//CSS ends

class HeaderComponent extends Component {

    constructor() {
        super();

        this.state = {
            eventName: null,
            eventDate: null,
            eventLocation: null
        };
    }

    fetchEventInfo() {
        const fetchURL = `${prodURL}/jsonapi/node/event/?filter[field_event_access_code][value]=${this.props.data.eventAccessCode}`;

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
                const attributes = response.data.data[0].attributes;

                this.setState({
                    eventName: attributes.title,
                    eventDate: attributes.field_event_date,
                    eventLocation: attributes.field_event_address ? attributes.field_event_address.locality : null
                })
            })
            .catch(error => console.log(error));
    }

    componentDidMount() {
        this.fetchEventInfo();
    }

    render() {
        const {eventName, eventDate, eventLocation} = this.state;
        const {language} = this.props.data;
        let dateFormat;
        switch (language) {
            case "fr":
                dateFormat = "DD-MM-YYYY";
                break;
            case "en":
                dateFormat = "MM-DD-YYYY";
                break;
            default:
                dateFormat = "MM-DD-YYYY";
        }

        return (
            <StyledHeader><i>
                {eventName ? `${eventName}, ` : null}

                {eventDate ?
                    <Moment format={dateFormat}>
                        {eventDate}
                    </Moment> : null}

                {eventLocation ?
                    `, ${eventLocation}` : null
                }</i>
            </StyledHeader>
        );
    }
}

HeaderComponent.propTypes = {
    eventAccessCode: PropTypes.string,
    language: PropTypes.string
};

const mapStateToProps = state => ({
    data: state.data
});

export default connect(mapStateToProps, {})(HeaderComponent);
