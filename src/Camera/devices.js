

import React, { Component } from 'react'



export default class Devices extends Component{

    constructor(props){
        super(props)
    }

    componentWillReceiveProps(props){
        
    }

    handleClick(key,ctx,e){
        if(ctx.props.onClick){
            ctx.props.onClick(key)
        }
    }

    render(){
        let ctx = this;

        return (
           
            <div style={ Object.assign ({},{display:"flex", flexDirection:"row",justifyContent:"flex-start"},this.props.style)} >
            {
                
              
                this.props.devices.map(function(device){
                    
                    let name = device.label.replace(/\([0-9:a-zA-Z]*\)/,"")
                    let key = device.id || device.deviceId;

                    return <div onClick={ctx.handleClick.bind(this,key,ctx)} key={key}className={device.facingMode}style={{color:'white' ,fontSize:10,margin:10,padding:10,border:"solid" ,borderRadius:10}}>{name||"unknown device"}</div>;
                })
            }
            </div>
        )
    }

}

Devices.defaultProps = {
    devices : [],
    style : {},
    onClick : null
}