import React, { Component } from 'react';
import {browserHistory} from "react-router";
import User from "./User"
import Table from 'react-bootstrap/Table';
import "./css/swapreq.css"

class SwapBattery extends Component{
    state = {
        accounts: null,
        contract: null,
        pending:[],
        trail:0,
        status:0
    };

    componentDidMount = async () => {
        this.setState({accounts: this.props.accounts,contract: this.props.contract,trail:1});  
        
    };
    componentDidUpdate = async () => {
        if(this.state.contract && this.state.trail)
        {
            const t=await this.state.contract.methods.statList().call();
            const count=await this.state.contract.methods.statCount().call();
            const tempArr=[];
            for(var i=0;i<count;i++)
            {
                let cs=await this.state.contract.methods.CS(t[i]).call();
                let oo=[cs.name,cs.addres,cs.i,1,t[i]]
                tempArr.push(oo);
            }
        
            this.setState({...this.state.pending,pending: tempArr,trail:0});
        }
    }
    swap = async (event)=>{
        event.preventDefault();
        await this.state.contract.methods.changeStatus().call();
        window.location.reload();
    }
    renderTable = ()=>{       
            
            return this.state.pending.map(value => (
                <tr>
                  <td>{value[0]}</td>
                  <td>{value[1]}</td>
                  <td>{value[2]}</td>
                  <td>
                      <button onClick={async ()=>{
                          await this.state.contract.methods.sendRequest(value[4]).send({ from: this.state.accounts[0] }, () => {
                              window.confirm("Swapping request sent! wait for confirmation");
                              browserHistory.push("/evowner");
                            window.location.reload();
                          });
                          
                      }}>Send Request</button>
                  </td>
                </tr>
            ))
    }
    render() {
        
        return (
            <div id="main">
                <div id="container">
                <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                    <div className="panel panel-default">
                        <div className="panel-body">
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name of the station</th>
                                        <th>Address of the station</th>
                                        <th>Number of batteries</th>
                                        <th>Request battery</th>
                                    </tr>
                                </thead>
                                <tbody>{this.renderTable()}</tbody>
                            </Table>
                        </div>
                    </div>
                </div>
                </div>
                </div>
        );
}
}

export default SwapBattery;