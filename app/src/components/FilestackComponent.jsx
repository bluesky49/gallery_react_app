import React, {Component} from 'react';
import Loader from 'react-loader-spinner';
import styled from "styled-components";
import {picture} from 'filestack-adaptive';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {filestackPolicy, filestackSignature} from "../keys";
import GalleryComponent from "./Gallery/GalleryComponent";
import {toggleGalleryLoading, disableLoading, disableGalleryLoading, setPhotosToRender} from "../actions/dataActions";

// CSS starts
const StyledWrapper = styled.div`
    text-align: center;
    min-height: 50vh;
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

                    if (item.image_rotation !== undefined && item.image_rotation[0] === "Rotated 180") {
                        const transformOptions = {
                            transformOptions: {
                                alt: 'alt',
                                security: {
                                    policy: filestackPolicy,
                                    signature: filestackSignature
                                },
                                formats: ['pjpg','webp'],
                                keys: true,
                                sizes: {
                                    fallback: '60vw',
                                },
                                transforms: {
                                    resize: {
                                        height: 201,
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
                                formats: ['pjpg','webp'],
                                keys: true,
                                sizes: {
                                    fallback: '60vw',
                                },
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
                    if (item.image_rotation !== undefined && item.image_rotation[0] === "Rotated 90 CW") {
                        const transformOptions = {
                            transformOptions: {
                                alt: 'alt',
                                security: {
                                    policy: filestackPolicy,
                                    signature: filestackSignature
                                },
                                formats: ['pjpg','webp'],
                                keys: true,
                                sizes: {
                                    fallback: '60vw',
                                },
                                transforms: {
                                    resize: {
                                        height: 201,
                                        width: 268,
                                        fit: 'max'
                                    },
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
                        const transformOptionsLightbox = {
                            transformOptionsLightbox: {
                                alt: 'alt',
                                security: {
                                    policy: filestackPolicy,
                                    signature: filestackSignature
                                },
                                formats: ['pjpg','webp'],
                                keys: true,
                                sizes: {
                                    fallback: '60vw',
                                },
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
                                formats: ['pjpg','webp'],
                                keys: true,
                                sizes: {
                                    fallback: '60vw',
                                },
                                transforms: {
                                    resize: {
                                        height: 201,
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
                                formats: ['pjpg','webp'],
                                keys: true,
                                sizes: {
                                    fallback: '60vw',
                                },
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

                    if (item.image_rotation !== undefined && item.image_rotation[0] === "Rotated 90 CW") {

                        const date = item.image_date !== undefined ? new Date(item.image_date[0] * 1000).toLocaleString() : "The date is not specified";
                        const authorEmail = item.author_email !== undefined ? item.author_email[0] : "unknown author";

                        return (
                            {
                                src: `${picture(item.filestack_handle[0], item.transformOptions).lastChild.src}`,
                                width: parseInt(`${item.image_height !== undefined ? item.image_height[0] : 3}`, 10),
                                height: parseInt(`${item.image_width !== undefined ? item.image_width[0] : 4}`, 10),
                                sizes: '(max-width: 180px) 180px, (max-width: 360px) 360px, (max-width: 540px) 540px, (max-width: 720px) 720px, (max-width: 900px) 900px, (max-width: 1080px) 1080px, (max-width: 1296px) 1296px, (min-width: 1512px) 1512px, (max-width: 1728px) 1728px, (max-width: 1944px) 1944px, (max-width: 2160px) 2160px, (max-width: 2376px) 2376px, (max-width: 2592px) 2592px, (max-width: 2808px) 2808px, (max-width: 3024px) 3024px',
                                srcSet: `${picture(item.filestack_handle[0], item.transformOptionsLightbox).firstChild.attributes.srcset.textContent}`,
                                caption: "By " + authorEmail + " on " + date,
                                alt: `${item.image_alt !== undefined ? item.image_alt[0] : "EventStory Image"}`,
                                uuid: item.uuid[0]
                            }
                        )
                    } else {

                        const date = item.image_date !== undefined ? new Date(item.image_date[0] * 1000).toLocaleString() : "The date is not specified";
                        const authorEmail = item.author_email !== undefined ? item.author_email[0] : "unknown author";

                        return (
                            {
                                src: `${picture(item.filestack_handle[0], item.transformOptions).lastChild.src}`,
                                width: parseInt(`${item.image_width !== undefined ? item.image_width[0] : 4}`, 10),
                                height: parseInt(`${item.image_height !== undefined ? item.image_height[0] : 3}`, 10),
                                sizes: '(max-width: 180px) 180px, (max-width: 360px) 360px, (max-width: 540px) 540px, (max-width: 720px) 720px, (max-width: 900px) 900px, (max-width: 1080px) 1080px, (max-width: 1296px) 1296px, (min-width: 1512px) 1512px, (max-width: 1728px) 1728px, (max-width: 1944px) 1944px, (max-width: 2160px) 2160px, (max-width: 2376px) 2376px, (max-width: 2592px) 2592px, (max-width: 2808px) 2808px, (max-width: 3024px) 3024px',
                                srcSet: `${picture(item.filestack_handle[0], item.transformOptionsLightbox).firstChild.attributes.srcset.textContent}`,
                                caption: "By " + authorEmail + " on " + date,
                                alt: `${item.image_alt !== undefined ? item.image_alt[0] : "EventStory Image"}`,
                                uuid: item.uuid[0]
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
                    <Loader
                        type="Oval"
                        color="#eb5d68"
                        height="60"
                        width="60"
                    />
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