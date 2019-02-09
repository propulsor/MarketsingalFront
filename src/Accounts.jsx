import * as _ from 'lodash';
import * as React from 'react';
import {debuglog} from "util";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "reactstrap";
import {WalletCard} from "./components/Wallet/WalletCard";
import {Col} from "react-bootstrap";
import {toBN} from 'web3-utils'
import {ZapToken} from '@zapjs/zaptoken'

export default class Accounts extends React.Component{
    state = { account: '', balances: {} };
    // private _pollingIntervalId: any;
    constructor(props) {
        super(props);


        // Poll for the account details and keep it refreshed
        // this._pollingIntervalId = setInterval(() => {
        //     this.fetchAccountDetailsAsync();
        // }, 3000);
    }

    fetchAccountDetailsAsync = async () => {
      let web3 = this.props.web3
      this.zapToken = new ZapToken({
        networkProvider: this.props.web3,
        networkId:await this.props.web3.eth.net.getId()
      })
        const addresses = await this.props.web3.eth.getAccounts()
        const account = addresses[0]
        const balances  = {};
        try {
          let ethBalances=await this.props.web3.eth.getBalance(account, "latest")
          let zapBalance = await this.zapToken.balanceOf(account)
            balances['ETH'] = parseFloat(ethBalances)/1e18
            balances['ZAP'] =parseFloat(zapBalance)/1e18
        } catch (e) {
            //debuglog(e)
          balances['ETH'] = 0
          balances['ZAP'] =0
        }
        // Update the state in React
        this.setState((prev, props) => {
            return {...prev, balances, account};
        });
    };

    render() {
      if(!this.state.balances['ETH']) {
        this.fetchAccountDetailsAsync()
      }
        const balances = this.state.balances
        if (Object.keys(balances).length>0) {
            return (
                  <WalletCard
                    address={this.state.account}
                    balances={this.state.balances}
                  />
            );
        } else {
            return (
                <div>
                   <p>Fetching balances ....</p>
                </div>
            );
        }
    }
}
