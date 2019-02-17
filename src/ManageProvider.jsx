import {ZapProvider} from "@zapjs/provider";
import * as React from "react";
import {oracle} from "./config";
import ProviderCard from "./components/Provider/ProviderCard.jsx";
import * as Web3 from "web3"
import {EndpointCard} from "components/Provider/Endpointcard.jsx"
import {Button,Dimmer,Loader,Grid,Segment,Header,Menu,Sidebar,Container,Dropdown} from "semantic-ui-react"
import Signal from "./Signal"
import {ORACLE} from "./config"



export default class ManageProvider extends React.Component {
  state = {
    accounts:[''],
    curve:[''],
    endpoints:{},
    init:false,
    provider:ZapProvider,
    pubkey:'',
    title:'',
    providerOwner:'',
    currentEndpoint:'',
    activeMenuItem:'',
    ipfs:{}
  }

  // private _pollingIntervalId: any;
  constructor(props){
    super(props);
    if(window.ethereum){
        this.web3 = new Web3(window.ethereum)
        try{
            window.ethereum.enable()
        }catch(err){
            console.log(err)
        }
    }
    else if(window.web3){
        this.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      alert("MetaMask not found")
    }
  }

  getProviderAsync = async()=>{
    let init=false;
    let title;
    let curve
    let pubkey, endpoints = {}
    const providerOwner = ORACLE.address
    const provider = new ZapProvider(providerOwner,{
      networkId:await this.web3.eth.net.getId(),
      networkProvider: this.web3
    })
    init = await provider.isProviderInitialized()
    if(init){
      title = await provider.getTitle()
      pubkey = await provider.getPubkey()
      let es = await provider.zapRegistry.getProviderEndpoints(providerOwner)
      for(let e of es){
        let c = await provider.getCurve(e)
        console.log(c)
        endpoints[e]={}
        endpoints[e].curve = c.values
        endpoints[e].boundZaps= await provider.getZapBound({endpoint:e})
        endpoints[e].dotsIssued= await provider.getDotsIssued({endpoint:e})
      }
      let currentEndpoint = es[0]


      let ipfs={}
      let providerParams = await provider.getAllProviderParams()
      if(providerParams.length>0){
        for(let key of providerParams){
          key= this.web3.utils.hexToUtf8(key)
          let value = await zapProvider.getProviderParam(key)
          value=  this.web3.utils.hexToUtf8(value)
          console.log("key and value", key, value, currentEndpoint+".md")
          if(key.includes(".md")){
            let endpoint = keys.slice(0,-3)
            ipfs[endpoint].ipfs = value
            let endpointParams = await provider.getEndpointParams(endpoint)
            let params= []
            for(let item of endpointParams){
              params.push(this.props.utils.hexToUtf8(item))
            }
            ipfs[endpoint].params=params
          }
        }
      }




      return this.setState((prev,props)=>{
        return {...prev,curve,init,provider,pubkey, title,providerOwner,endpoints,currentEndpoint,ipfs}
      })
    }
    else{
      return this.setState((prev,props)=>{
        return {...prev,init,provider}
      })
    }
  }

  handleMenuClick = (event)=>{
      this.setState({activeMenuItem:event.target.name,currentEndpoint:event.target.name})
  }

  render(){
    if(this.state.pubkey!=''){
      const info = this.state
      const{activeMenuItem} = this.state
      // const titleString =  `Owner: ${info.accounts[0]} \n Title: ${info.title} \n Endpoint: ${info.endpoint} \n Curve: ${info.curve.values}`
      let components = [<p></p>]
      let endpointsMenu = []
      Object.keys(info.endpoints).map(e=>{
        endpointsMenu.push(<Menu.Item name={e} active={activeMenuItem==={e}} onClick={this.handleMenuClick}/>)
      })
      return  (
          <div>
            <Grid relaxed>

              <Grid.Row>
              <Grid.Column width={5} stretched>
              <Segment fluid inverted>
                <Menu inverted vertical fluid pointing size="large">

                    <Menu.Item>
                        <Menu.Header> Endpoints</Menu.Header>
                        <Menu.Menu>
                            {endpointsMenu}
                        </Menu.Menu>
                    </Menu.Item>
                </Menu>
                </Segment>
              </Grid.Column >

                    <Signal endpoint={this.state.currentEndpoint} />
              </Grid.Row>
            </Grid>
          </div>
      )
    }
    else {
      this.getProviderAsync()
      return (
        <div>
            <Dimmer>
          <Loader> Loading... </Loader>
          </Dimmer>

        </div>
      )
    }
  }

}
