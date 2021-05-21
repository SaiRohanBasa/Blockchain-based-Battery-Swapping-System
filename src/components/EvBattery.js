import React, { Component } from 'react';
import {browserHistory} from "react-router";
import User from "./User"
import Table from 'react-bootstrap/Table';
import "./css/swapreq.css"

class EvBattery extends Component{
    state={
        accounts:null,
        contract:null,
        id:0,
        year:0,
        capacity:0,
        soc:0,
        soh:0
    }
    componentDidMount=async()=>{
        this.setState({accounts: this.props.accounts, contract: this.props.contract});
    }
    componentDidUpdate=async()=>{
        
        if(this.state.contract && this.state.accounts){
            const t=await this.state.contract.methods.EV(this.state.accounts[0]).call();
            const idd=t.idx;
            const bat=await this.state.contract.methods.battery(idd).call()
            this.setState({id:idd,year:bat.year,capacity:bat.capacity,soc:bat.soc,soh:bat.soh});
            //console.log(this.state.accounts[0]);
            //console.log(idd);
        }
    }
    render(){
        return (
            <div id="main">
                <div id="container">
                <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Battery ID</th>
                                        <th>Capacity</th>
                                        <th>Year</th>
                                        <th>Current SOH value</th>
                                        <th>State of charge</th>
                                        <th>Discharge</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{this.state.id}</td>
                                        <td>{this.state.capacity}</td>
                                        <td>{this.state.year}</td>
                                        <td>{this.state.soh}</td>
                                        <td>{this.state.soc}</td>
                                        <td>
                                        <button onClick={async ()=>{
                                            await this.state.contract.methods.dischargeBattery(this.state.id,this.state.accounts[0]).send({ from: this.state.accounts[0] }, () => {
                                            window.confirm("Battery Discharged!");
                                            //browserHistory.push("/evowner");
                                            window.location.reload();
                                        });
                                        }}>Discharge Battery</button>
                                        </td>
                                        <td>
                                        <button onClick={async ()=>{
                                            await this.state.contract.methods.deleteBattery(this.state.id,this.state.accounts[0]).send({ from: this.state.accounts[0] }, () => {
                                            window.confirm("Battery Deleted!");
                                            browserHistory.push("/evowner");
                                            window.location.reload();
                                        });
                                        }}>Delete Battery</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
                </div>
                </div>
        );
    }
}

export default EvBattery;