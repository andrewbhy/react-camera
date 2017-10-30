import React, { Component } from 'react'


const defaultStyle = {
    display: "block",
    width: 50,
    height: 50,
    //backgroundColor:"white"
}

export default class CaptureButton extends Component {

    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this)
    }


    render() {
        return (
            <a style={defaultStyle} onClick={this.handleClick} >
                <svg height="60" width="60">
                    <circle cx="30" cy="30" r="30" stroke="none" strokeWidth="3" fill="white" />
                </svg>
            </a>
        )
    }

    handleClick(e) {
        if (this.props.onClick) {
            this.props.onClick(e)
        }
    }
}

CaptureButton.defaultProps = {

    onClick: null,

    style: null
}