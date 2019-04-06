import React, { Component } from "react";
import { Switch, Redirect, BrowserRouter as Router, Route, Link } from "react-router-dom";
import NotificationSystem from "react-notification-system";

import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import {Dimmer,Loader,Divider} from "semantic-ui-react"
import { style } from "variables/Variables.jsx";
import Signal from "Signal";
import SignalData from "components/Tasks/SignalData"
import {ORACLE} from "config"
import {ZapProvider} from "@zapjs/provider";
import InstallMetaMask from "InstallMetaMask"
import * as rp from "request-promise"
import { Row, Col } from 'react-bootstrap'


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.updateEndpoint = this.updateEndpoint.bind(this)
    this.updateBlockEnd= this.updateBlockEnd.bind(this)
    this.getSignal = this.getSignal.bind(this)
    this.state = {
      _notificationSystem: null,
      provider:null,
      pubkey:null,
      title:null,
      user:null,
      endpoints:null,
      currentEndpoint:null,
      remainBlocks:0,
      token:null,
      endpointTokens:{},
      metaMaskUnlocked:true,
      endpointData:{}
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

      let token = await this.props.web3.eth.personal.sign(this.state.currentEndpoint,this.state.user)
      console.log(token)
      let endpointTokens = this.state.endpointTokens
      endpointTokens[this.state.currentEndpoint]=token
      this.setState({token,endpointTokens})
  }
  getProviderAsync = async()=>{
    let title;
    let curve
    let pubkey = {}
    let addresses = await this.props.web3.eth.getAccounts()
    let user = addresses[0]
    if(!user)
        return this.setState({metaMaskUnlocked:false})
    else{
        const provider = new ZapProvider(ORACLE.address,{
          networkId:await this.props.web3.eth.net.getId(),
          networkProvider: this.props.web3
        })

        title = await provider.getTitle()
        pubkey = await provider.getPubkey()
        let endpoints = await provider.zapRegistry.getProviderEndpoints(ORACLE.address)
        let currentEndpoint = endpoints[0]
        console.log("ENdpoints :" ,endpoints)
        let ipfs={}, endpointData={}
        let providerParams = await provider.getAllProviderParams()
        if(providerParams.length>0){
          for(let key of providerParams){
            key= this.props.web3.utils.hexToUtf8(key)
            let value = await provider.getProviderParam(key)
            value=  this.props.web3.utils.hexToUtf8(value)
            if(key.includes(".md")){
              let endpoint = key.slice(0,-3)
              if(!endpointData[endpoint])
                endpointData[endpoint]={}
              endpointData[endpoint].ipfs = await rp(value)
            }
          }
        }

        let params= []
        for(let endpoint of endpoints){
          let endpointParams = await provider.getEndpointParams(endpoint)

          console.log('endpoint', endpoint)
          console.log('endpointParams', endpointParams)

          if(endpoint.toLowerCase()=="bittrex"){
            continue
          }

          for(let item of endpointParams)
            params.push(this.props.web3.utils.hexToUtf8(item))

          endpointData[endpoint].params=params
        }
        return this.setState((prev,props)=>{
        return {...prev,provider,pubkey,title,endpoints,currentEndpoint,user,endpointData}
        })
    }

  }

  updateEndpoint=(e)=>{
      console.log("UPDATE ENDPOINT",e)
      return this.setState((prev,props)=>{
          return {...prev,currentEndpoint:e}
      })
  }

  updateBlockEnd = (remainBlocks)=>{
      console.log("remain block",remainBlocks)
      this.setState({remainBlocks})
  }

  About() {
    return <h2 className='menu-item'>About</h2>
  }
  
  HowTo() {
      return <h2 className='menu-item'>How To</h2>
    }

  getSignal() {
    return <div id="main-panel" className="" >
                        <Signal endpoint={this.state.currentEndpoint} web3={this.props.web3} updateBlockEnd={this.updateBlockEnd} blocks={this.state.remainBlocks} endpointData={this.state.endpointData}/>
                        <Divider hidden section />
                        <SignalData web3={this.props.web3} user={this.state.user} token={this.state.endpointTokens[this.state.currentEndpoint]} endpoint={this.state.currentEndpoint} blocks={this.state.remainBlocks} getToken={this.getToken}/>
                      </div>
  }

  render() {
      if(!this.state.metaMaskUnlocked){
          return <InstallMetaMask metamaskDetected={true} metamaskUnlocked={false}/>
      }
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

        return (
          <div className="">
            {/*<NotificationSystem ref="notificationSystem" style={style} />*/}

            <Router>
              <div>
                <div class="container-fluid">
                  <div class="row">
                    <div class="col-2">
                      <Sidebar {...this.props} endpoints={this.state.endpoints} updateEndpoint={this.updateEndpoint}/>                    
                    </div>
                    <div class="col-10">
                      <Header title={this.state.title} pubkey={this.state.pubkey} address={ORACLE.address}  />
                      <div>
                        <Route path='/' exact component={this.getSignal} />
                        <Route path='/about/' component={this.About} />
                        <Route path='/how-to/' component={this.HowTo} />
                        <Route path='/BinanceSignal/' component={this.getSignal} />
                        <Route path='/TrendSignals/' component={this.getSignal} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Router>
          </div>
        );

    }
  }
}

export default Dashboard;
