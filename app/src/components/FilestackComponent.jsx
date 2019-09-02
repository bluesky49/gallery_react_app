import React, {Component} from 'react';
import SpinnerComponent from "./SpinnerComponent";
import styled from "styled-components";
import {picture} from 'filestack-adaptive';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {filestackPolicy, filestackSignature} from "../keys";
import GalleryComponent from "./Gallery/GalleryComponent";
import {toggleGalleryLoading, disableLoading, disableGalleryLoading, setPhotosToRender} from "../actions/dataActions";
import intl from "react-intl-universal";

// CSS starts
const StyledWrapper = styled.div`
    text-align: center;
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

// CSS ends

class FilestackComponent extends Component {

    loadFromFilestack() {
        new Promise((resolve) => {
                const transformOptionsAttached = this.props.data.finalResponse.map((item) => {

                    const imageRotation = item.image_rotation ?
                        typeof item.image_rotation === 'string' ? item.image_rotation : item.image_rotation[0]
                        : null;

                    if (imageRotation == "Rotated 180") {
                        const transformOptions = {
                            transformOptions: {
                                alt: 'alt',
                                security: {
                                    policy: filestackPolicy,
                                    signature: filestackSignature
                                },
                                formats: ['pjpg', 'webp'],
                                keys: true,
                                sizes: {
                                    fallback: '60vw',
                                },
                                useValidator: false,
                                transforms: {
                                    resize: {
                                        width: 268,
                                        fit: 'max'
                                    },
                                    rotate: {
                                        deg: 180
                                    },
                                    output: {
                                        format: 'pjpg',
                                        strip: true,
                                        quality: 80,
                                        compress: true
                                    },
                                    cache: {
                                        expiry: 31536000
                                    }
                                }
                            }
                        };

                        const transformOptionsLightbox = {
                            transformOptionsLightbox: {
                                alt: 'alt',
                                security: {
                                    policy: filestackPolicy,
                                    signature: filestackSignature
                                },
                                formats: ['pjpg', 'webp'],
                                keys: true,
                                sizes: {
                                    fallback: '60vw',
                                },
                                useValidator: false,
                                transforms: {
                                    rotate: {
                                        deg: 180
                                    },
                                    output: {
                                        format: 'pjpg',
                                        strip: true,
                                        quality: 80,
                                        compress: true
                                    },
                                    cache: {
                                        expiry: 31536000
                                    }
                                }
                            }
                        };
                        return (
                            {...item, ...transformOptions, ...transformOptionsLightbox}
                        )
                    }
                    if (imageRotation == "Rotated 90 CW") {
                        const transformOptions = {
                            transformOptions: {
                                alt: 'alt',
                                security: {
                                    policy: filestackPolicy,
                                    signature: filestackSignature
                                },
                                formats: ['pjpg', 'webp'],
                                keys: true,
                                sizes: {
                                    fallback: '60vw',
                                },
                                useValidator: false,
                                transforms: {
                                    rotate: {
                                        deg: 90
                                    },
                                    resize: {
                                        width: 268,
                                        fit: 'max'
                                    },
                                    output: {
                                        format: 'pjpg',
                                        strip: true,
                                        quality: 80,
                                        compress: true
                                    },
                                    cache: {
                                        expiry: 31536000
                                    }
                                }
                            }
                        };
                        const transformOptionsLightbox = {
                            transformOptionsLightbox: {
                                alt: 'alt',
                                security: {
                                    policy: filestackPolicy,
                                    signature: filestackSignature
                                },
                                formats: ['pjpg', 'webp'],
                                keys: true,
                                sizes: {
                                    fallback: '60vw',
                                },
                                useValidator: false,
                                transforms: {
                                    rotate: {
                                        deg: 90
                                    },
                                    output: {
                                        format: 'pjpg',
                                        strip: true,
                                        quality: 80,
                                        compress: true
                                    },
                                    cache: {
                                        expiry: 31536000
                                    }
                                }
                            }
                        };
                        return (
                            {...item, ...transformOptions, ...transformOptionsLightbox}
                        )
                    } else {
                        const transformOptions = {
                            transformOptions: {
                                alt: 'alt',
                                security: {
                                    policy: filestackPolicy,
                                    signature: filestackSignature
                                },
                                formats: ['pjpg', 'webp'],
                                keys: true,
                                sizes: {
                                    fallback: '60vw',
                                },
                                useValidator: false,
                                transforms: {
                                    resize: {
                                        width: 268,
                                        fit: 'max'
                                    },
                                    output: {
                                        format: 'pjpg',
                                        strip: true,
                                        quality: 80,
                                        compress: true
                                    },
                                    cache: {
                                        expiry: 31536000
                                    }
                                }
                            }
                        };

                        const transformOptionsLightbox = {
                            transformOptionsLightbox: {
                                alt: 'alt',
                                security: {
                                    policy: filestackPolicy,
                                    signature: filestackSignature
                                },
                                formats: ['pjpg', 'webp'],
                                keys: true,
                                sizes: {
                                    fallback: '60vw',
                                },
                                useValidator: false,
                                transforms: {
                                    output: {
                                        format: 'pjpg',
                                        strip: true,
                                        quality: 80,
                                        compress: true
                                    },
                                    cache: {
                                        expiry: 31536000
                                    }
                                }
                            }
                        };
                        return (
                            {...item, ...transformOptions, ...transformOptionsLightbox}
                        )
                    }
                });

                const galleryPhotos = transformOptionsAttached.map((item) => {

                    const imageRotation = item.image_rotation ?
                        typeof item.image_rotation === 'string' ? item.image_rotation : item.image_rotation[0]
                        : null;

                    const date = item.image_date ?
                        new Date(typeof item.image_date === 'number' ? item.image_date : item.image_date[0] * 1000).toLocaleString()
                        : "unknown date";

                    const authorFullName = item.author_full_name ?
                        typeof item.author_full_name === 'string' ? item.author_full_name : item.author_full_name[0]
                        :
                        "unknown author";
                    const filestackHandle = typeof item.filestack_handle === 'string' ? item.filestack_handle : item.filestack_handle[0];

                    const imageHeight = item.image_height ?
                        typeof item.image_height === 'string' || typeof item.image_height === 'number' ?
                            item.image_height : item.image_height[0]
                        : 3;

                    const imageWidth = item.image_width ?
                        typeof item.image_width === 'string' || typeof item.image_width === 'number' ?
                            item.image_width : item.image_width[0]
                        : 4;

                    const imageAlt = item.title ?
                        typeof item.title === 'string' ? item.title : item.title[0]
                        : "EventStory Image";

                    const imageLocality = item.image_locality ?
                        typeof item.image_locality === 'string' ? item.image_locality : item.image_locality[0]
                        : " ";

                    const UUID = typeof item.uuid === 'string' ? item.uuid : item.uuid[0];

                    const responseWithLightboxOptions = picture(filestackHandle, item.transformOptionsLightbox);

                    const utcCreated = typeof item.image_date === 'number' ? item.image_date : item.image_date[0];

                    const imageTitle = typeof item.title === 'string' ? item.title : item.title[0];

                    const getExtension = filename => filename.split('.').pop();

                    const imageExtension = getExtension(imageTitle);

                    const imageType = `image/${imageExtension}`;

                    if (imageRotation == "Rotated 90 CW") {

                        return (
                            {
                                src: `${picture(filestackHandle, item.transformOptions).lastChild.src}`,
                                width: parseInt(`${imageHeight}`, 10),
                                height: parseInt(`${imageWidth}`, 10),
                                sizes: '(max-width: 180px) 180px, (max-width: 360px) 360px, (max-width: 540px) 540px, (max-width: 720px) 720px, (max-width: 900px) 900px, (max-width: 1080px) 1080px, (max-width: 1296px) 1296px, (min-width: 1512px) 1512px, (max-width: 1728px) 1728px, (max-width: 1944px) 1944px, (max-width: 2160px) 2160px, (max-width: 2376px) 2376px, (max-width: 2592px) 2592px, (max-width: 2808px) 2808px, (max-width: 3024px) 3024px',
                                srcSet: `${responseWithLightboxOptions.firstChild.attributes.srcset.textContent}`,
                                caption: intl.get('BY') + authorFullName + intl.get('ON') + date + ". " + imageLocality,
                                alt: imageAlt,
                                uuid: UUID,
                                originalSizeSRC: `${responseWithLightboxOptions.lastChild.src}`,
                                utcCreated: utcCreated,
                                type: imageType
                            }
                        )
                    } else {

                        return (
                            {
                                src: `${picture(filestackHandle, item.transformOptions).lastChild.src}`,
                                width: parseInt(`${imageWidth}`, 10),
                                height: parseInt(`${imageHeight}`, 10),
                                sizes: '(max-width: 180px) 180px, (max-width: 360px) 360px, (max-width: 540px) 540px, (max-width: 720px) 720px, (max-width: 900px) 900px, (max-width: 1080px) 1080px, (max-width: 1296px) 1296px, (min-width: 1512px) 1512px, (max-width: 1728px) 1728px, (max-width: 1944px) 1944px, (max-width: 2160px) 2160px, (max-width: 2376px) 2376px, (max-width: 2592px) 2592px, (max-width: 2808px) 2808px, (max-width: 3024px) 3024px',
                                srcSet: `${responseWithLightboxOptions.firstChild.attributes.srcset.textContent}`,
                                caption: intl.get('BY') + authorFullName + intl.get('ON') + date + ". " + imageLocality,
                                alt: imageAlt,
                                uuid: UUID,
                                originalSizeSRC: `${responseWithLightboxOptions.lastChild.src}`,
                                utcCreated: utcCreated,
                                type: imageType
                            }
                        )
                    }
                });
                resolve(galleryPhotos)
            }
        ).then((response) => {
                this.props.setPhotosToRender(response)
            }
        ).then(
            this.props.disableLoading(),
            this.props.disableGalleryLoading()
        ).catch((err) => {
            console.error(err)
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.data.finalResponse !== prevProps.data.finalResponse &&
            this.props.data.finalResponse !== ['empty'] &&
            this.props.data.finalResponse !== undefined) {
            this.loadFromFilestack();
        }
    }

    render() {
        return (
            this.props.data.galleryIsLoading || this.props.data.isLoading ?
                <StyledWrapper>
                    <SpinnerComponent/>
                </StyledWrapper>
                :
                <GalleryComponent/>
        );
    }
}

FilestackComponent.propTypes = {
    isLoading: PropTypes.bool,
    galleryIsLoading: PropTypes.bool,
    finalResponse: PropTypes.array,
    photosToRender: PropTypes.array
};

const mapStateToProps = state => ({
    data: state.data
});

export default connect(mapStateToProps, {
    toggleGalleryLoading,
    disableLoading,
    disableGalleryLoading,
    setPhotosToRender
})(FilestackComponent);