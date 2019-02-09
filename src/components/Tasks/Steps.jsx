import React,{Component} from 'react'
import { Item, Button, Popup, Input, Statistic,Segment, Grid} from 'semantic-ui-react'
import {ORACLE} from "../../config"
import {ZapSubscriber} from  "@zapjs/subscriber"

export class SubscribeItems  extends Component {

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
        lastBlockEnd:0
    };
    constructor(props) {
        super(props);
        this.props.web3.eth.subscribe("newBlockHeaders",this.updateBlock)
        this.props.subscriber.zapBondage.listenBound({provider:ORACLE.address,subscriber:this.props.subscriber.subscriberOwner,endpoint:this.props.endpoint},this.bondedChange)
        this.props.subscriber.zapArbiter.listenDataPurchase({
            provider:ORACLE.address,subscriber:this.props.subscriber.subscriberOwner,endpoint:this.props.endpoint
        },this.subscribeChange)
        this.props.subscriber.zapArbiter.listenSubscriptionEnd({
            provider:ORACLE.address,subscriber:this.props.subscriber.subscriberOwner,endpoint:this.props.endpoint
        },this.subscribeChange)
        this.inputChange=  this.inputChange.bind(this)
        this.endBlock=this.props.subscription.preBlockEnd
        this.updateBondInfo()
        this.updateSubInfo()

    }

    updateBlock=(err,data)=>{
        if(data){
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
        this.setState({bonded,escrow})
    }

    updateSubInfo = async()=>{
        let sub = await this.props.subscriber.zapArbiter.getSubscription({provider:ORACLE.address,endpoint:this.props.endpoint,subscriber:this.props.subscriber.subscriberOwner})
        console.log(sub)
        let remainBlocks = this.state.currentBlock- sub.preBlockEnd
        this.props.updateBlockEnd(remainBlocks)
        this.setState({endBlock:sub.preBlockEnd,lastBlockEnd:sub.preBlockEnd})
    }

    approveZap=async()=>{
        if(this.state.approveAmount>0){
            let tx = await this.props.subscriber.approveToBond({provider:ORACLE.address,zapNum:this.props.web3.utils.toWei(this.state.approveAmount,"ether")})
            let txid=tx.txHash
            return this.setState((prev,prop)=>{
                return {...prev,approveAmount:0}
            })
        }
    }
    bondDots = async()=>{
        if(this.state.bondAmount>0){
            let tx = await this.props.subscriber.bond({provider:ORACLE.address,endpoint:this.props.endpoint,dots:this.state.bondAmount})
            return this.setState((prev,prop)=>{
                return {...prev,bondAmount:0}
            })
        }
    }

    unBond = async()=>{
        if(this.state.bondAmount>0){
            let tx = await this.props.subscriber.unBond({provider:ORACLE.address,endpoint:this.props.endpoint,dots:this.state.bondAmount})
            return this.setState((prev,prop)=>{
                return {...prev,bondAmount:0}
            })
        }
    }


    subscribeBlock=async()=>{
        if(this.state.subscribeAmount>0){
            // let dots = await this.props.subscriber.zapArbiter.contract.methods.endSubscriptionSubscriber(ORACLE.address,this.props.web3.utils.toHex(this.props.endpoint)).send({from:this.props.subscriber.subscriberOwner,gas:6000000})
            // console.log("DOTS ",dots)
            console.log({provider:ORACLE.address,endpoint:this.props.endpoint,endpointParams:[],dots:this.state.subscribeAmount},this.props.subscriber.subscriberOwner)
            let tx=await this.props.subscriber.subscribe({provider:ORACLE.address,endpoint:this.props.endpoint,endpointParams:[],dots:this.state.subscribeAmount})
            return this.setState((prev,prop)=>{
                return {...prev,subscribeAmount:0}
            })
        }
    }

    unSubscribe=async()=>{
        if(this.state.escrow>0){
            // let dots = await this.props.subscriber.zapArbiter.contract.methods.endSubscriptionSubscriber(ORACLE.address,this.props.web3.utils.toHex(this.props.endpoint)).send({from:this.props.subscriber.subscriberOwner,gas:6000000})
            // console.log("DOTS ",dots)
            let tx=await this.props.subscriber.zapArbiter.endSubscriptionSubscriber({provider:ORACLE.address,endpoint:this.props.endpoint,endpointParams:[],from:this.props.subscriber.subscriberOwner})
            return this.setState((prev,prop)=>{
                return {...prev,subscribeAmount:0}
            })
        }
    }

    inputChange(event){
        this.setState({[event.target.name]:event.target.value})
    }

    render(){

        let remainBlock=0
        if(this.state.currentBlock>0){
            let remainBlock = this.state.endBlock - this.state.currentBlock
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
