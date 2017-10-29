import React, { Component } from 'react'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; 


export default class Message extends Component{

    constructor(props){
        super(props)
    }


    render(){
        
        return (
            <div>

                <ReactCSSTransitionGroup
                    transitionName="msg"
                    transitionAppear={true}
                    
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                >
                    <span>{this.msg}</span>
                
                </ReactCSSTransitionGroup>
               
            </div>
        )
    }
}


Message.defaultProps = {

    display : false,

    msg : ""
}