

import React, { Component } from 'react'
import Slider from 'material-ui/Slider';



const sliderStyles = {
    root: {
      display: 'flex',
      height: 124,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  };

export default class Camera extends Component{



    constructor(props){

        super(props)
     
        
        this.video = null;
        this.state = { scale : 1} // using react state to track ui state; should stay here even after introducing redux?

        this._onCapture = this._onCapture.bind(this)
        this.zoomIn = this.zoomIn.bind(this)
        this.zoomOut = this.zoomOut.bind(this)
        
    }

    componentDidMount(){
        navigator.mediaDevices.getUserMedia({
            audio : false,
            video : { facingMode : "environment"}
        }).then( stream => {
            if("srcObject" in this.video ){
                this.video.srcObject = stream
            }
            else{
                this.video.src = window.URL.createObjectURL(stream)
            }
            let video = this.video
            this.video.onloadedmetadata = (e)=>{
                video.play();
            }
        }).catch(err=>{
            debugger
        })
    }
    render(){

        return (
            <div  >

                <div className="camera-container" style={{ position:"relative",overflow:"hidden", backgroundColor:"red", width:this.props.width,height:this.props.height}}>
                    <video style={{ position:"absolute" ,top:0,left:0, WebkitTransform:"scale("+this.state.scale+")"}} ref={ vid=>{ this.video = vid } }>
                    
                
                    </video>
                </div>
                <Slider style={{height: 100}} axis="y" defaultValue={0.5} />
                <button onClick={this.zoomIn}>+</button>
                <button onClick={this.zoomOut}>-</button>
            </div>
        )
    }
s
    _onCapture () {

    }

    zoomIn(){
        this.setState({ scale : this.state.scale + 1})
    }
    zoomOut() {
        this.setState({scale : this.state.scale - 1})
    }
}

//https://toddmotto.com/react-create-class-versus-component/
Camera.defaultProps = {
    width : 480,
    height : 360,
    scale : 1,
    onCapture : null
};