import React, {Component} from 'react';
import {ReactiveBase, DataSearch, ReactiveList, MultiList} from '@appbaseio/reactivesearch';
import {Button} from "antd";
import styled from "styled-components";
import _ from 'lodash';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
    closeSearchPanel
} from "../../actions/viewActions";

import {
    toggleGalleryLoading,
    disableGalleryLoading,
    setFinalResponse,
    setTotalResults,
    setSearchResult,
    setSearchResultStatus
} from "../../actions/dataActions";
import {IconContext} from "react-icons";
import {Icon, Tooltip} from "antd";
import {MdFace} from 'react-icons/md';
import intl from "react-intl-universal";

// CSS starts

const StyledSearchWrapper = styled.div`
   min-width: 250px;
   margin-top: 60px;
`;
const StyledReactiveBase = styled(ReactiveBase)`
   display: flex;
   flex-direction: column;
   flex-wrap: wrap;
`;

const StyledFaceWrapper = styled.div`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
`;

const ButtonWrapper = styled.div`
width: 250px !important;
`;
const DisplayResultsButton = styled(Button)`
   width: 100% !important;
`;
const StyledNoResults = styled.div`
    color: white !important;
    font-size: 12px !important;
`;
const SearchComponentsWrapper = styled.div`
   display: flex;
   flex-direction: row;
   flex-wrap: wrap;
`;
const LeftColumn = styled.div`
   min-width: 250px;
`;
const RightColumn = styled.div`
   display: flex;
   flex-wrap: wrap;
   margin-left: 0;
   margin-right: 15px;
   
   @media (min-width: 600px) {
   margin-left: 10px;
   margin-right: 10px;
   }
`;
const StyledMultilist = styled(MultiList)`
   @media (min-width: 600px) {
   margin-left: 10px;
   margin-right: 10px;
   }
`;

// CSS ends

class SearchComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstUpdate: true,
            showDisplayButton: true,
            methodAllowed: null,
            all_face: false,
            some_face: false,
            no_face_id: false,
            no_face_in: false                
        };
    }

    handleApplyFilters = async () => {
        const {all_face, some_face, no_face_in, no_face_id} = this.state;
        if (this.firstLoad === undefined) {
            this.firstLoad = false
        } else {
            this.props.setSearchResultStatus(true)
        }

        await this.props.toggleGalleryLoading();
        await this.props.closeSearchPanel();

        let faceFilters = [];
        if(all_face)
            faceFilters.push(2);
        if(some_face)
            faceFilters.push(1);
        if(no_face_id)
            faceFilters.push(0);
        if(no_face_in)
            faceFilters.push(3);
        const filterFaces = this.result.filter((el) => {
            if(faceFilters.length === 0)
                return true;
            const isExist = el.recognition_status.filter((el) => {
                return faceFilters.indexOf(el) !== -1;
            });
            if(isExist.length > 0)
                return true;
            return false;
        });
        console.log(filterFaces)
        const chunkedResults = _.chunk(filterFaces, 50);
        await this.props.setSearchResult(chunkedResults);
        await this.props.setTotalResults(this.result.length);

        setTimeout(() => {
                this.props.setFinalResponse(chunkedResults[0]);
            },
            10);
    };
    handleSearchResult = data => {
        this.result = data;

        if (this.result[0] && this.firstLoad === undefined) {
            this.handleApplyFilters();
        }
        if (this.result[0] && !this.state.showDisplayButton && this.state.methodAllowed === "handleSearchResult") {

            this.setState({
                showDisplayButton: true,
                methodAllowed: "handleNoResults"
            })
        }
    };
    handleNoResults = () => {
        if (this.state.methodAllowed === "handleNoResults")
            this.setState({
                showDisplayButton: false,
                methodAllowed: "handleSearchResult"
            })
    };

    componentDidMount() {
        this.setState({methodAllowed: "handleNoResults"})
    }

    handleFaceSelect =(sel_id) => {
        const {all_face, some_face, no_face_id, no_face_in} = this.state;
        if(sel_id === 1) {
            this.setState({
                all_face: !all_face
            });
        }else if(sel_id === 2) {
            this.setState({
                some_face: !some_face
            });
        }else if(sel_id === 3) {
            this.setState({
                no_face_id: !no_face_id
            });
        }else if(sel_id === 4) {
            this.setState({
                no_face_in: !no_face_in
            });
        }
    }

    render() {
        let elasticIndex = {['app']: `elasticsearch_index_bitnami_drupal8_${this.props.data.eventAccessCode}`};
        const { all_face, some_face, no_face_id, no_face_in } = this.state;
        return (
            <StyledSearchWrapper>
                <StyledReactiveBase
                    {...elasticIndex}
                    url="https://db170860be1944a39e20206e398f370c.eu-west-1.aws.found.io:9243"
                    credentials="elastic:Uh44gjyJ78iGYMzMez0WJI7L"
                >
                    <SearchComponentsWrapper>
                        <LeftColumn>

                            <DataSearch
                                showClear={true}
                                componentId="SearchAttendee"
                                title={intl.get('FILTER_BY_ATTENDEE')}
                                dataField={["image_face_names"]}
                                autosuggest={true}
                                queryFormat="and"
                                placeholder={intl.get('ENTER_ATTENDEE’S_NAME')}
                                innerClass={{
                                    title: 'datasearch__title',
                                    input: 'datasearch__input',
                                    list: 'datasearch__list'
                                }}
                            />
                            <DataSearch
                                showClear={true}
                                componentId="SearchAuthor"
                                title={intl.get('FILTER_BY_AUTHOR')}
                                dataField={["author_last_name", "author_first_name", "author_full_name"]}
                                autosuggest={true}
                                queryFormat="and"
                                placeholder={intl.get('ENTER_AUTHOR’S_NAME')}
                                innerClass={{
                                    title: 'datasearch__title',
                                    input: 'datasearch__input',
                                    list: 'datasearch__list'
                                }}
                            />
                            <StyledFaceWrapper>
                                <IconContext.Provider value={{
                                    color: '#00ff00',
                                    className: "faces-icon-toggle" + (all_face?" selected":"")
                                }}>
                                    <Tooltip placement="bottom" title={intl.get('ALL_FACES')} overlayClassName="lightbox__tooltip">
                                        <MdFace onClick={() => this.handleFaceSelect(1)}/>
                                    </Tooltip>
                                </IconContext.Provider>
                                <IconContext.Provider value={{
                                    color: '#ffa500',
                                    className: "faces-icon-toggle" + (some_face?" selected":"")
                                }}>
                                    <Tooltip placement="bottom" title={intl.get('SOME_FACES')} overlayClassName="lightbox__tooltip">
                                        <MdFace onClick={() => this.handleFaceSelect(2)}/>
                                    </Tooltip>
                                </IconContext.Provider>
                                <IconContext.Provider value={{
                                    color: '#ff0000',
                                    className: "faces-icon-toggle" + (no_face_id?" selected":"")
                                }}>
                                    <Tooltip placement="bottom" title={intl.get('NO_FACE_ID')} overlayClassName="lightbox__tooltip">
                                        <MdFace onClick={() => this.handleFaceSelect(3)}/>
                                    </Tooltip>
                                </IconContext.Provider>
                                <IconContext.Provider value={{
                                    color: '#60636c',
                                    className: "faces-icon-toggle" + (no_face_in?" selected":"")
                                }}>
                                    <Tooltip placement="bottom" title={intl.get('NO_FACE_IN')} overlayClassName="lightbox__tooltip">
                                        <MdFace onClick={() => this.handleFaceSelect(4)}/>
                                    </Tooltip>
                                </IconContext.Provider>
                            </StyledFaceWrapper>
                            <ReactiveList
                                componentId="SearchResult"
                                dataField="SearchSensor"
                                react={{
                                    "and": ["SearchSensor", "multiList_attendee_group", "multiList_image_moment", "multiList_locality", "SearchAttendee", "SearchAuthor", "multiList_album_titles"]
                                }}
                                size={9999}
                                pagination={false}
                                render={({ loading, error, data }) => {
                                    this.handleSearchResult(data);
                                    if (loading) {
                                        return <div style={{display: 'none'}}>&nbsp;</div>;
                                    }
                                    if (error) {
                                        return <div style={{display: 'none'}}>&nbsp;</div>;
                                    }
                                    return (
                                        <ul style={{display: 'none'}}>&nbsp;</ul>
                                    );}}
                                renderNoResults={this.handleNoResults}
                                sortOptions={[
                                    {
                                        "label": "Desc",
                                        "dataField": "image_date",
                                        "sortBy": "desc"
                                    },
                                    {
                                        "label": "Asc",
                                        "dataField": "image_date",
                                        "sortBy": "asc"
                                    }
                                ]}
                                renderResultStats={
                                    function (stats) {
                                        return (
                                            `${stats.numberOfResults} ${intl.get('RESULTS')} ${intl.get('FOUND')} ${intl.get('IN')} ${stats.time} ${intl.get('MS')}`
                                        )
                                    }
                                }
                                innerClass={{
                                    resultsInfo: 'reactivelist__resultsInfo',
                                    sortOptions: 'reactivelist__sortOptions',
                                    resultStats: 'reactivelist__resultStats',
                                    noResults: 'reactivelist__noResults',
                                    button: 'reactivelist__button',
                                    pagination: 'reactivelist__pagination',
                                    active: 'reactivelist__active',
                                    list: 'reactivelist__list',
                                    poweredBy: 'reactivelist__poweredBy'
                                }}
                                onQueryChange={
                                    function(prevQuery, nextQuery) {
                                      // use the query with other js code
                                      console.log('prevQuery', prevQuery);
                                      console.log('nextQuery', nextQuery);
                                    }
                                  }
                            />
                        </LeftColumn>

                        <RightColumn>
                            <StyledMultilist
                                componentId="multiList_attendee_group"
                                dataField="attendee_group"
                                title={intl.get('ATTENDEE_GROUP')}
                                showSearch={false}
                                showCheckbox={true}
                                innerClass={{
                                    title: 'multilist__title',
                                    input: 'multilist__input',
                                    list: 'multilist__list',
                                    checkbox: 'multilist__checkbox',
                                    label: 'multilist__label',
                                    count: 'multilist__count'
                                }}
                            />
                            <StyledMultilist
                                componentId="multiList_image_moment"
                                dataField="image_moment"
                                title={intl.get('MOMENT')}
                                showSearch={false}
                                showCheckbox={true}
                                innerClass={{
                                    title: 'multilist__title',
                                    input: 'multilist__input',
                                    list: 'multilist__list',
                                    checkbox: 'multilist__checkbox',
                                    label: 'multilist__label',
                                    count: 'multilist__count'
                                }}
                            />
                            <StyledMultilist
                                componentId="multiList_locality"
                                dataField="image_locality"
                                title={intl.get('LOCATION')}
                                showSearch={false}
                                showCheckbox={true}
                                innerClass={{
                                    title: 'multilist__title',
                                    input: 'multilist__input',
                                    list: 'multilist__list',
                                    checkbox: 'multilist__checkbox',
                                    label: 'multilist__label',
                                    count: 'multilist__count'
                                }}
                            />
                        </RightColumn>
                    </SearchComponentsWrapper>
                    <ButtonWrapper>
                        {this.state.showDisplayButton ?
                            <DisplayResultsButton type="primary" onClick={this.handleApplyFilters}>
                                {intl.get('DISPLAY_RESULTS')}
                            </DisplayResultsButton>
                            :
                            <StyledNoResults>
                                {intl.get('NO_RESULTS')}
                            </StyledNoResults>
                        }
                    </ButtonWrapper>
                </StyledReactiveBase>
            </StyledSearchWrapper>
        );
    }
}

SearchComponent.propTypes = {
    finalResponse: PropTypes.array,
    galleryIsLoading: PropTypes.bool,
    eventAccessCode: PropTypes.string,
    totalResults: PropTypes.number,
    searchResult: PropTypes.array,
    searchPanelIsOpen: PropTypes.bool
};

const mapStateToProps = state => ({
    data: state.data,
    view: state.view
});

export default connect(mapStateToProps, {
    toggleGalleryLoading,
    disableGalleryLoading,
    setFinalResponse,
    setTotalResults,
    setSearchResult,
    closeSearchPanel,
    setSearchResultStatus
})(SearchComponent);