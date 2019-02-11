import React,{Component} from 'react'
import { Item, Button, Popup, Input, Statistic,Segment, Grid,Message} from 'semantic-ui-react'
import {ORACLE} from "../../config"
import {ZapSubscriber} from  "@zapjs/subscriber"
import {ZapBondage} from "@zapjs/bondage"
import {ZapArbiter} from "@zapjs/arbiter"
import * as Web3 from "web3"
const INFURA = "wss://mainnet.infura.io/ws/v3/f55d77b1e66e4bd4adf7c89a2f77c03e"
export class SubscribeItems  extends Component {
    _isMounted=false
    state = {
        subscriber: ZapSubscriber,
        txid:'',
        currentBlock:0,
        approveAmount:0,
        bondAmount:0,
        subscribeAmount:0,
        approved:0,
        bonded:0,
        endBlock:0,
        escrow:0,
        lastBlockEnd:0,
        web3Sub:Web3,
        ethSubId:null,
        error:null
    };
    constructor(props) {
        super(props);
        this.web3Sub = new Web3(new Web3.providers.WebsocketProvider(INFURA))
        this.resetError = this.resetError.bind(this)


    }

    componentDidMount(){
        this._isMounted=true
        this.ethSubId = this.web3Sub.eth.subscribe("newBlockHeaders",this.updateBlock)
        this.web3Sub.eth.net.getId()
        .then((id)=>{
            console.log("ID ", id)
            const zapBondage = new ZapBondage({networkId:id,networkProvider:this.web3Sub})
            const zapArbiter = new ZapArbiter({networkId:id,networkProvider:this.web3Sub})
            zapBondage.listenBound({provider:ORACLE.address,subscriber:this.props.subscriber.subscriberOwner,endpoint:this.props.endpoint},this.bondedChange)
            zapArbiter.listenDataPurchase({
                provider:ORACLE.address,subscriber:this.props.subscriber.subscriberOwner,endpoint:this.props.endpoint
            },this.subscribeChange)
            zapArbiter.listenSubscriptionEnd({
                provider:ORACLE.address,subscriber:this.props.subscriber.subscriberOwner,endpoint:this.props.endpoint
            },this.subscribeChange)
            this.inputChange=  this.inputChange.bind(this)
            this.updateBondInfo()
            this.updateSubInfo()

        })

    }
    componentWillMount(){
        this._isMounted=false
    }
    componentWillUnmount(){
        if(this.ethSubId){
            this.ethSubId.unsubscribe()
        }
    }

    updateBlock=(err,data)=>{
        if(data && this._isMounted){
            let currentBlock=data.number
            return this.setState((prev,prop)=>{
                return {...prev,currentBlock}
            })
        }
    }
    bondedChange = (err,data)=>{
        if(data){
            this.updateBondInfo()
        }
    }
    subscribeChange = (err,data)=>{
        if(data){
            this.updateSubInfo()
        }
    }

    updateBondInfo = async()=>{
        let bonded = await this.props.subscriber.getBoundDots({provider:ORACLE.address,endpoint:this.props.endpoint})
        let escrow = await this.props.subscriber.getNumEscrow({provider:ORACLE.address,endpoint:this.props.web3.utils.toHex(this.props.endpoint)})
        let allowance = await this.props.subscriber.zapToken.contract.methods.allowance(this.props.subscriber.subscriberOwner,this.props.subscriber.zapBondage.contract._address).call()
        allowance = this.props.web3.utils.fromWei(allowance,"ether")
         if(this._isMounted)
            this.setState({bonded,escrow,allowance})
    }

    updateSubInfo = async()=>{
        let sub = await this.props.subscriber.zapArbiter.getSubscription({provider:ORACLE.address,endpoint:this.props.endpoint,subscriber:this.props.subscriber.subscriberOwner})
        console.log(sub)
        let remainBlocks = this.state.currentBlock- sub.preBlockEnd
        this.props.updateBlockEnd(remainBlocks)
        if(this._isMounted)
            this.setState({endBlock:sub.preBlockEnd,lastBlockEnd:sub.preBlockEnd})
    }

    approveZap=async()=>{
        if(this.state.approveAmount>0){
            let tx = await this.props.subscriber.approveToBond({provider:ORACLE.address,zapNum:this.props.web3.utils.toWei(this.state.approveAmount,"ether")})
            await this.updateBondInfo()
        }
    }
    bondDots = async()=>{
        if(this.state.bondAmount>0){
            try{
                let tx = await this.props.subscriber.bond({provider:ORACLE.address,endpoint:this.props.endpoint,dots:this.state.bondAmount})
                await this.updateBondInfo()
            }catch(error){
                if(this._isMounted){
                    this.setState({error})
                }
            }
        }
    }

    unBond = async()=>{
        if(this.state.bondAmount>0){
            let tx = await this.props.subscriber.unBond({provider:ORACLE.address,endpoint:this.props.endpoint,dots:this.state.bondAmount})
            await this.updateBondInfo()
        }
    }


    subscribeBlock=async()=>{
        if(this.state.escrow>0){
            this.setState({error:"Need to unsubscribe before subscribe again"})
        }
        else if(this.state.subscribeAmount>0){
            // let dots = await this.props.subscriber.zapArbiter.contract.methods.endSubscriptionSubscriber(ORACLE.address,this.props.web3.utils.toHex(this.props.endpoint)).send({from:this.props.subscriber.subscriberOwner,gas:6000000})
            // console.log("DOTS ",dots)
            console.log({provider:ORACLE.address,endpoint:this.props.endpoint,endpointParams:[],dots:this.state.subscribeAmount},this.props.subscriber.subscriberOwner)
            let tx=await this.props.subscriber.subscribe({provider:ORACLE.address,endpoint:this.props.endpoint,endpointParams:[],dots:this.state.subscribeAmount})
            await this.updateSubInfo()
        }
    }

    unSubscribe=async()=>{
        if(this.state.escrow>0){
            // console.log("DOTS ",dots)
            let tx=await this.props.subscriber.zapArbiter.endSubscriptionSubscriber({provider:ORACLE.address,endpoint:this.props.endpoint,endpointParams:[],from:this.props.subscriber.subscriberOwner})
            await this.updateSubInfo()
        }
        else{
            this.setState({error:"No escrow dots to unsusbcribe"})
        }
    }

    inputChange(event){
        this.setState({[event.target.name]:event.target.value})
    }

    resetError(){
        this.setState({error:null})
    }

    render(){

        let remainBlock=0
        let error=(<p/>)
        if(this.state.currentBlock>0){
            let remainBlock = this.state.endBlock - this.state.currentBlock
        }
        if(this.state.error){
            error = (<Message negative header="Error" content={this.state.error} onDismiss={this.resetError}/>)
        }

        return (
        <Grid  centered padded>

        <Grid.Row >
        <Item.Group>
            <Item>

                <Item.Content >

                    <Input placeholder="0" value={this.state.approveAmount} name="approveAmount" onChange={this.inputChange} label={{basic:true, content:'zap'}} lablePosition='right'/>
                    <Button onClick={this.approveZap} color="olive" >Approve</Button>
                </Item.Content>
            </Item>
            <Item>
                <Item.Content>
                    <Input placeholder="0" value={this.state.bondAmount} name="bondAmount" onChange={this.inputChange} label={{basic:true, content:'dots'}} lablePosition='right'/>
                    <Button.Group>
                    <Button onClick={this.bondDots} color="olive">Bond</Button>
                    <Button.Or/>
                    <Button onClick={this.unBond} color="orange">Unbond</Button>
                    </Button.Group>
                </Item.Content>
            </Item>
            <Item>
                <Item.Content>
                    <Input placeholder="0" value={this.state.subscribeAmount} name="subscribeAmount" onChange={this.inputChange} label={{basic:true, content:'blocks'}} lablePosition='right'/>
                    <Button.Group>
                    <Button onClick={this.subscribeBlock} color="olive">Subscribe</Button>
                    <Button.Or />
                    <Button onClick={this.unSubscribe} color="orange">UnSubscribe</Button>
                    </Button.Group>
                </Item.Content>
            </Item>
          </Item.Group>
          {error}
          </Grid.Row>
          <Grid.Row>
            <Item.Group fluid vertical >
                <Item>
                <Item.Content verticalAlign='top'>
                <Statistic.Group>
                      <Statistic size='tiny' label='Allowance' value={this.state.allowance||0}/>
                      <Statistic size='tiny' label='Bound Dots' value={this.state.bonded}/>
                      <Statistic size='tiny' label='Escrow' value={this.state.escrow}/>
                      <Statistic size='tiny' label='Remaining Blocks' value={remainBlock}/>
                      <Statistic size='tiny' label='Last Block End' value={this.state.lastBlockEnd}/>
                </Statistic.Group>
                </Item.Content>
                </Item>
                </Item.Group>
          </Grid.Row>
          </Grid>
      );
    }
}

export default SubscribeItems
