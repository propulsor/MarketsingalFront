import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NotificationSystem from "react-notification-system";

import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import {Dimmer,Loader,Container,Divider} from "semantic-ui-react"
import { style } from "variables/Variables.jsx";
import Signal from "Signal";
import SignalData from "components/Tasks/SignalData"
import {ORACLE} from "config"
import {ZapProvider} from "@zapjs/provider";



class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.updateEndpoint = this.updateEndpoint.bind(this)
    this.updateBlockEnd= this.updateBlockEnd.bind(this)
    this.state = {
      _notificationSystem: null,
      provider:null,
      pubkey:null,
      title:null,
      owner:null,
      endpoints:null,
      currentEndpoint:null,
      remainBlocks:0
    };


  }
  handleNotificationClick(position) {
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
  }
  componentDidMount() {
    this.setState({ _notificationSystem: this.refs.notificationSystem });
    var _notificationSystem = this.refs.notificationSystem;
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
  }


  getToken = async()=>{
      let token = await this.props.web3.eth.personal.sign(ORACLE.endpoint,this.props.user)
      console.log("TOKEN : ",token)
      this.setState({token})
  }
  getProviderAsync = async()=>{
    let title;
    let curve
    let pubkey = {}
    const owner = ORACLE.address
    const provider = new ZapProvider(owner,{
      networkId:await this.props.web3.eth.net.getId(),
      networkProvider: this.props.web3
    })

    title = await provider.getTitle()
    pubkey = await provider.getPubkey()
    let endpoints = await provider.zapRegistry.getProviderEndpoints(owner)
    let currentEndpoint = endpoints[0]
    console.log("ENdpoints :" ,endpoints)
    return this.setState((prev,props)=>{
    return {...prev,provider,pubkey,title,owner,endpoints,currentEndpoint}
    })

  }

  updateEndpoint=(e)=>{
      console.log("UPDATE ENDPOINT",e)
      return this.setState((prev,props)=>{
          return {...prev,currentEndpoint:e}
      })
  }

  updateBlockEnd = (remainBlocks)=>{
      this.setState({remainBlocks})
  }


  render() {
      console.log("CURRENT ENDPOINT : ", this.state.currentEndpoint)
     if(!this.state.provider){
         this.getProviderAsync()
         return(
             <Dimmer>
             <Loader>Loading Oracle Info... </Loader>
             </Dimmer>
         )
     }
     else{
         if(this.remainBlocks>0){
             this.getToken()
             return (
                 <Dimmer>
                 <Loader>Signing to websocket auth... </Loader>
                 </Dimmer>
             )
         }
         else{
            return (
              <div className="wrapper">
                {/*<NotificationSystem ref="notificationSystem" style={style} />*/}
                <Sidebar {...this.props} endpoints={this.state.endpoints} updateEndpoint={this.updateEndpoint}/>
                <div id="main-panel" className="main-panel" ref="mainPanel">
                  <Header title={this.state.title} pubkey={this.state.pubkey} address={this.state.owner}  />
                 <Signal endpoint={this.state.currentEndpoint} web3={this.props.web3} updateBlockEnd={this.updateBlockEnd}/>
                 <Divider hidden section />
                 <SignalData web3={this.props.web3} user={this.state.owner} token={this.state.token} blocks={this.remainBlocks}/>
                </div>
              </div>
            );
        }
    }
  }
}

export default Dashboard;