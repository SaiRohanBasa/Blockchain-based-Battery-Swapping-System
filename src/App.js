import React, { Component } from "react";
import {render} from "react-dom";
import {browserHistory} from "react-router";
import {BrowserRouter,Switch , Route} from "react-router-dom";
import BatterySwap from "./contracts/BatterySwap.json";
import getWeb3 from "./getWeb3";
import InitialPage from "./components/InitialPage"
import User from "./components/User"
import Evowner from "./components/Evowner"
import Csowner from "./components/Csowner"
import DischargeBattery from "./components/DischargeBattery"
import ChargeBattery from "./components/ChargeBattery"
import DeleteBattery from "./components/DeleteBattery"
import MyBattery from "./components/MyBattery"
import SwapBattery from "./components/SwapBattery"
import Swaprequest from "./components/Swaprequest"
import EvBattery from "./components/EvBattery"
import S1 from "./components/S1"
import S2 from "./components/S2"
import S3 from "./components/S3"

class App extends Component{
  state = {
    web3: null, 
    accounts: null, 
    contract: null,
    deployedNetwork: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BatterySwap.networks[networkId];
      const instance = new web3.eth.Contract(
        BatterySwap.abi,
        deployedNetwork && deployedNetwork.address
      );
      //console.log(instance)
      await this.setState({ web3, accounts, contract: instance, deployedNetwork: networkId});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  render() {
    if(this.state.contract!=null){
    return (
       <BrowserRouter history={browserHistory}>
         <Switch>
         <Route path="/" exact component={()=><InitialPage accounts = {this.state.accounts} contract = {this.state.contract}/>}/>
         <Route path="/user" exact component={()=><User accounts = {this.state.accounts} contract = {this.state.contract}/>}/>
         <Route path="/evowner" exact component={()=><Evowner accounts = {this.state.accounts} contract = {this.state.contract}/>}/>
         <Route path="/csowner" exact component={()=><Csowner accounts = {this.state.accounts} contract = {this.state.contract}/>}/>
         <Route path="/discharge" exact component={()=><DischargeBattery accounts = {this.state.accounts} contract = {this.state.contract}/>}/>
         <Route path="/charge" exact component={()=><ChargeBattery accounts = {this.state.accounts} contract = {this.state.contract}/>}/>
         <Route path="/delete" exact component={()=><DeleteBattery accounts = {this.state.accounts} contract = {this.state.contract}/>}/>
         <Route path="/mybattery" exact component={()=><MyBattery accounts = {this.state.accounts} contract = {this.state.contract}/>}/>
         <Route path="/evbattery" exact component={()=><EvBattery accounts = {this.state.accounts} contract = {this.state.contract}/>}/>
         <Route path="/swapbattery" exact component={()=><SwapBattery accounts = {this.state.accounts} contract = {this.state.contract}/>}/>
         <Route path="/swaprequest" exact component={()=><Swaprequest accounts = {this.state.accounts} contract = {this.state.contract}/>}/>
         <Route path="/s1" exact component={()=><S1 accounts = {this.state.accounts} contract = {this.state.contract}/>}/>
         <Route path="/s2" exact component={()=><S2 accounts = {this.state.accounts} contract = {this.state.contract}/>}/>
         <Route path="/s3" exact component={()=><S3 accounts = {this.state.accounts} contract = {this.state.contract}/>}/>
         </Switch>
       </BrowserRouter>
    );
    }
    else{
      return(
        <div></div>
      );
    }
  }
}

export default App;

