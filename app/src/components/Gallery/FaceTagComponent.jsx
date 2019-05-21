import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from "styled-components";
import ImageMapper from 'react-image-mapper';
import Measure from 'react-measure';

import {toggleFaceTagging} from '../../actions/viewActions';
import {Button, Icon, Tooltip, Modal, Form, Input} from "antd";

//CSS starts
const FaceTaggingWrapper = styled.div`
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
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
//CSS Ends

const FormInModal = Form.create({name: 'form_in_modal'})(
    // eslint-disable-next-line
    class extends React.Component {
        render() {
            const {
                visible, onCancel, onCreate, form,
            } = this.props;
            const {getFieldDecorator} = form;
            return (
                <Modal
                    visible={visible}
                    closable={false}
                    okText="Save"
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
                            })(
                                <Input placeholder="Attendee name"/>
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
            visible: false
        };
    }

    doneTagging = () => {
        this.props.toggleFaceTagging(false);
    };

    handleMapperClick = (area) => {
        console.log(area);
        this.setState({visible: true});
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            form.resetFields();
        })
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render() {
        const {currentImage} = this.props;
        const maxWidth = this.props.data.photosToRender[currentImage].width;
        const {width} = this.state;
        const src = this.props.data.photosToRender[currentImage].originalSizeSRC;
        const map = this.props.data.finalResponse[currentImage].image_face_rectangles ?
            JSON.parse(this.props.data.finalResponse[currentImage].image_face_rectangles)
            :
            null;
        /*const currentLightboxImage = this.lightboxRef.current.props.currentImage;
        const originalSizeSRC = this.props.data.photosToRender[currentLightboxImage].originalSizeSRC;*/

        return (
            map ?
                <Measure bounds onResize={(contentRect) => this.setState({width: contentRect.bounds.width})}>
                    {({measureRef}) => (
                        <FaceTaggingWrapper>
                            <FaceTaggingInner ref={measureRef}
                                              style={{
                                                  maxWidth: maxWidth,
                                              }}>
                                <ButtonWrapper>
                                    <Tooltip placement="right" title="Done tagging">
                                        <StyledButton type="ghost" onClick={this.doneTagging}>
                                            <Icon type="check" theme="outlined"
                                                  style={{fontSize: '22px', color: 'rgba(18, 175, 10, 1)'}}/>
                                        </StyledButton>
                                    </Tooltip>
                                </ButtonWrapper>
                                <ImageMapper
                                    src={src}
                                    map={map}
                                    onClick={area => this.handleMapperClick(area)}
                                    imgWidth={maxWidth}
                                    width={width}
                                />
                            </FaceTaggingInner>
                            <FormInModal
                                wrappedComponentRef={this.saveFormRef}
                                visible={this.state.visible}
                                onCancel={this.handleCancel}
                                onCreate={this.handleCreate}
                            />
                        </FaceTaggingWrapper>
                    )}
                </Measure>
                :
                null
        )
    }
}

FaceTagComponent.propTypes = {
    photosToRender: PropTypes.array,
    finalResponse: PropTypes.array,
};

const
    mapStateToProps = state => ({
        view: state.view,
        data: state.data
    });

export default connect(mapStateToProps, {
    toggleFaceTagging
})(FaceTagComponent);
