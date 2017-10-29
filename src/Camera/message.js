import React, { Component } from 'react'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; 
import "./message.css"

export default class Message extends Component{



    constructor(props){
        super(props)

        this.state = { display : this.props.display }

       
    }

    componentDidUpdate( ) {
        let ctx = this;

        if( !this.props.permanent){

            setTimeout(function() {
                ctx.setState({display:false})
            }, 100);

        }
    }
   
    componentWillUpdate() {

        this.state.display=true;
    }


    render(){
        
        return (
            <div>

                <ReactCSSTransitionGroup
                    transitionName="msg"
                    transitionAppear={true}
                    transitionAppearTimeout={300}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                >
                {
                    this.state.display && <span className="msgSpan">{this.props.msg}</span>
                }
                    
                </ReactCSSTransitionGroup>
               
            </div>
        )
    }
}


Message.defaultProps = {
    msg : "hebheheh",
    display : false,
    permanent : false
}