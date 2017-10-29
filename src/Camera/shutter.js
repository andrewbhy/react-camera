import React,{ Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; 
import "./shutter.css"


export default class Shutter extends Component{


    constructor(props){
        super(props)

        this.state = { display : this.props.display }

    }
    componentWillReceiveProps(props){
        
        this.setState({display:props.display})
    }

    render(){

        return (

            <div className="shutter-root" style={this.props.style}>
                <ReactCSSTransitionGroup

                    transitionName={"shutter-transition"}
                    transitionAppear={true}
                    transitionAppearTimeout={300}
                   
                    transitionEnter={true}
                    transitionEnterTimeout={150}

                    transitionLeave={true}
                    transitionLeaveTimeout={150}
                
                >
                    { this.state.display && <div className="shutter" style={{width:"100%",height:"100%"}} ></div> }
                </ReactCSSTransitionGroup>
            </div>

        )


    }
}

Shutter.defaultProps = {
    style : {},
    display : false
}