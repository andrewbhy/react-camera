

import React, { Component } from 'react'
import Slider from 'material-ui/Slider';


const MAX_SCALE = 10
const MIN_SCALE = 1
const ZOOM_INCREMENT = .25




export default class Camera extends Component {



    constructor(props) {

        super(props)

        this.canvas = document.createElement('canvas')
       
        this.canvas2dContext = this.canvas.getContext('2d')

        this.video = null;
        this.state = { scale: 1 , width : this.props.width, height : this.props.height } // using react state to track ui state; should stay here even after introducing redux?

        this._onCapture = this._onCapture.bind(this)
        this.zoomIn = this.zoomIn.bind(this)
        this.zoomOut = this.zoomOut.bind(this)
        this.zoomChange = this.zoomChange.bind(this)
    

    }

    adjustAspectRatio(width,height){
        this.setState({height :this.state.width * height / width } )
        this.canvas.width = width
        this.canvas.height = height
    }
    init() {

        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { facingMode: "environment" ,width: this.props.captureWidth, height: this.props.captureHeight}
        }).then(stream => {
            stream = stream;
            if ("srcObject" in this.video) {
                this.video.srcObject = stream
            }
            else {
                this.video.src = window.URL.createObjectURL(stream)
            }
            let video = this.video
            this.video.onloadedmetadata = (e) => {
                video.play();
                this.adjustAspectRatio(this.video.videoWidth,this.video.videoHeight)
            }

        }).catch(err => {
            debugger
        })

    }

    componentDidMount() {
      this.init();
    }
    render() {

        let cameraStyle =  {
            width: this.state.width,
            height: this.state.height,
            overflow: "hidden",
            display: "flex",
            position: "relative",
            backgroundColor: "black",
            overflow: "hidden",
            border : "solid"
        }

        let videoStyle =  Object.assign({}, {
            position: "absolute",
            margin: 'auto',
            top: '50%',
            left: '50%'
        }, { WebkitTransform: "translate(-50%,-50%)scale(" + this.state.scale + ")" ,width:this.state.width,height:this.state.height})


        let sliderValue = (this.state.scale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)
        let sliderHeight = (this.state.height - 80)

        return (
            <div style={{ position: "relative" }} >

                <div className="camera-container" style={cameraStyle}>

                    <div style={{display:"flex", justifyContent:"center"}} >
                        <video style={videoStyle }
                            ref={vid => { this.video = vid }}
                            onClick={this._onCapture}
                        />
                    </div>
                    <div style={{ display: "flex",width:"100%", justifyContent: "flex-end" }} >
                        <div className="camera-control" style={{ position: "relative", display: "flex", justifyContent:"center", flexDirection: "column",marginRight:5 }}>
                            <button onClick={this.zoomIn}>+</button>
                            <Slider style={{ height: sliderHeight, marginTop: 10, marginBottom: 10 ,display:"flex",justifyContent:"center"}} sliderStyle={{ marginTop: 0, marginBottom: 0 }} axis="y" value={sliderValue} defaultValue={sliderValue} onChange={this.zoomChange} />
                            <button onClick={this.zoomOut}>-</button>
                        </div>
                    </div>
                </div>


            </div>
        )
    }

   
    _onCapture(e) {
        
        let dx = (this.video.videoWidth / this.state.scale)
        let dy = (this.video.videoHeight / this.state.scale)

        let x1 = (this.video.videoWidth  - dx)/2;
        let y1 = (this.video.videoHeight  - dy)/2;
        
        console.log(this.video.videoWidth,this.video.videoHeight, x1,y1,dx,dy)
        //0, 0, img.width,    img.height,     // source rectangle
        //0, 0, canvas.width, canvas.height
        this.canvas2dContext.clearRect(0, 0, this.canvas.width,this.canvas.height);
        this.canvas2dContext.drawImage(this.video,x1,y1,dx,dy,0,0,this.canvas.width,this.canvas.height)

        let img = this.canvas.toDataURL('image/webp');
        //calculate image dimension based on scale

        if ( this.props.onCapture){
            this.props.onCapture(e,img)
        }

    }

    zoomIn() {
        let currentScale = this.state.scale
        let newScale = currentScale + ZOOM_INCREMENT;
        if (newScale > MAX_SCALE) {
            newScale = MAX_SCALE;
        }
        this.setState({ scale: newScale })
    }
    zoomOut() {

        let currentScale = this.state.scale
        let newScale = currentScale - ZOOM_INCREMENT;
        if (newScale < MIN_SCALE) {
            newScale = MIN_SCALE;
        }
        this.setState({ scale: newScale })
    }

    zoomChange(e, newValue) {

        let newScale = MIN_SCALE + (newValue) * (MAX_SCALE - MIN_SCALE)

        this.setState({ scale: newScale })
    }
}

//https://toddmotto.com/react-create-class-versus-component/
Camera.defaultProps = {
    width: 480,
    height: 360,
    scale: 1,
    onCapture: null,

    captureWidth : 120*16,
    captureHeight: 120*12
};