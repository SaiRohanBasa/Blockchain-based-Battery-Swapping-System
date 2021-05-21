import React, { Component } from 'react';
import {browserHistory} from "react-router";
import User from "./User"
import "./css/initial.css"

class DischargeBattery extends Component{
    state = {
        accounts: null,
        contract: null,
    };

    componentDidMount = async () => {
        this.setState({accounts: this.props.accounts, contract: this.props.contract});
    };

    discharge = async (event) =>{
        event.preventDefault();
        const { accounts, contract } = this.state;
        const bat = await contract.methods.dischargeBattery(event.target.id.value,event.target.add.value).call();
        console.log(bat)
        if(bat==true)
        {
            window.confirm("Battery discharged");
            browserHistory.push("/evowner");
            window.location.reload();
        }
        else
        window.confirm("Please enter correct details");
    }

    render() {
        return (
            <div className="signup-form">
                <form onSubmit = {this.discharge}>
                <h2>Discharge Battery</h2>
                    <div className="form-group">
                <label>Battery ID</label>
                    <input type="number" className="form-control" name="id" required="required"/>
                    </div>
                    <div className="form-group">
                <label>User Address</label>
                    <input type="string" className="form-control" name="add" required="required"/>
                    </div>
                    <div className="form-group">
                            <button
                              type="submit"
                              className="btn btn-primary btn-block btn-lg"
                            >
                              Discharge
                            </button>
                          </div>
                </form>
            </div>
        );
}
}

export default DischargeBattery;