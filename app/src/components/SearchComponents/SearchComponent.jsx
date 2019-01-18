import React, {Component} from 'react';
import {ReactiveBase, DataSearch, ReactiveList, MultiList} from '@appbaseio/reactivesearch';
import FilestackImages from "../FilestackImages";
import {Button, Pagination} from "antd";
import styled from "styled-components";
import _ from 'lodash';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import 'antd/lib/button/style/css';
import 'antd/lib/icon/style/css';
import 'antd/lib/pagination/style/css';
import {
    toggleGalleryLoading,
    disableGalleryLoading,
    setFinalResponse,
    setInitialResponse
} from "../../actions/dataActions";

// CSS starts

const StyledWrapper = styled.div`
   margin-top: 5px;
   display: flex;
      @media(max-width: 800px) {
      flex-direction: column;
      }
`;
const StyledGallery = styled.div`
   width:100%;
   padding-left: 5px;
   padding-right: 5px;
   height: auto;
`;
const StyledSearchWrapper = styled.div`
   padding: 4px 10px 10px 10px;
   min-width: 250px; 
`;

const PaginationWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   margin: 20px;
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
            searchResult: [],
            chunkedResults: [],
            totalResults: 0,
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

        await this.setState({
            searchResult: chunkedResults,
            totalResults: this.result.length
        });
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
        this.setState({
            totalResults: this.state.initialTotalResults
        });
    };

    onChange = (page, pageSize) => {
        this.props.toggleGalleryLoading();
        const {searchResult} = this.state;
        this.props.setFinalResponse(searchResult[page - 1]);
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
        let totalPages = this.state.totalResults;
        let elasticIndex = {['app']: `elasticsearch_index_bitnami_drupal8_${this.props.eventAccessCode}`};
        //console.log(this.props.eventAccessCode);

        return (
            <StyledWrapper>
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

                <StyledGallery>

                    <FilestackImages/>

                    <PaginationWrapper>
                        <Pagination onChange={this.onChange} defaultPageSize={50} total={totalPages}/>
                    </PaginationWrapper>

                </StyledGallery>
            </StyledWrapper>
        );
    }
}

SearchComponent.propTypes = {
    initialResponse: PropTypes.array,
    finalResponse: PropTypes.array,
    galleryIsLoading: PropTypes.bool,
    eventAccessCode: PropTypes.string
};

const mapStateToProps = state => ({
    data: state.data
});

export default connect(mapStateToProps, {
    toggleGalleryLoading,
    disableGalleryLoading,
    setFinalResponse,
    setInitialResponse
})(SearchComponent);