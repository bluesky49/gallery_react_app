import React from 'react'
import {Keyframes, animated} from 'react-spring'
import {Form, Icon} from 'antd'
import delay from 'delay'
import styled from "styled-components"
import SearchComponent from './SearchComponents/SearchComponent'

//CSS starts
const StyledSidebar = styled.div`
   position: fixed;
   top: 45px;
   left: 0;
   background-color: transparent;
   z-index: 2147483646;
`;
const StyledIcon = styled(Icon)`
position: absolute;
    margin: 20px;
    color: #1890ff;
    font-size: 1.5em;
    cursor: pointer;
    z-index: 2147483647;
`;
//CSS Ends

// Creates a spring with predefined animation slots
const Sidebar = Keyframes.Spring({
    // Slots can take arrays/chains,
    peek: [
        {x: 0, from: {x: -100}, delay: 500},
        {x: -100, delay: 800},
    ],
    // single items,
    open: {delay: 0, x: 0},
    // or async functions with side-effects
    close: async call => {
        await delay(400)
        await call({delay: 0, x: -100})
    },
})

// Creates a keyframed trail
const Content = Keyframes.Trail({
    peek: [
        {x: 0, opacity: 1, from: {x: -100, opacity: 0}, delay: 600},
        {x: -100, opacity: 0, delay: 0},
    ],
    open: {x: 0, opacity: 1, delay: 100},
    close: {x: -100, opacity: 0, delay: 0},
})

class SidebarComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            sidebarWidth: 0
        };
    }

    toggle = () => this.setState(state => ({open: !state.open}));

    componentDidUpdate(prevProps, prevState) {
        const {open} = this.state;

        if (open !== prevState.open && open) {
            this.setState({
                sidebarWidth: 280,
            });
        } else if (open !== prevState.open && !open) {
            setTimeout(() => {
                this.setState({
                    sidebarWidth: 0,
                });
            }, 800);
        }
    }

    render() {
        const state = this.state.open ? 'open' : 'close';
        const icon = this.state.open ? 'fold' : 'unfold';
        const items = [
            <SearchComponent/>
        ];

        return (
            <StyledSidebar>
                <StyledIcon
                    type={`menu-${icon}`}
                    onClick={this.toggle}
                />
                <Sidebar native state={state}>
                    {({x}) => (
                        <animated.div
                            className="sidebar"
                            style={{
                                transform: x.interpolate(x => `translate3d(${x}%,0,0)`),
                                width: this.state.sidebarWidth
                            }}>
                            <Content
                                native
                                items={items}
                                //keys={items.map((_, i) => i)}
                                reverse={!this.state.open}
                                state={state}>
                                {(item, i) => ({x, ...props}) => (
                                    <animated.div
                                        style={{
                                            transform: x.interpolate(x => `translate3d(${x}%,0,0)`),
                                            ...props,
                                        }}>
                                        <Form.Item className={i === 0 ? 'middle' : ''}>
                                            {item}
                                        </Form.Item>
                                    </animated.div>
                                )}
                            </Content>
                        </animated.div>
                    )}
                </Sidebar>
            </StyledSidebar>
        )
    }
}

export default SidebarComponent;