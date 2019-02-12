import React,{Component} from 'react'
import {Message, Segment,Table,Label,Button,Dimmer,Loader,Grid,Statistic,List} from 'semantic-ui-react'
import {ORACLE} from "../../config"
import {ZapSubscriber} from  "@zapjs/subscriber"
import io from "socket.io-client";


export class SignalData  extends Component {

    state = {
        socket:null,
        token:null,
        error:null,
        data:null,
        auth:false,
        newData:false,
        dataSet:[],
        token:null

    };
    constructor(props) {
        super(props);
        this.state.token=this.props.token
        this.retryClick = this.retryClick.bind(this)

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
        let socket = io(ORACLE.URL,{path:"/ws/socket.io/",secure:true})
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

    componentDidMount(){
        this.setState({token:this.props.token})
    }
    authenticate = ()=>{
        // let token="test"
        this.state.socket.emit("authentication",{token:this.props.token,nonce:1,address:this.props.user, endpoint:this.props.endpoint})
    }
    error = (err)=>{
        console.log("Error connecting ", err)
        this.state.socket.close()
    }
    disconnectWs=()=>{
        console.log("closed ws")
        this.state.socket.close()
        this.setState({auth:false})
    }

    streamData = (data)=>{
        let dataSet = this.state.dataSet
        data = data.split("|")
        let cellColor
        let changes = JSON.parse(data[2])
        if(parseFloat(changes['priceChange'])<0){
            cellColor= false
        }
        else{
            cellColor= true
        }
        let row = (<Table.Row positive={cellColor} negative={!cellColor}>
            <Table.Cell>{data[0]}</Table.Cell>
            <Table.Cell>{data[1]}</Table.Cell>
            <Table.Cell>
                {changes['priceChange']}
            </Table.Cell>
            <Table.Cell>
                {changes['tradesChange']}
            </Table.Cell>
            <Table.Cell>
                {changes['volumnChange']}
            </Table.Cell>
            </Table.Row>
        )
        if(dataSet.length>50){
            dataSet.pop()
        }
        dataSet.unshift(row)
        this.setState({dataSet})
    }

    retryClick=(e)=>{
        this.state.socket.open()
    }


    successAuth=(res)=>{
        console.log("success Auth")
        this.setState({auth:true})
    }

    failAuth=()=>{
        console.log("fail auth")
        try{
            this.state.socket.close()
        }catch(e){

        }
        this.setState({auth:false})
    }

    inputChange(event){
        this.setState({[event.target.name]:event.target.value})
    }

    render(){
        let status,button
        if(!this.props.token){
            status="Not connected"
            button = (<Button size='big' color="olive"  content="Connect" onClick={this.props.getToken} />)
        }
        else{
            if(!this.state.socket){
                this.startSocket()
                status ="Not Connected"
                button=(<Dimmer><Loader> Connecting </Loader></Dimmer>)
            }
            else{
                if(!this.state.auth){
                    status="Unauthorized, no active subscription found"
                    button = (<Button color="orange" content="Retry"  onClick={this.retryClick} />)
                }
                else{
                    status="Authenticated"
                }
            }
        }
            return (
                <Segment>
                <Grid>
                    <Grid.Column textAlign="center">
                        {button}
                    </Grid.Column>
                </Grid>

                <Table compact fixed padded class="responsive" attached>
                <Label  ribbon>{status}</Label>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>PAIR</Table.HeaderCell>
                    <Table.HeaderCell>TREND</Table.HeaderCell>
                    <Table.HeaderCell>Price %</Table.HeaderCell>
                    <Table.HeaderCell>Trades Count %</Table.HeaderCell>
                    <Table.HeaderCell>Volumn % </Table.HeaderCell>
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

export default SignalData
