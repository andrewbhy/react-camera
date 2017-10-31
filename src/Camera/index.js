import throttle from "lodash/throttle"
import {ImageCapture} from "../ImageCapture"
import React, { Component } from 'react'
import Slider from 'material-ui/Slider';

import Message from './message'
import Devices from './devices'
import Shutter from './shutter'
import CaptureButton from './captureButton'

const shutterSound = new Audio("./camera-shutter-click-01.wav")
const MAX_SCALE = 10
const MIN_SCALE = 1
const ZOOM_INCREMENT = .25

const cameraControlStyle = {
    width : 150,
    backgroundColor:"black"
}




export default class Camera extends Component {



    constructor(props) {

        super(props)

        this.canvas = document.createElement('canvas')

        this.canvas2dContext = this.canvas.getContext('2d')

        this.msgSpan = null;
        this.video = null;
        this.state = {
            scale: this.validateScale(this.props.scale),
            showDevices: this.props.showDevices,
            devices: [],
            selectedDeviceId: null,
            width: this.props.style.width - cameraControlStyle.width,
            height: this.props.style.height,
            emulation: this.props.emulation,
            emulationSrc : this.props.emulationSrc,
            isCapturing: false


        } // using react state to track ui state; should stay here even after introducing redux?

        this._onCapture = throttle(this._onCapture.bind(this), 1000)
        this._onError = this._onError.bind(this)

        this.changeDevice = this.changeDevice.bind(this)
        this.zoomIn = this.zoomIn.bind(this)
        this.zoomOut = this.zoomOut.bind(this)
        this.zoomChange = this.zoomChange.bind(this)


    }


    componentWillMount() {

        // try {
        //     navigator.mediaDevices.enumerateDevices()
        //         .then(this.deviceReceived.bind(this)).catch(console.log);
        // }
        // catch (ex) {
        //     console.log(ex)
        // }
    }

    componentDidMount() {
        this.init();
    }
    componentWillReceiveProps(props) {
        if (this.video && this.video.videoHeight > 0) {
            let dimension = this.adjustAspectRatio(this.video.videoWidth, this.video.videoHeight, props.style.width)
            this.setState(dimension)
        }

    }
    componentWillMount() {
        this.getDeviceList()

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

        return (
            <div style={Object.assign({}, { position: "relative" }, this.props.style, { width: this.state.width + 200, height: this.state.height })} >

                <div style={{position:"relative",display:"flex"}}>
                    <div className="camera-container" style={cameraStyle}>

                        <div style={{ display: "flex", justifyContent: "center" }} >
                            <video style={videoStyle}
                                ref={vid => { this.video = vid }}
                                
                            />
                        </div>
                        <div style={{ position: "relative" }}>
                            {
                                this.state.showDevices && <Devices devices={this.state.devices} style={{ margin: 20 }} onClick={this.changeDevice} />
                            }
                        </div>

                        <div style={{ pointerEvents: "none", display: "flex", flexWrap: "wrap", width: "100%", height: "100%", justifyContent: "center", position: "absolute" }}>
                            <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} >
                                {this.state.emulation && <Message msg="Emulation Mode" permanent={true} />}
                                <Message msg={Math.round(this.state.scale * 100) / 100 + "X"} />
                            </div>
                        </div>
            


                        <div style={{ position: "absolute", zIndex: 10, pointerEvents: "none" }}>
                            <Shutter display={this.state.isCapturing} style={{ width: this.state.width, height: this.state.height }} />
                        </div>

                    </div>

                    <div style={ Object.assign({},cameraControlStyle,{ position:"relative", display: "flex",height:this.state.height, justifyContent: "flex-end" })} >
                            <div style={{display:"flex", flexDirection:"column", position:"relative",marginRight:30,justifyContent:"center"}}>
                                <CaptureButton onClick={this._onCapture}/>
                            </div>
                            <div style={{ display:"flex", height:"100%",position:"relative", justifyContent: "flex-end" }}>
                                <div className="zoom-control" style={{ width:20,position: "relative", display: "flex", justifyContent: "center", flexDirection: "column", marginRight: 5 }}>
                                    <button onClick={this.zoomIn}>+</button>
                                    <Slider style={{ height: sliderHeight, marginTop: 10, marginBottom: 10, display: "flex", justifyContent: "center" }} sliderStyle={{ marginTop: 0, marginBottom: 0 }} axis="y" value={sliderValue} defaultValue={sliderValue} onChange={this.zoomChange} />
                                    <button onClick={this.zoomOut}>-</button>
                                </div>
                            </div>
                    </div>
                </div>

            </div>
        )
    }


    _onCapture(e) {

        let ctx = this;

        //calculate image dimension based on scale

        let dx = (this.video.videoWidth / this.state.scale)
        let dy = (this.video.videoHeight / this.state.scale)

        let x1 = (this.video.videoWidth - dx) / 2;
        let y1 = (this.video.videoHeight - dy) / 2;

        this.canvas2dContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas2dContext.drawImage(this.video, x1, y1, dx, dy, 0, 0, this.canvas.width, this.canvas.height)

        let img = this.canvas.toDataURL('image/png');

        this.setState({ isCapturing: true }, () => {


            if (ctx.props.onCapture) {
                ctx.props.onCapture(e, img)
            }

            if ("vibrate" in navigator) {
                navigator.vibrate(100)
            }
            shutterSound.play().then(() => {
                this.setState({ isCapturing: false })
            })

        })
    }

    _onError(err){
        if(this.props.onError){
            this.props.onError(err)
        }
        else{
            console.error(err)
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

    adjustAspectRatio(videoWidth, videoHeight, width) {
        let dimension = { height: width * videoHeight / videoWidth, width }
        return dimension
    }

    setCanvasDimension(videoWidth, videoHeight, width) {
        this.canvas.width = videoWidth
        this.canvas.height = videoHeight
    }


    getDeviceList(){
        
        let deviceList = null;

        let filter = (item) => { return ( item.kind == "video" || item.kind =="videoinput");};

        if ( navigator.mediaDevices.enumerateDevices){

            navigator.mediaDevices.enumerateDevices().then( sourceList => {
                
                deviceList = sourceList || []
                
                deviceList = deviceList.filter( filter )
                                
                this.deviceReceived(deviceList) //update device list


            })
        }
        else if(MediaStreamTrack && MediaStreamTrack.getSources ) {

            
            MediaStreamTrack.getSources( (sourceList) => {
                
                deviceList = sourceList || []

                deviceList = deviceList.filter( filter )
                
                this.deviceReceived(deviceList) //update device list
            })
        }
        
       
    }
    changeDevice(sourceId) {
        
        let ctx = this;
         //override device
        if(sourceId){
            
            if( sourceId == 1 ){
                //emulation
                this.setState({emulation:true},()=>{
                    ctx.getUserMedia()
                })
            }
            else{
                this.setState({emulation:false},()=>{
                    let constraints = {
                        audio: false,
                        video : {
                            optional: [{sourceId}]
                        }
                    }
                    ctx.getUserMedia(constraints)
                })
            }
        }
    }

    

    handleStreamReceived(constraints,stream) {
        let videoTracks = null;
        let video = this.video;
        let ctx = this;

        if(stream && stream.getVideoTracks){
            videoTracks = stream.getVideoTracks();

            if(videoTracks.length > 0 && videoTracks[0].getCapabilities ){
                console.log(videoTracks[0].label)
                let capabilities = videoTracks[0].getCapabilities();

                

                if(capabilities.zoom){
                    console.log("hardware zoom supportd")
                }
                if (capabilities.focusDistance){
                    console.log("focus supportd")
                }

                if (typeof ImageCapture !== 'undefined'){
                    
                    console.log("ImageCapture supported")
                    let imageCapture = new ImageCapture(videoTracks[0])

                    let photoCapabilities = imageCapture.getPhotoCapabilities().then(c =>{

                        console.dir(c)
                        
                    })

                    if(navigator.mediaDevices.getSupportedConstraints){
                        debugger
                    
                       let c = navigator.mediaDevices.getSupportedConstraints();

                       console.dir(c)
                    }
                    
                }



            }

           

        }
        
        if( this.state.emulation ){
            //emulation?

            if(video.srcObject){

                video.srcObject.getVideoTracks().forEach(track=>track.stop())
                video.srcObject = null;
            }
           
            video.src = this.state.emulationSrc;
            video.muted = true
            if (typeof video.loop == 'boolean') {
                // loop supported
                video.loop = true;
            }
        }
        else if( stream instanceof MediaStream){
            video.src = null;
            video.srcObject = stream
        }
        else{

            //this should not reach, but just in case..
            this.setState({emulation:true})
            //emulation?
            video.srcObject = null;
            video.src = this.state.emulationSrc;
            video.muted = true
            if (typeof video.loop == 'boolean') {
                // loop supported
                video.loop = true;
            }
        }

        video.onloadedmetadata = (e) => {
            video.play();
            ctx.setCanvasDimension(video.videoWidth, video.videoHeight)
            let dimension = this.adjustAspectRatio(video.videoWidth, video.videoHeight,ctx.state.width)
            ctx.setState(dimension)
        }
        video.onabort = (e) => {
            console.log("video aborted", e)
        }
        video.onactivate = (e) => {
            console.log("video actived", e)
        }
        video.onclose = e => {
            console.log("video closed",e)
        }
        video.onerror = (e) => {
            this._onError(e)
        }

        if(stream){
            stream.oninactive = e => {
                console.log('Stream inactive',e);
            };
            stream.onactive = (e)=> {
                console.log("Stream active", e)
            }
            stream.oneded = e => {
                console.log("Stream ended",e)
            }
        }
     

      
    }


    deviceReceived(devices) {

        let deviceList = devices || []

        if(!deviceList.find(item=>{item.kind=="emulation"}) ) {
            deviceList.push(this.getEmulationDeviceInfo())
        }

        this.setState({ devices: deviceList })
    }

    
    loadDefaultDevice() {

        let constraints = {
            audio: false,
            video: { width: 1920, height: 1080, acingMode: "environment" },
  
        }
       
        this.getUserMedia(constraints)
      
    }

    getUserMedia(constraints){

        if (!constraints){
            constraints = {
                audio: false,
                video: { facingMode: "environment", width: 1920, height: 1080 }
            }
        }

        try {
            let getUserMedia = null;
            let ctx = null;

            
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                getUserMedia = navigator.mediaDevices.getUserMedia;
                ctx = navigator.mediaDevices;
            }
            else if (navigator.getUserMedia) {
                getUserMedia = navigator.getUserMedia
                ctx = navigator;
            }
            else if (navigator.webkitGetUserMedia) {
                getUserMedia = navigator.webkitGetUserMedia
                ctx = navigator
            }
            else {
                getUserMedia = this.getUserMediaEmulation;
                ctx = this
            }
            //manually set the context to wherever the function belongs to, otherwise will get illegal invcation error
            return getUserMedia.call(ctx, constraints).then(this.handleStreamReceived.bind(this,constraints)).catch(this._onError);

        }
        catch (ex) {
            this._onError(ex)
        }
    }

    getEmulationDeviceInfo (){
        return {
            id : 1,
            deviceId: 1,
            label: "emulation",
            kind : "emulation",
            emulation : true,
            selected : false
        }
    }

    getUserMediaEmulation() {

        return new Promise( (resolve,reject)=>{
            this.setState({emulation:true},()=>{

                resolve(false);//no MediaStream
            })
        })
    }

    init() {
        this.loadDefaultDevice();
    }

}

//https://toddmotto.com/react-create-class-versus-component/
Camera.defaultProps = {

    scale: 1,

    emulation: false,
    emulationSrc : null,
    showDevices: true,

    maxScale: MAX_SCALE,

    style: {
        width: 480,
        height: 360
    },

    onCapture: null,
    onError : null
};