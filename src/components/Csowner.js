import React, { Component } from 'react';
import {browserHistory} from "react-router";
import {Link} from 'react-router-dom';
import {Container,Button} from 'reactstrap';
import "./css/evowner.css"
class Csowner extends Component{
    state = {
        accounts: null,
        contract: null
    };
    componentDidMount = async () => {
        this.setState({accounts: this.props.accounts, contract: this.props.contract});
    };
    swaprequest = async (event) => {
        event.preventDefault();
        browserHistory.push("/swaprequest");
        window.location.reload();
    }
    user = async (event) => {
        event.preventDefault();
        browserHistory.push("/user");
        window.location.reload();
    }
    mybattery = async (event) => {
        event.preventDefault();
        browserHistory.push("/mybattery");
        window.location.reload();
    }
    render(){
        return(
            <div class="btn-group">
                <button class="btn" onClick={this.swaprequest}><h>Swapping requests</h></button><br/>
                <button class="btn" onClick={this.user}><h>Register a new battery</h></button><br/>
                <button class="btn" onClick={this.mybattery}><h>My Batteries</h></button><br/>    
            </div>
        )
    }
}
export default Csowner;