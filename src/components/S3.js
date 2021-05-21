import React, { Component } from 'react';
import {browserHistory} from "react-router";
import "./css/initial.css"
class S3 extends Component{
    swapBattery = async(event) => {
        browserHistory.push("/swapbattery");
        await this.props.contract.methods.changeStatus().send({from:this.props.accounts[0]},() => {
            window.location.reload();
        }
        );
    }
    render(){
        return(
            <div>
              <center><h1>Swapping request rejected!</h1></center>
              <center><button class="btn" onClick={this.swapBattery}>Send another swapping request</button></center>
              
            </div>    
        )
    }
}

export default S3;