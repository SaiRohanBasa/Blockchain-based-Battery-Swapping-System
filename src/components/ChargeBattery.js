import React, { Component } from 'react';
import {browserHistory} from "react-router";
import User from "./User"
import "./css/initial.css"

class ChargeBattery extends Component{
    state = {
        accounts: null,
        contract: null,
    };

    componentDidMount = async () => {
        this.setState({accounts: this.props.accounts, contract: this.props.contract});
    };

    charge = async (event) =>{
        event.preventDefault();
        const { accounts, contract } = this.state;
        var k=0;
        await contract.methods.chargeBattery(event.target.id.value,event.target.add.value,event.target.cr.value,accounts[0]).send({ from: accounts[0] }, () =>{
            window.confirm("Charging initiated! Check the status in My Batteries!");
            browserHistory.push("/csowner");
            window.location.reload();
          });
    }

    render() {
        return (
            <div className="signup-form">
                <form onSubmit = {this.charge}>
                <h2>Charge Battery</h2>
                    <div className="form-group">
                <label>Battery ID</label>
                    <input type="number" className="form-control" name="id" required="required"/>
                    </div>
                    <div className="form-group">
                <label>Current SOC of the battery</label>
                    <input type="string" className="form-control" name="add" required="required"/>
                    </div>
                    <div className="form-group">
                <label>Charging rate(in mA)</label>
                    <input type="string" className="form-control" name="cr" required="required"/>
                    </div>
                    <div className="form-group">
                            <button
                              type="submit"
                              className="btn btn-primary btn-block btn-lg"
                            >
                              Charge
                            </button>
                          </div>
                </form>
            </div>
        );
}
}

export default ChargeBattery;