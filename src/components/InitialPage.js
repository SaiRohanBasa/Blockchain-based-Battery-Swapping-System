import React, { Component } from 'react';
import {browserHistory} from "react-router";
import User from "./User"
import getWeb3 from "./getWeb3";
import "./css/initial.css"

class InitialPage extends Component {

    state = {
        accounts: null,
        contract: null,
    };

    componentDidMount = async () => {
        const web3 = await getWeb3();
        const account = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        this.setState({accounts: this.props.accounts, contract: this.props.contract});
        //console.log('hi 5'+' '+this.props.contract+' 5');
    };

    userExist = async ()=>{
        //const { accounts, contract } = this.state;
        const contract = this.props.contract;
        const userexist = await contract.methods.userExists(this.props.accounts[0]).call();
        const csexist = await contract.methods.CSExists(this.props.accounts[0]).call();
        const batexis= await contract.methods.batExists(this.props.accounts[0]).call();
        if(userexist==true && batexis==false)
        browserHistory.push("/user");
        else if(userexist==true && batexis==true)
        browserHistory.push("/evowner");
        else if(csexist==true)
        browserHistory.push("/csowner");
        else
        window.confirm("You are not registered as a user. Please register!")
        window.location.reload();
    }
    handleSetAdmin = async (event) => {
        event.preventDefault();
    
        //const { accounts, contract } = this.state;
        const contract = this.props.contract;
        //console.log(accounts);
        if(event.target.id.value=="0" && window.confirm("Register vehicle owner?" )){
            await contract.methods.makeadmin(event.target.name.value, event.target.addres.value).send({ from: this.props.accounts[0]}, () =>{
            browserHistory.push("/user");
              window.location.reload();
          });
          }
          else if(event.target.id.value=="1" && window.confirm("Register as Station owner?")){
              await contract.methods.makeCS(event.target.name.value, event.target.addres.value).send({ from: this.props.accounts[0] }, () =>{
              browserHistory.push("/csowner");
              window.location.reload();
            });
            }
          else {
              window.location.reload();
          }
    }

    render() {
        //console.log(this.props.contract) 
            return (
                <div className="signup-form">
                    <form onSubmit = {this.handleSetAdmin}>
                    <h2>Register User</h2>
                        <div className="form-group">
                    <label>Name</label>
                        <input type="text" className="form-control" name="name" required="required"/>
                        </div>
                        <div className="form-group">
                    <label>Address</label>
                        <input type="text" className="form-control" name="addres" required="required"/>
                        </div>
                        <div className="form-group">
                    <label>Register as(0 for Vehicle Owner, 1 for Station Owner)</label>
                        <input type="text" className="form-control" name="id" required="required"/>
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
                    <button onClick={this.userExist}>Already a user?</button>
                </div>
            );
  }
}

export default InitialPage;