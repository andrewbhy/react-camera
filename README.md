


# react-camera

This is simple react camera component example.

The motivation behind this is that I needed a camera control in an electron app running on a windows tablet, so that users can take photos.

As such, needed to implement a camera component with optical zoom and capture functionality using react.


# Zoom 

use the zoom controls on the right side of the component ( buttons and slider ). 

# Capture photo

click on the video



# Usage

I am currently using material-ui for the slider control, so when using the Camera component, you will have to provide the muitheme

```javascript


 
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

...


render(){

  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <Camera>
  </MuiThemePRovider>

}


```


# Properties

## emulation : boolean

This will playback a sample video instead of accessing camera. 
Also, component will automatically fallback to emulation mode when initialization of camera fails

```javascript
<Camera emulation={true}>
```

## onCapture : ?Function

```javascript
function onCapture( e : Event, img : Image ){


}
```
When user clicks on the camera component, it will capture the current video and output 


example : diplay captured image 

```javascript

  render(){

  <div>
    <Camera onCapture={this.onCapture}>
    <img ref={ img=>this.previewImg = img }>
  </div>

  }
```

```javascript
  //capture handler
  const onCapture = (e,img) => {
    if(previewImg){
      previewImg.src = img
    }
  }
```
# maxScale : number

maximum zoom level.  default : 10

```javascript
<Camera maxScale={5}>

```

# scale : number

default zoom level.  default : 1
```javascript
<Camera scale={1}>
```
# style 

The style object will apply to the root container.

ex)
```javascript

<Camera  style={{marginTop:10}}/>

```

# style.height, style.width

The code currently try to get camera at 1280x720 resolution and update the height of the component based on the aspect ratio.

Width and Height are observed in the state of the component.


```javascript

<Camera style={{width:800,height:600}}  />

```






## Demo 
https://react-camera.herokuapp.com/

----

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
