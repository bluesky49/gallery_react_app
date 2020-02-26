import React from 'react';
import App from "../App";
import {Element} from 'react-scroll'

class ScrollComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFullscreen: this.props.isFullscreen,
            overflowY: 'visible',
            height: 'auto'
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isFullscreen !== nextProps.isFullscreen) {
            // Fullscreen status has changed.
            this.setState({
                isFullscreen: this.props.isFullscreen,
                overflowY: 'scroll',
                height: '100vh'
            });
            if (this.props.isFullscreen === true) {
                this.setState({
                    overflowY: 'visible',
                    height: 'auto'
                });
            }
        }

        if (this.props.isRowView !== nextProps.isRowView) {
            // Fullscreen status has changed.
            this.setState({
                isRowView: this.props.isRowView
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <Element style={{
                    position: 'relative',
                    height: this.state.height,
                    overflowY: this.state.overflowY
                }}>
                    <App/>
                </Element>

            </React.Fragment>
        );
    }
};

export default ScrollComponent;