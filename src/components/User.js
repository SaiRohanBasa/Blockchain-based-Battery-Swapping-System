import React, { Component } from 'react';
import {browserHistory} from "react-router";
import "./css/initial.css"

class User extends Component {

    state = {
        accounts: null,
        contract: null
    };

    componentDidMount = async () => {
        this.setState({accounts: this.props.accounts, contract: this.props.contract});
    };

    handleSetAdmin = async (event) => {
        event.preventDefault();
    
        const { accounts, contract } = this.state;
        var k=0;
        if( window.confirm("Register Battery?")){
          await contract.methods.registerBattery(event.target.id.value, event.target.year.value,event.target.capacity.value).send({ from: accounts[0] }, () =>{
           k=1;
        });
        }
        if(k==1)
        {
            if(await contract.methods.userExists(accounts[0]).call())
            browserHistory.push("/evowner");
            else
            browserHistory.push("/csowner");
            window.location.reload();
        }
        else
        window.location.reload();
    }

    render() {
        return (
            <div className="signup-form">
                <form onSubmit = {this.handleSetAdmin}>
                <h2>Register Battery</h2>
                    <div className="form-group">
                <label>ID</label>
                    <input type="text" className="form-control" name="id" required="required"/>
                    </div>
                    <div className="form-group">
                <label>Year</label>
                    <input type="text" className="form-control" name="year" required="required"/>
                    </div>
                    <div className="form-group">
                <label>Capacity(in kWh)</label>
                    <input type="text" className="form-control" name="capacity" required="required"/>
                    </div>
                    <div className="form-group">
                            <button
                              type="submit"
                              className="btn btn-primary btn-block btn-lg"
                            >
                              Register
                            </button>
                          </div>
                </form>
            </div>
        );
  }
}

export default User;