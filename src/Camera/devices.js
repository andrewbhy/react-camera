

import React, { Component } from 'react'



export default class Devices extends Component{

    constructor(props){
        super(props)
        
       
    }

    componentWillReceiveProps(props){
        
    }

    render(){
        
        return (
        
            <div style={ Object.assign ({},{display:"flex", flexDirection:"row",justifyContent:"flex-start"},this.props.style)} >
                {
                    this.props.devices.map(function(device){
                        
                        let name = device.label.replace(/\([0-9:a-zA-Z]*\)/,"")

                        return <div title={device.label + " : " + device.deviceId}key={device.deviceId} className={device.facingMode}style={{color:'white' ,margin:10,padding:10,border:"solid" ,borderRadius:10}}>{name||"unknown device"}</div>;
                    })
                }
            </div>
        )
    }

}

Devices.defaultProps = {
    devices : [],
    style : {}
}