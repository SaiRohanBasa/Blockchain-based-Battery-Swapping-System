import React, { Component } from 'react';
import {browserHistory} from "react-router";
import {Container,Button} from 'reactstrap';
import "./css/evowner.css"
class Evowner extends Component{
    state = {
        accounts: null,
        contract: null,
        soc:0
    };

    componentDidMount = async () => {
        this.setState({accounts: this.props.accounts, contract: this.props.contract});
    };

    componentDidUpdate=async()=> {
        if(this.state.contract && this.state.accounts){
            const t=await this.state.contract.methods.EV(this.state.accounts[0]).call();
            const idd=await this.state.contract.methods.battery(t.idx).call();
            this.setState({soc:idd.soc});
        }
    }
    registerBattery = async (event) => {
        event.preventDefault();
        const t=await this.state.contract.methods.EV(this.state.accounts[0]).call();
        if(t.idx!=0){
            window.confirm("You have already registered a battery.. please delete that one to register a new one!!");
            return;
        }
        const { accounts, contract } = this.state;
            browserHistory.push("/user");
            window.location.reload();
    }
    myBattery = async (event) => {
        event.preventDefault();
        const { accounts, contract } = this.state;
            browserHistory.push("/evbattery");
            window.location.reload();
    }
    swapBattery = async(event) => {
        event.preventDefault();
        const t=await this.state.contract.methods.EV(this.state.accounts[0]).call();
        if(t.idx==0){
            window.confirm("You need to register battery to send swapping request");
            return;
        }
        const {accounts,contract} = this.state;
        //const k=await contract.methods.sendStatus(accounts[0]).call();
        const k=t.reqStatus;
        console.log(k);
        if(k==4){
            if(this.state.soc==0)
            browserHistory.push("/swapbattery");
            else{
                window.confirm("You cannot send swapping request as your battery is not discharged..");
            }
        }
        else if(k==1)
        browserHistory.push("/s1");
        else if(k==2)
        browserHistory.push("/s2");
        else if(k==3)
        browserHistory.push("/s3");
        window.location.reload();
    }
    render(){
        return(
            <div class="btn-group">
                <button class="btn" onClick={this.swapBattery}>Send a swapping request</button><br/>
                <button class="btn" onClick={this.registerBattery}>Register battery</button><br/>
                <button class="btn" onClick={this.myBattery}>My battery</button><br/>
            </div>    
        )
    }
}

export default Evowner;