import React, { Component } from 'react';
import {browserHistory} from "react-router";
import User from "./User"
import Table from 'react-bootstrap/Table';
import "./css/swapreq.css"

class MyBattery extends Component{
    state = {
        accounts: null,
        contract: null,
        pending:[],
        trail:0,
        status:0,
    };

    componentDidMount = async () => {
        this.setState({accounts: this.props.accounts,contract: this.props.contract,trail:1});  
        
    };
    componentDidUpdate = async () => {
        if(this.state.contract && this.state.trail)
        {
            const t=await this.state.contract.methods.batList(this.state.accounts[0]).call();
            const count=await this.state.contract.methods.batCount(this.state.accounts[0]).call();
            const tempArr=[];
            for(var i=0;i<count;i++)
            {
                const cs=await this.state.contract.methods.battery(t[i]).call();
                let oo=[t[i],cs.capacity,cs.year,cs.soh,cs.soc,cs.swapID,cs.price];
                tempArr.push(oo);
            }
        
            this.setState({...this.state.pending,pending: tempArr,trail:0});
        }
    }
    renderTable = ()=>{       
            
            return this.state.pending.map(value => (
                <tr>
                  <td>{value[0]}</td>
                  <td>{value[1]}</td>
                  <td>{value[2]}</td>
                  <td>{value[3]}</td>
                  <td>{value[4]}</td>
                  <td>{value[5]}</td>
                  <td>{value[6]}</td>
                  <td>
                  <button onClick={async ()=>{
                      if(value[4]!=100){
                        await this.state.contract.methods.chargeBattery(value[0],value[4],50,this.state.accounts[0]).send({ from: this.state.accounts[0] }, () => {
                            window.confirm("Battery charged!");
                            //browserHistory.push("/evowner");
                            window.location.reload();
                            });
                      }
                      else{
                          window.confirm("Battery is already charged!");
                          window.location.reload();
                      }  
                    }}>Charge Battery</button>
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
                                        <th>Battery ID</th>
                                        <th>Capacity</th>
                                        <th>Year</th>
                                        <th>Current SOH value</th>
                                        <th>Charging status</th>
                                        <th>Swapped with</th>
                                        <th>Balance</th>
                                        <th>Charge Battery</th>
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

export default MyBattery;