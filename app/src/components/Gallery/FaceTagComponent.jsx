import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from "styled-components";
import ImageMapper from 'react-image-mapper';
import Measure from 'react-measure';
import _ from 'lodash';
import SpinnerComponent from "../SpinnerComponent";

import {toggleFaceTagging} from '../../actions/viewActions';
import {Button, Icon, Tooltip, Modal, Form, AutoComplete} from "antd";
import axios from "axios";
import {fetchPassword, fetchUsername, prodURL} from "../../keys";
import intl from "react-intl-universal";

//CSS starts
const FaceTaggingWrapper = styled.div`
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          @media (min-width: 800px) {
          width: 80%;
          }
          @media (min-width: 1000px) {
          width: 70%;
          }
          @media (min-width: 1200px) {
          width: 60%;
          }
          margin: auto;
          height: auto;
          padding-bottom: 65px;
         `;
const FaceTaggingInner = styled.div`
          position: relative;
          width: 100%;
         `;
const ButtonWrapper = styled.div`
          margin: 24px 0 10px 0;
          text-align: center;
`;
const StyledButton = styled(Button)`
    border-style: none !important;
    background-color: rgba(30, 30, 30, 0.8) !important;
    box-shadow: 2px 2px 4px rgba(24, 144, 255, 0.4) !important;
     &:hover {
    box-shadow: 2px 2px 10px rgba(24, 144, 255, 0.9) !important;
  }
`;
const AttendeeTooltip = styled.span`
    position: absolute;
    color: #fff;
    padding: 10px;
    background: rgba(0,0,0,0.8);
    transform: translate3d(-50%, -50%, 0);
    border-radius: 5px;
    pointer-events: none;
    z-index: 16777201;
`;
const StyledWrapper = styled.div`
    position: fixed;
    background-color: white;
    top: 0;
    left: 0;
    text-align: center;
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 16777201;
`;
const StyledWrapperBlack = styled.div`
    position: fixed;
    background-color: rgba(0, 0, 0, 0.8);
    top: 0;
    left: 0;
    text-align: center;
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 16777201;
`;
//CSS Ends

const FormInModal = Form.create({name: 'form_in_modal'})(
    // eslint-disable-next-line
    class extends React.Component {
        render() {
            const {
                visible, onCancel, onCreate, form, dataSource
            } = this.props;

            const {getFieldDecorator} = form;
            return (
                <Modal
                    visible={visible}
                    closable={false}
                    okText={intl.get('SAVE')}
                    onCancel={onCancel}
                    onOk={onCreate}
                    style={{top: '50%'}}
                >
                    <Form layout="vertical">
                        <Form.Item
                        >
                            {getFieldDecorator('name', {
                                rules: [{
                                    type: 'string', message: 'The input is not valid name',
                                }, {
                                    required: true, message: 'Enter name',
                                }],
                            })(<AutoComplete
                                    dataSource={dataSource}
                                    placeholder={this.props.currentAttendeeName}
                                    filterOption={(inputValue, option) =>
                                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                >
                                </AutoComplete>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    }
);

class FaceTagComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: -1,
            visible: false,
            faceData: null,
            faceNames: null,
            fieldPeople: null,
            currentAttendeeName: null,
            currentAttendeeCoords: null,
            hoveredArea: null,
            isLoading: true,
            nameFetching: false,
            registeredAttendees: null,
            dataSource: []
        }
    }

    doneTagging = () => {
        this.props.toggleFaceTagging(false);
    };
    handleMapperClick = (area) => {

        this.setState({
            currentAttendeeName: area.name,
            currentAttendeeCoords: area.coords,
            visible: true
        });
    };
    handleCancel = () => {
        this.setState({visible: false});
    };

    enterArea(area) {
        this.setState({hoveredArea: area});
    }

    leaveArea(area) {
        this.setState({hoveredArea: null});
    }

    getTipPosition = area => {
        return {top: `${area.center[1]}px`, left: `${area.center[0]}px`};
    };
    getFaceData = () => {
        const {currentImage} = this.props;
        const uuid = this.props.data.finalResponse[currentImage].uuid[0];
        axios({
            method: 'get',
            url: `${prodURL}/jsonapi/node/puzzle/${uuid}`,
            auth: {
                username: `${fetchUsername}`,
                password: `${fetchPassword}`
            },
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            }
        }).then(res => {
                this.setState({
                    faceData: JSON.parse(res.data.data.attributes.field_image_face_rectangles),
                    faceNames: res.data.data.attributes.field_image_face_names,
                    fieldPeople: res.data.data.relationships.field_people.data
                })
            }
        )
            .then(res => {
                this.setState({
                    isLoading: false,
                    nameFetching: false,
                });
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
    };
    getRegisteredAttendees = () => {
        const {eventAccessCode} = this.props.data;
        axios({
            method: 'get',
            url: `${prodURL}/jsonapi/node/attendee/?filter[field_event_reference.field_event_access_code][value]=${eventAccessCode}&fields[node--attendee]=field_full_name`,
            auth: {
                username: `${fetchUsername}`,
                password: `${fetchPassword}`
            },
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            }
        })
            .then(res => {
                const responseData = res.data.data;
                const filtered = responseData.filter(item => item.attributes.field_full_name);
                const attendeeNames = filtered.map(item => item.attributes.field_full_name);

                this.setState({
                    registeredAttendees: responseData,
                    dataSource: attendeeNames
                });
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
    };

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            form.resetFields();

            const {currentImage} = this.props;
            const uuid = this.props.data.finalResponse[currentImage].uuid[0];
            const areas = this.state.faceData.areas;
            const {currentAttendeeName, currentAttendeeCoords, faceNames, registeredAttendees, fieldPeople} = this.state;
            const enteredName = values.name;
            let dataBody, filteredFieldPeople;

            const validatedAttendee = registeredAttendees.find(item => item.attributes.field_full_name === enteredName);//Validating if attendee is registered
            const currentRegisteredAttendee = registeredAttendees.find(item => item.attributes.field_full_name === currentAttendeeName);//Current registered attendee

            if (currentRegisteredAttendee) {
                filteredFieldPeople = fieldPeople.filter(item => item.id !== currentRegisteredAttendee.id);//removing old current registered attendee from filed_people
            } else {
                filteredFieldPeople = fieldPeople;
            }

            const newAreas = areas.map(i => {
                if (_.isEqual(i.coords, currentAttendeeCoords) && validatedAttendee) {
                    i = {...i, name: enteredName, UUID: validatedAttendee.id};//add UUID for registered attendees
                } else if (_.isEqual(i.coords, currentAttendeeCoords) && !validatedAttendee) {
                    i = {...i, name: enteredName, UUID: null};
                }
                return i;
            });

            const newFaceData = {...this.state.faceData, areas: newAreas};
            const multipleNames = newAreas.some(i => i.name === currentAttendeeName);

            if (validatedAttendee) {
                const filteredFaceNames = faceNames.filter(item => item !== currentAttendeeName); //remove existing name

                const newFieldPeople = [...filteredFieldPeople,
                    {
                        "type": "node--attendee",
                        "id": validatedAttendee.id
                    }
                ];

                const attributes = multipleNames ?
                    {
                        "field_image_face_rectangles": JSON.stringify(newFaceData),
                    }
                    :
                    {
                        "field_image_face_rectangles": JSON.stringify(newFaceData),
                        "field_image_face_names": filteredFaceNames //delete from this field
                    };

                dataBody = {
                    "type": "node--puzzle",
                    "id": uuid,
                    "attributes": attributes,
                    "relationships": {
                        "field_people": {
                            "data": newFieldPeople
                        }
                    }
                }
            } else {
                const nameAlreadyIncluded = faceNames.includes(enteredName);
                const currentNameAlreadyIncluded = faceNames.includes(currentAttendeeName);

                if (!nameAlreadyIncluded) {
                    if (currentNameAlreadyIncluded && !multipleNames) {
                        faceNames[faceNames.indexOf(currentAttendeeName)] = enteredName;
                    } else {
                        faceNames.push(enteredName)
                    }
                }

                const attributes = nameAlreadyIncluded ?
                    {
                        "field_image_face_rectangles": JSON.stringify(newFaceData),
                    }
                    :
                    {
                        "field_image_face_rectangles": JSON.stringify(newFaceData),
                        "field_image_face_names": faceNames
                    };

                dataBody = {
                    "type": "node--puzzle",
                    "id": uuid,
                    "attributes": attributes,
                    "relationships": {
                        "field_people": {
                            "data": filteredFieldPeople
                        }
                    }
                }
            }

            axios({
                method: 'patch',
                url: `${prodURL}/jsonapi/node/puzzle/${uuid}`,
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
                    "data": dataBody
                }
            })
                .then(res => {
                    this.setState({
                        visible: false,
                        nameFetching: true
                    });
                    this.getFaceData();
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
        })
    };
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    componentDidMount() {
        this.getFaceData();
        this.getRegisteredAttendees();
    }

    render() {
        const {currentImage} = this.props;
        const maxWidth = this.props.data.photosToRender[currentImage].width;
        const {width, isLoading, currentAttendeeName, hoveredArea, visible, faceData, nameFetching, dataSource} = this.state;
        const src = this.props.data.photosToRender[currentImage].originalSizeSRC;

        return (
            !isLoading ?
                <Measure bounds onResize={(contentRect) => this.setState({width: contentRect.bounds.width})}>
                    {({measureRef}) => (
                        <FaceTaggingWrapper>
                            <FaceTaggingInner ref={measureRef}
                                              style={{
                                                  maxWidth: maxWidth,
                                              }}>
                                <ButtonWrapper>
                                    <Tooltip placement="right" title={intl.get('DONE_TAGGING')}>
                                        <StyledButton type="ghost" onClick={this.doneTagging}>
                                            <Icon type="check" theme="outlined"
                                                  style={{fontSize: '22px', color: 'rgba(18, 175, 10, 1)'}}/>
                                        </StyledButton>
                                    </Tooltip>
                                </ButtonWrapper>
                                <ImageMapper
                                    src={src}
                                    map={faceData}
                                    onClick={area => this.handleMapperClick(area)}
                                    onMouseEnter={area => this.enterArea(area)}
                                    onMouseLeave={area => this.leaveArea(area)}
                                    imgWidth={maxWidth}
                                    width={width}
                                />
                                {nameFetching ?
                                    <StyledWrapperBlack>
                                        <SpinnerComponent/>
                                    </StyledWrapperBlack> : null}

                                {hoveredArea ?
                                    <AttendeeTooltip style={{...this.getTipPosition(hoveredArea)}}>
                                        {hoveredArea && hoveredArea.name}
                                    </AttendeeTooltip> : null}

                            </FaceTaggingInner>

                            <FormInModal
                                wrappedComponentRef={this.saveFormRef}
                                visible={visible}
                                onCancel={this.handleCancel}
                                onCreate={this.handleCreate}
                                currentAttendeeName={currentAttendeeName}
                                dataSource={dataSource}
                            />

                        </FaceTaggingWrapper>
                    )}
                </Measure>
                :
                <StyledWrapper>
                    <SpinnerComponent/>
                </StyledWrapper>
        )
    }
}

FaceTagComponent.propTypes = {
    photosToRender: PropTypes.array,
    finalResponse: PropTypes.array,
    xcsrfToken: PropTypes.string,
    eventAccessCode: PropTypes.string

};

const
    mapStateToProps = state => ({
        view: state.view,
        data: state.data
    });

export default connect(mapStateToProps, {
    toggleFaceTagging
})(FaceTagComponent);
