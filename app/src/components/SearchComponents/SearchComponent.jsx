import React, {Component} from 'react';
import {ReactiveBase, DataSearch, ReactiveList, MultiList} from '@appbaseio/reactivesearch';
import {Button} from "antd";
import styled from "styled-components";
import _ from 'lodash';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
    toggleGalleryLoading,
    disableGalleryLoading,
    setFinalResponse,
    setInitialResponse,
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

// CSS ends

class SearchComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chunkedResults: [],
            initialResult: ['empty'],
            firstLoad: true,
            firstUpdate: true,
            initialResponseSet: false,
            initialTotalResults: 0
        };
    }

    handleApplyFilters = async () => {
        this.props.toggleGalleryLoading();

        const chunkedResults = _.chunk(this.result, 50);

        await this.props.setSearchResult(chunkedResults);
        await this.props.setTotalResults(this.result.length);
        await this.props.setFinalResponse(chunkedResults[0]);

        if (!this.state.initialResponseSet) {
            await this.props.setInitialResponse(chunkedResults[0]);

            await this.setState({
                initialResponseSet: true,
                initialTotalResults: this.result.length
            });
        }
    };

    handleSearchResult = results => {
        this.result = results;
        console.log(results);

        if (this.result[0] && this.state.firstLoad) {
            this.setState({
                initialResult: results,
                firstLoad: false
            });
        }
    };

    handleClearFilters = () => {
        this.props.toggleGalleryLoading();
        this.props.setFinalResponse(this.props.data.initialResponse);
        this.props.setTotalResults(this.state.initialTotalResults);
    };

    componentDidUpdate(prevState, prevProps) {
        if (this.state.initialResult !== ['empty'] && this.state.firstUpdate) {
            this.setState({
                firstUpdate: false
            });
            this.handleApplyFilters();
        }
    }

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
                                "attendee_last_name", "attendee_first_name", "attendee_email", "attendee_group", "image_locality", "image_filestack_handle"]}
                            autosuggest={true}
                        />
                        <MultiList
                            componentId="MultiList"
                            dataField="attendee_group"
                            showSearch={false}
                            title="Attendee group"
                        />
                        <DataSearch
                            showClear={true}
                            componentId="SearchAttendee"
                            title="Filter by attendee"
                            dataField={["attendee_first_name", "attendee_last_name", "attendee_email"]}
                            autosuggest={true}
                            placeholder={"Enter attendee's name"}
                        />
                        <DataSearch
                            showClear={true}
                            componentId="SearchAuthor"
                            title="Filter by author"
                            dataField={["author_last_name", "author_first_name", "author_email"]}
                            autosuggest={true}
                            placeholder={"Enter author's name"}
                        />
                        <ReactiveList
                            componentId="SearchResult"
                            dataField="SearchSensor"
                            react={{
                                "and": ["SearchSensor", "MultiList", "SearchAttendee", "SearchAuthor"]
                            }}
                            size={9999}
                            pagination={false}
                            loader="Loading..."
                            onAllData={this.handleSearchResult}
                            sortOptions={[
                                {
                                    "label": "By date",
                                    "dataField": "image_date",
                                    "sortBy": "desc"
                                },
                                {
                                    "label": "By order",
                                    "dataField": "display_order",
                                    "sortBy": "desc"
                                }
                            ]}
                        />
                    </ReactiveBase>

                    <ButtonWrapper>
                        <Button type="primary" onClick={this.handleApplyFilters}>Display Results</Button>
                        <Button type="danger" ghost onClick={this.handleClearFilters}>Clear Filters</Button>
                    </ButtonWrapper>

                </StyledSearchWrapper>
        );
    }
}

SearchComponent.propTypes = {
    initialResponse: PropTypes.array,
    finalResponse: PropTypes.array,
    galleryIsLoading: PropTypes.bool,
    eventAccessCode: PropTypes.string,
    totalResults: PropTypes.number,
    searchResult: PropTypes.array
};

const mapStateToProps = state => ({
    data: state.data
});

export default connect(mapStateToProps, {
    toggleGalleryLoading,
    disableGalleryLoading,
    setFinalResponse,
    setInitialResponse,
    setTotalResults,
    setSearchResult
})(SearchComponent);