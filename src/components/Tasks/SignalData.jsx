import React,{Component} from 'react'
import {Message, Segment,Table,Label} from 'semantic-ui-react'
import {ORACLE} from "../../config"
import {ZapSubscriber} from  "@zapjs/subscriber"
const io= require("socket.io-client");


export class SignalData  extends Component {

    state = {
        socket:null,
        token:null,
        error:null,
        data:null,
        auth:false,
        newData:false,
        dataSet:[]

    };
    constructor(props) {
        super(props);

    }
    getUser= async()=>{
        let accounts = await this.props.web3.eth.getAccounts()
        this.state.subscriber = new ZapSubscriber(
            accounts[0],{
                networkId:await this.web3.eth.net.getId(),
                networkProvider: this.web3
            }
        )
    }
    startSocket=()=>{
        let socket = io(ORACLE.URL,{autoConnect:false})
        console.log("SOCKET", socket)
        socket.on("connect",this.authenticate)
        socket.on("authenticated",this.successAuth)
        socket.on("signaldata",this.streamData)
        socket.on("unauthorized",this.failAuth)
        socket.on("error",this.error)
        socket.on("disconnect",this.disconnectWs)
        socket.open()
        this.setState({socket})
    }


    authenticate = ()=>{
        // let token="test"
        this.state.socket.emit("authentication",{token:this.state.token,nonce:1,address:this.props.user})
    }
    error = (err)=>{
        console.log("Error connecting ", err)
        this.state.socket.close()
    }
    disconnectWs=()=>{
        this.state.socket.close()
    }

    streamData = (data)=>{
        let dataSet = this.state.dataSet
        data = data.split("|")
        let row = (<Table.Row>
            <Table.Cell>{data[0]}</Table.Cell>
            <Table.Cell>{data[1]}</Table.Cell>
            <Table.Cell>{data[2]}</Table.Cell>
            </Table.Row>
        )
        if(dataSet.length>200){
            dataSet.pop()
        }
        dataSet.unshift(row)
        this.setState({dataSet})
    }


    successAuth=(res)=>{
        this.setState({auth:true})
    }

    failAuth=()=>{
        this.setState({auth:false,data:null})
    }

    inputChange(event){
        this.setState({[event.target.name]:event.target.value})
    }

    render(){
        if(this.props.token && this.props.blocks>0 ){
            this.startSocket()
            return(
                    <Segment padded>
                    <Message>
                        <Message.Header>Socket Not connected</Message.Header>
                            <p>
                                Subscribe and connect
                            </p>
                        </Message>
                    </Segment>
            )
        }
        else{
            let error = this.state.error
            let auth = this.state.auth
            if(!auth){
                return(
                        <Segment>
                        <Message>
                            <Message.Header>Not Authenticated</Message.Header>
                                <p>
                                    Subscribe and connect
                                </p>
                            </Message>
                        </Segment>
                )
            }
            else if(error){
                return(
                        <Segment fluid raised>
                        <Message>
                            <Message.Header>Error Connecting To Data</Message.Header>
                                <p>
                                {error}
                                </p>
                            </Message>
                        </Segment>
                )
            }
            return (
                <Segment>
                <Label as='a' ribbon content={this.state.auth ? "AUTHENTICATED": "DISCONNECTED" } color={this.state.socket.connected ? "green": 'orange'}/>
                <Table compact fixed padded class="responsive" attached>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>PAIR</Table.HeaderCell>
                    <Table.HeaderCell>TREND</Table.HeaderCell>
                    <Table.HeaderCell>DATA</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.state.dataSet}
                </Table.Body>
                </Table>
                </Segment>
          );
        }
    }
}

export default SignalData
