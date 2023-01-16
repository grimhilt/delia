import React, { Component } from "react";
import { ReactDOM,findDOMNode } from "react-dom";
export default class SidePanel extends Component {

    constructor() {
        super();
        this.state= {val:null};
    }
    componentDidMount() {

        let t = findDOMNode(this).getBoundingClientRect()
        this.setState({val: t});
    }

    render() {
        const style = {};
        style.height = (this.state?.val?.x - this.state?.val?.bottom) ?? '100%';
        style.width = "18rem";
        style['position'] = 'relative';
        style['top'] = '0';
        style['right'] = '0';
        // style['marginTop'] = '56px';
        style['overflowX'] = 'hidden';
        style['boxSizing'] = 'border-box';
        style['paddingTop'] =  '5px';
        style['backgroundColor'] = '#181a1b';
        style['float'] = 'right';

        // console.log(this.props.parentRef.current.offsetTop);
        // console.log(this.instance.getBoundingClientRect())
        return (
            <div style={style}>
               {this.props.children}
            </div>
        )
    }
}
