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
    setSearchResult
} from "../../actions/dataActions";

// CSS starts

const StyledSearchWrapper = styled.div`
   min-width: 250px;
   margin-top: 60px;
`;

const ButtonWrapper = styled.div`
   display: flex;
   justify-content: space-between;
`;
const DisplayResultsButton = styled(Button)`
   width: 100% !important;
`;

// CSS ends

class SearchComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstUpdate: true,
        };
    }

    handleApplyFilters = async () => {
        if (this.firstLoad === undefined) {
            this.firstLoad = false
        }

        await this.props.toggleGalleryLoading();
        await this.props.closeSearchPanel();

        const chunkedResults = _.chunk(this.result, 50);

        await this.props.setSearchResult(chunkedResults);
        await this.props.setTotalResults(this.result.length);
        await this.props.setFinalResponse(chunkedResults[0]);
    };

    handleSearchResult = results => {
        this.result = results.results;

        if (this.result[0] && this.firstLoad === undefined) {
            this.handleApplyFilters();
        }
    };

    render() {

        let elasticIndex = {['app']: `elasticsearch_index_bitnami_drupal8_${this.props.data.eventAccessCode}`};

        return (
                <StyledSearchWrapper>
                    <ReactiveBase
                        {...elasticIndex}
                        url="https://db170860be1944a39e20206e398f370c.eu-west-1.aws.found.io:9243"
                        credentials="elastic:Uh44gjyJ78iGYMzMez0WJI7L"
                    >
                        <DataSearch
                            showClear={true}
                            componentId="SearchSensor"
                            dataField={["attendee_first_name", "author_last_name", "author_first_name", "author_email",
                                "attendee_last_name", "attendee_first_name", "attendee_email", "attendee_group", "image_locality"]}
                            autosuggest={true}
                            innerClass={{
                                title: 'datasearch__title',
                                input: 'datasearch__input',
                                list: 'datasearch__list'
                            }}
                        />
                        <MultiList
                            componentId="multiList_attendee_group"
                            dataField="attendee_group"
                            showSearch={false}
                            title="Attendee group"
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
                        <MultiList
                            componentId="multiList_image_moment"
                            dataField="image_moment"
                            showSearch={false}
                            title="Moments"
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
                        <DataSearch
                            showClear={true}
                            componentId="SearchAttendee"
                            title="Filter by attendee"
                            dataField={["attendee_first_name", "attendee_last_name", "attendee_email"]}
                            autosuggest={true}
                            placeholder={"Enter attendee's name"}
                            innerClass={{
                                title: 'datasearch__title',
                                input: 'datasearch__input',
                                list: 'datasearch__list'
                            }}
                        />
                        <DataSearch
                            showClear={true}
                            componentId="SearchAuthor"
                            title="Filter by author"
                            dataField={["author_last_name", "author_first_name", "author_email"]}
                            autosuggest={true}
                            placeholder={"Enter author's name"}
                            innerClass={{
                                title: 'datasearch__title',
                                input: 'datasearch__input',
                                list: 'datasearch__list'
                            }}
                        />
                        <ReactiveList
                            componentId="SearchResult"
                            dataField="SearchSensor"
                            react={{
                                "and": ["SearchSensor", "multiList_attendee_group", "multiList_image_moment", "SearchAttendee", "SearchAuthor","multiList_album_titles"]
                            }}
                            size={9999}
                            pagination={false}
                            loader="Loading..."
                            renderAllData={this.handleSearchResult}
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
                        />
                    </ReactiveBase>

                    <ButtonWrapper>
                        <DisplayResultsButton type="primary" onClick={this.handleApplyFilters}>Display Results</DisplayResultsButton>
                    </ButtonWrapper>

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
    closeSearchPanel
})(SearchComponent);