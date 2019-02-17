import {ZapSubscriber} from "@zapjs/subscriber";
import {ZapProvider} from "@zapjs/provider";

import * as React from "react";
import {ORACLE} from "./config"
import SubscribeSteps from "./components/Tasks/Steps"
import {EndpointCard} from "./components/Provider/Endpointcard"
import InstallMetaMask from "InstallMetaMask"
import {Fetch} from "react-request"
import {
    FormGroup,
    ControlLabel,
    FormControl
} from "react-bootstrap";
import {Button,Dimmer,Loader,Grid,Segment,
  Header,Menu,Sidebar,Divider,Icon, Statistic,Input,Label,
Tab,List} from "semantic-ui-react"
import * as Web3 from "web3"

import Accounts from "./Accounts";


export default class Signal extends React.Component{
    betInfo
    state = {
        status: '',
        subscriber: ZapSubscriber,
        txid:'',
        eCurve:'',
        eBZap:0,
        eIssued:0,
        currentEndpoint:'',
        costOfDots:0,
        zapProvider:ZapProvider
    };

    constructor(props) {
        super(props);
        this.updateBlockEnd= this.updateBlockEnd.bind(this)

        if (!window.web3 && !window.ethereum) {
            return <InstallMetaMask />;

        }
        else {
            if(window.web3){
                this.web3 = new Web3(window.web3.currentProvider)
            }
            else{
                this.web3 = new Web3(window.ethereum)
                try{
                    window.ethereum.enable()
                }catch(err){
                    console.log("##FAILED TO LOAD ETHEREUM",err)
                }
            }
        }
    }
    transactionCompleted = (txid)=>{
        this.setState({txid})
        this.forceUpdate()
    }




    getStatus = async()=>{
        let accounts = await this.web3.eth.getAccounts()
        console.log("ACCOUNTS : ",accounts)
        let user = accounts[0]
        this.state.subscriber = new ZapSubscriber(
            user,{
                networkId:await this.web3.eth.net.getId(),
                networkProvider: this.web3
            }
        )
        const zapProvider = new ZapProvider(ORACLE.address,{
            networkId:await this.web3.eth.net.getId(),
            networkProvider: this.web3
        })
        let e = await zapProvider.getCurve(this.props.endpoint)
        let curve = e.values
        let eCurve=''

            for (let j=1;j<=curve[0];j++){
                if(j-1>0)
                    eCurve+=" + "
                eCurve +=this.web3.utils.fromWei(''+curve[j],"ether") + ((j-1)==0 ? "" : (j-1) ==1? "x" : ("x^" + ''+(j-1)))
            }


        let eBZap= await zapProvider.getZapBound(this.props.endpoint)
        eBZap = this.web3.utils.fromWei(eBZap,"ether")
        let eIssued= await zapProvider.getDotsIssued(this.props.endpoint)
        let allowance = await this.state.subscriber.zapToken.contract.methods.allowance(user,this.state.subscriber.zapBondage.contract._address).call()
        allowance = this.web3.utils.fromWei(allowance,"ether")
        let boundDots = await this.state.subscriber.getBoundDots({provider:ORACLE.address,endpoint:this.props.endpoint})

        let subscription = await this.state.subscriber.zapArbiter.getSubscription({provider:ORACLE.address,subscriber:user,endpoint:this.props.endpoint})
        let currentBlock = await this.web3.eth.getBlockNumber()
        let currentEndpoint= this.props.endpoint
        let costOfDots = await zapProvider.getZapRequired({endpoint:this.props.endpoint,dots:1})
        costOfDots = this.web3.utils.fromWei(costOfDots,"ether")

        let status
        if(subscription.preBlockEnd<currentBlock){
            if(boundDots==0){
                if(allowance==0){
                    status="approve"
                }
                else{
                    status="bond"
                }
            }
            else{
                status="subscribe"
            }
        }
        else{
            status="done"
        }
        return this.setState((prev,props)=>{
          return {...prev,allowance,boundDots,subscription,status,eBZap,eCurve,eIssued,
            currentEndpoint,costOfDots,zapProvider}
        })

    }

    updateBlockEnd=(remainBlocks)=>{
        this.props.updateBlockEnd(remainBlocks)
    }

    dotsEstimateChange=async (e)=>{
      let dots = e.target.value
      console.log("Dots to bond: ", dots)
      let costOfDots = await this.state.zapProvider.getZapRequired({endpoint:this.props.endpoint,dots})
      costOfDots = this.web3.utils.fromWei(costOfDots,"ether")
      this.setState({costOfDots})
    }


    render(){
        if(!this.props.endpoint){
            return(
                <div>
                    Some introduction about oracle
                </div>
            )
        }
        else{
          const info = (
              <Segment basic>
              <Segment basic>
                <Statistic.Group fluid size='tiny'>
                  <Statistic fluid color="teal">
                      <Statistic.Value>{this.state.eCurve}</Statistic.Value>
                      <Statistic.Label>Curve</Statistic.Label>
                  </Statistic>

                  <Statistic fluid color="teal"  >
                      <Statistic.Value>{this.state.eBZap}</Statistic.Value>
                      <Statistic.Label>Zaps Bonded</Statistic.Label>
                  </Statistic>
                  <Statistic fluid color="teal"  >
                      <Statistic.Value>{this.state.eIssued}</Statistic.Value>
                      <Statistic.Label>Dots Issued</Statistic.Label>
                  </Statistic>

                </Statistic.Group>
                </Segment>
                <Segment basic>
                <Input compact  placeholder="1 dots"  onChange={this.dotsEstimateChange}
                label={{basic:true, content:"Require "+this.state.costOfDots+ " ZAP"}} labelPosition="right" />
                </Segment>
                </Segment>




              )
          let ipfs=(<Segment basic><p> No .MD data provided by the oracle for this endpoint</p></Segment>)
          let params=(<Segment basic><p> No Params provided by the oracle for this endpoint</p></Segment>)
          if(this.props.endpointData[this.props.endpoint]){
            ipfs=(<Segment basic><p>{this.props.endpointData[this.props.endpoint].ipfs}</p></Segment>)
            if(this.props.endpointData[this.props.endpoint].params.length>0)
              params=(<Segment basic><p>{this.props.endpointData[this.props.endpoint].params}</p></Segment>)
          }

          const panes = [
            { menuItem: 'Info', render: () => <Tab.Pane attached={true} defaultActiveIndex >{info}</Tab.Pane> },
            { menuItem: 'IPFS ', render: () => <Tab.Pane attached={true}>{ipfs}</Tab.Pane> },
            { menuItem: 'Params ', render: () => <Tab.Pane attached={true}>{params}</Tab.Pane> },

          ]

          const tab = (<Tab fluid stretched panes={panes} />)
            if(!this.state.allowance || this.props.endpoint !=this.state.currentEndpoint){
                this.getStatus()
                return(
                        <Grid>
                        <Grid.Column >
                            <Segment>

                            </Segment>
                          <Segment>
                            <Dimmer active>
                                <Loader>Loading Wallet Info </Loader>
                            </Dimmer>
                          </Segment>
                        </Grid.Column>
                        </Grid>

                )
            }
            else{
                return(
                    <Segment>

                        <Grid attached fluid padded  columns={2} divided>
                        <Grid.Column width={8}>
                            <Divider horizontal section>
                             <Header as='h4'>
                               YOUR SUBSCRIPTION
                             </Header>
                           </Divider>
                          <SubscribeSteps
                           subscriber={this.state.subscriber}
                           endpoint={this.state.currentEndpoint}
                           web3={this.web3}
                           updateBlockEnd={this.updateBlockEnd}
                           blocks={this.props.blocks}/>

                        </Grid.Column>
                          <Grid.Column width={8} >
                            <Divider horizontal section>
                             <Header as='h3'>
                               {this.props.endpoint}
                             </Header>
                           </Divider>
                           <Grid fluid stretched padded>
                          {tab}
                          </Grid>
                          </Grid.Column>





                        </Grid>
                    </Segment>
                    //     <Divider horizontal section>
                    //      <Header as='h4'>
                    //        YOUR SUBSCRIPTION
                    //      </Header>
                    //    </Divider>
                    //    <Segment basic>
                    //    <Grid fluid padded columns={2} >
                    //    <Grid.Column width={8}>
                    //     <SubscribeSteps
                    //      subscriber={this.state.subscriber}
                    //      endpoint={this.state.currentEndpoint}
                    //      web3={this.web3}
                    //      updateBlockEnd={this.updateBlockEnd}
                    //      blocks={this.props.blocks}/>
                    //
                    //      </Grid.Column>
                    //      <Grid.Column width={8}>
                    //        <Input compact  placeholder="1 dots"  onChange={this.dotsEstimateChange}/>
                    //        <Label basic>{this.state.costOfDots} Zap Required</Label>
                    //      </Grid.Column>
                    //      </Grid>
                    //     </Segment>
                    // </Segment>

                )
            }
        }
    }

}
