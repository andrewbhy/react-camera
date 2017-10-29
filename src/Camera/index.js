

import React, { Component } from 'react'
import Slider from 'material-ui/Slider';

import Message from './message'
import Devices from './devices'

const shutterSound = new Audio("./camera-shutter-click-01.wav")
const MAX_SCALE = 10
const MIN_SCALE = 1
const ZOOM_INCREMENT = .25




export default class Camera extends Component {



    constructor(props) {

        super(props)

        this.canvas = document.createElement('canvas')

        this.canvas2dContext = this.canvas.getContext('2d')

        this.msgSpan = null;
        this.video = null;
        this.state = { scale: this.validateScale(this.props.scale), showDevices: this.props.showDevices, devices: [], selectedDeviceId: null, width: this.props.style.width, height: this.props.style.height, emulation: this.props.emulation } // using react state to track ui state; should stay here even after introducing redux?

        this._onCapture = this._onCapture.bind(this)
        this.zoomIn = this.zoomIn.bind(this)
        this.zoomOut = this.zoomOut.bind(this)
        this.zoomChange = this.zoomChange.bind(this)


    }


    componentWillMount() {

        navigator.mediaDevices.enumerateDevices()
            .then(this.deviceReceived.bind(this)).catch(console.log);
    }

    componentDidMount() {
        this.init();
    }

    componentWillUpdate() {


    }
    render() {

        let cameraStyle = {
            width: this.state.width,
            height: this.state.height,
            overflow: "hidden",
            display: "flex",
            position: "relative",
            backgroundColor: "black"
        }

        let videoStyle = Object.assign({}, {
            position: "absolute",
            margin: 'auto',
            top: '50%',
            left: '50%'
        }, { WebkitTransform: "translate(-50%,-50%)scale(" + this.state.scale + ")", width: this.state.width, height: this.state.height })


        let sliderValue = (this.state.scale - MIN_SCALE) / (this.props.maxScale - MIN_SCALE)
        let sliderHeight = (this.state.height - 80)

        console.log(sliderValue, this.state.scale)

        return (
            <div style={Object.assign({}, { position: "relative" }, this.props.style, { width: this.state.width, height: this.state.height })} >

                <div className="camera-container" style={cameraStyle}>

                    <div style={{ display: "flex", justifyContent: "center" }} >
                        <video style={videoStyle}
                            ref={vid => { this.video = vid }}
                            onClick={this._onCapture}
                        />
                    </div>
                    <div style={{ position: "relative" }}>
                        {
                            this.state.showDevices && <Devices devices={this.state.devices} style={{ margin: 20 }} />
                        }
                    </div>

                    <div style={{ pointerEvents: "none", display: "flex", flexWrap: "wrap", width: "100%", height: "100%", justifyContent: "center", position: "absolute" }}>
                        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} >
                            {this.state.emulation && <Message msg="Emulation Mode" permanent={true} />}
                            <Message msg={Math.round(this.state.scale * 100) / 100 + "X"} />

                        </div>

                    </div>
                    <div style={{ display: "flex", width: "100%", justifyContent: "flex-end" }} >
                        <div className="camera-control" style={{ position: "relative", display: "flex", justifyContent: "center", flexDirection: "column", marginRight: 5 }}>
                            <button onClick={this.zoomIn}>+</button>
                            <Slider style={{ height: sliderHeight, marginTop: 10, marginBottom: 10, display: "flex", justifyContent: "center" }} sliderStyle={{ marginTop: 0, marginBottom: 0 }} axis="y" value={sliderValue} defaultValue={sliderValue} onChange={this.zoomChange} />
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

        let x1 = (this.video.videoWidth - dx) / 2;
        let y1 = (this.video.videoHeight - dy) / 2;

        console.log(this.video.videoWidth, this.video.videoHeight, x1, y1, dx, dy)
        //0, 0, img.width,    img.height,     // source rectangle
        //0, 0, canvas.width, canvas.height
        this.canvas2dContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas2dContext.drawImage(this.video, x1, y1, dx, dy, 0, 0, this.canvas.width, this.canvas.height)

        let img = this.canvas.toDataURL('image/webp');
        //calculate image dimension based on scale

        shutterSound.play()
        if (this.props.onCapture) {
            this.props.onCapture(e, img)
        }

    }


    zoomIn() {
        let currentScale = this.state.scale
        let newScale = currentScale + ZOOM_INCREMENT;
        if (newScale > this.props.maxScale) {
            newScale = this.props.maxScale;
        }
        this.setState({ scale: this.validateScale(newScale) })

    }
    zoomOut() {

        let currentScale = this.state.scale
        let newScale = currentScale - ZOOM_INCREMENT;
        if (newScale < MIN_SCALE) {
            newScale = MIN_SCALE;
        }
        this.setState({ scale: this.validateScale(newScale) })
    }

    zoomChange(e, newValue) {

        let newScale = MIN_SCALE + (newValue) * (this.props.maxScale - MIN_SCALE)

        this.setState({ scale: this.validateScale(newScale) })
    }


    validateScale(scale) {
        let newScale = MIN_SCALE;

        if (scale) {
            if (scale < MIN_SCALE) {
                newScale = MIN_SCALE;
            }
            else if (scale > this.props.maxScale) {
                newScale = this.props.maxScale
            }
            else {
                newScale = scale;
            }
        }

        return newScale;
    }

    adjustAspectRatio(width, height) {

        this.setState({ height: this.state.width * height / width })
        this.canvas.width = width
        this.canvas.height = height
    }

    setupEmulation() {
        let video = this.video;
        video.src = "SampleVideo_1280x720_1mb.mp4"
        video.muted = true
        if (typeof video.loop == 'boolean') {
            // loop supported
            video.loop = true;
        }
        video.onloadedmetadata = (e) => {
            video.play();
            this.adjustAspectRatio(video.videoWidth, video.videoHeight)
        }

      

        this.setState({ selectedDeviceId: 0, enulation: true })
        this.forceUpdate()
      
    }

    deviceReceived(devices) {

        let videoDevices = devices.filter((item) => {
            return item.kind === "videoinput"
        })

        videoDevices.push({
            deviceId: 0,
            label: "Emulation"
        })

        this.setState({ devices: videoDevices })

        // for (let i = 0; i < videoDevices.length; ++i) {
        //     let deviceInfo = videoDevices[i];


        // }

    }

    changeDevice(deviceId) {

        debugger
    }


    init() {

        let video = this.video;

        if (this.state.emulation) {
            this.setupEmulation();
        }
        else {


            try {
                navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: { facingMode: "environment", width: 1920, height: 1080 }
                }).then(stream => {
                    this.stream = stream;
                    if ("srcObject" in this.video) {
                        this.video.srcObject = stream
                    }
                    else {
                        this.video.src = window.URL.createObjectURL(stream)
                    }

                    this.video.onloadedmetadata = (e) => {
                        video.play();
                        this.adjustAspectRatio(this.video.videoWidth, this.video.videoHeight)

                    }

                }).catch(err => {
                    debugger
                    this.setupEmulation();
                })
            }
            catch (ex) {
                debugger
                this.setupEmulation();
            }


        }

    }

}

//https://toddmotto.com/react-create-class-versus-component/
Camera.defaultProps = {

    scale: 1,

    emulation: false,
    showDevices: true,

    maxScale: MAX_SCALE,

    style: {
        width: 480,
        height: 360
    },

    onCapture: null
};