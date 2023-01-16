import React, { Component } from "react";

export default class Splitter extends Component {

    render() {
        const style = {};
        style.height = '100%';
        style['display'] = 'flex';
        style['flex'] = '1 1 0';
        style['flexDirection'] = 'row';
        style['minWidth'] = '0';

        return (
            <div style={style}>
               {this.props.children}
            </div>
        )
    }
}
