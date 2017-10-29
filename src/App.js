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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div style={{display:"flex", justifyContent:"center" ,alignItems:"center" ,height:1200}}>
          <Camera onCapture={onCapture} width={800} height={600}/>
        </div>
        <div>
          <img style={{}} ref={ img => previewImg = img } />
        </div>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
