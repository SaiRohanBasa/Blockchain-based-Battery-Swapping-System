import React, { Component } from 'react';
import {browserHistory} from "react-router";
import {Container,Button} from 'reactstrap';
import "./css/s2.css"
class S2 extends Component{
    state = {
        accounts:null,
        contract: null,
        id:0,
        statAd:null,
        add:null,
        tot:0
    }
    componentDidMount = async () => {
        this.setState({accounts: this.props.accounts, contract: this.props.contract});
    }
    componentDidUpdate=async()=> {
        if(this.state.contract && this.state.accounts){
            const t=await this.state.contract.methods.EV(this.state.accounts[0]).call();
            this.setState({id:t.idx,statAd:t.csowner,add:t.addres,tot:t.balance})
        }
    }
    changeStatus = async(event) => {
        event.preventDefault();
        await this.props.contract.methods.changeStatus().send({from: this.props.accounts[0]});
        browserHistory.push("/evowner");
        window.location.reload();
    }
    render(){
        return(
            <div class="div1">
                <h2>Swapping Done!</h2>
                <div class="div2">
                    <table class="tab">
                        <tbody>
                            <tr>
                                <td>New Battery ID</td>
                                <td>{this.state.id}</td>
                            </tr>
                            <tr>
                                <td>Public add of station</td>
                                <td>{this.state.statAd}</td>
                            </tr>
                            <tr>
                                <td>Station address</td>
                                <td>{this.state.add}</td>
                            </tr>
                            <tr>
                                <td>Total Amount</td>
                                <td>Rs.{this.state.tot}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>  
                <button class="bttn bttn-group" onClick={this.changeStatus}>Done</button>           
            </div>    
        )
    }
}

export default S2;