import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Camera from './Camera'
import {version} from '../package.json'

let previewImg = null;

const onCapture = (e,img) => {

  if(previewImg){
    previewImg.src = img
  }
}



class App extends Component {

  constructor(props){
    super(props)
    this.state = {

      width : 1200,
      height: 800
    }

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  componentWillMount(){
    this.updateWindowDimensions();
  }
  componentWillUnmount(){

    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions(){


    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      <div className="App">
        <h1>react-camera</h1> 
        v {version}
        <div style={{display:"flex", justifyContent:"center"}}>
          <Camera onCapture={onCapture}  emulation={false} scale={2} maxScale={5} style={{width:this.state.width - 50,height:this.state.height,marginTop:20}}/>
        </div>
        <div>
            <strong>click on the video to "capture" a screenshot</strong>
        </div>
        <div>
          <h2>Captured Image </h2> 
          <img style={{}} ref={ img => previewImg = img } />
        </div>

        <div>
          <h2>Debug</h2>
          <div> navigator.mediaDevices.getUserMedia ( recommended ): { navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia  ? "true":"false"}</div>
          <div> navigator.getUserMedia (deprecated ) : { navigator && navigator.getUserMedia  ? "true":"false"}</div>
          <div> navigator.webkitGetUserMedia ( experimental ver ): { navigator && navigator.webkitGetUserMedia  ? "true":"false"}</div>

          <div> navigator.mediaDevices.enumerateDevice : { navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevice  ? "true":"false"}</div>
          
          <div>MediaStreamTrack : {MediaStreamTrack ? "true" : "false" }</div>

          <div>navigator.vibrate : {navigator.vibrate ? "true":"false"} </div>

        </div>

      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
