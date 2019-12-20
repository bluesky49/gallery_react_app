import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button, Form, Input} from "antd";
import axios from "axios";
import intl from "react-intl-universal";
import styled from "styled-components";

import {fetchPassword, fetchUsername, prodURL} from "../keys";
import {enableFetchRequest} from "../actions/dataActions";

const StyledButton = styled(Button)`
 background-color: ${props => props.theme.colorPrimary} !important;
 border-style: none !important;
 box-shadow: ${props => props.theme.boxShadow} !important;
  &:hover {
    box-shadow: ${props => props.theme.boxShadowHover} !important;
          }
`;

class AlbumControlsComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({loading: true});
                const albumOwnerId = this.props.data.albumOwnerID;
                const albumTitle = values.albumName;

                const uuidv1 = require('uuid/v1');
                const albumID = uuidv1();

                const JSONfield = this.props.data.albumInfo;
                const newAlbum = {
                    "albumID": albumID,
                    "albumTitle": albumTitle,
                    "albumOwnerID": albumOwnerId,
                    "contentOutputURL": null,
                    "coverOutputURL": null,
                    "puzzles": []
                };

                if (JSONfield === null) {
                    var newJSONfield = [newAlbum]
                } else {
                    var newJSONfield = [...JSONfield, newAlbum]
                }

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
                    .then(response => {
                            return (
                                this.props.enableFetchRequest()
                            )
                        }
                    )
                    .then(response => {
                        this.setState({loading: false})
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
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item>
                    {getFieldDecorator('albumName', {
                        rules: [{required: true, message: intl.get('ENTER_ALBUM’S_NAME')}],
                    })(
                        <Input size="small" key="3" placeholder={intl.get('ENTER_ALBUM’S_NAME')}/>
                    )}
                </Form.Item>
                <Form.Item>
                    <StyledButton size="small" htmlType="submit" type="primary" loading={this.state.loading}
                    >{intl.get('CREATE_ALBUM')}</StyledButton>
                </Form.Item>
            </Form>
        );
    }
}

AlbumControlsComponent.propTypes = {
    albumOwnerID: PropTypes.string,
    xcsrfToken: PropTypes.string,
    attendee: PropTypes.string,
    eventAccessCode: PropTypes.string,
    albumInfo: PropTypes.object,
    requestFetch: PropTypes.bool
};

const mapStateToProps = state => ({
    data: state.data
});

const WrappedAlbumControlsComponent = Form.create({name: 'register'})(AlbumControlsComponent);

export default connect(mapStateToProps, {
    enableFetchRequest
})(WrappedAlbumControlsComponent);