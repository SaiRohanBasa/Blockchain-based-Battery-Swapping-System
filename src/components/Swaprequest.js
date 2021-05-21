import React, { Component } from 'react';
import {browserHistory} from "react-router";
import {Container,Button, Table} from 'reactstrap';
import "./css/swapreq.css"
class Swaprequest extends Component{
    state = {
        accounts: null,
        contract: null,
        pending:[],
        trail:0
    };
    componentDidMount = async () => {
        this.setState({accounts: this.props.accounts, contract: this.props.contract,trail:1});
    };
    componentDidUpdate = async () => {
        if(this.state.contract && this.state.trail)
        {
            var t=[];
            t=await this.state.contract.methods.reqList(this.state.accounts[0]).call();
            
            const count=await this.state.contract.methods.reqCount(this.state.accounts[0]).call();
            console.log(count);
            const tempArr=[];
            console.log(t);
            for(var i=0;i<count;i++)
            {
                let cs=await this.state.contract.methods.battery(t[i]).call();
                let oo=[t[i],cs.capacity,cs.soh,cs.owner];
                tempArr.push(oo);
            }
        
            this.setState({...this.state.pending,pending: tempArr,trail:0});
        }
    }

    swapBat = async (event) =>{
        event.preventDefault();
        const { accounts, contract } = this.state;
        await contract.methods.swapping().send({ from: this.props.accounts[0]}, () =>{
            window.confirm("Swapping successful!!");
            window.location.reload();
          });
    }

    renderTable =()=> {
        return this.state.pending.map(value=>(
            <tr>
                <td>{value[0]}</td>
                <td>{value[1]}</td>
                <td>{value[2]}</td>
                <td>{value[3]}</td>
            </tr>
        )

        )
    }
    render(){
        return(
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
                                        <th>SOH</th>
                                        <th>Owner address</th>
                                    </tr>
                                </thead>
                                <tbody>{this.renderTable()}</tbody>
                            </Table>
                        </div>
                        <div class="wrapper">
                            <button onClick={this.swapBat}>Start Swapping</button>
                        </div>
                        
                    </div>
                </div>
                </div>
            </div>
        )
    }
}
export default Swaprequest;