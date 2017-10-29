import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Camera from './Camera'


let previewImg = null;

const onCapture = (e,img) => {

  if(previewImg){
    previewImg.src = img
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      <div className="App">
        <h1>react-camera</h1>
        <div style={{display:"flex", justifyContent:"center"}}>
          <Camera onCapture={onCapture} maxScale={5} style={{width:1200,height:600,marginTop:20}}/>
        </div>
        <div>
            <strong>click on the video to "capture" a screenshot</strong>
        </div>
        <div>
          <h2>Captured Image </h2> 
          <img style={{}} ref={ img => previewImg = img } />
        </div>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
