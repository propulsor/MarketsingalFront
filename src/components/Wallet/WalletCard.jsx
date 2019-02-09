import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import {Header,Segment} from "semantic-ui-react"

export class WalletCard extends Component {
  render() {
    return (
      <div className="card card-user">
        <div className="header text-center">
          <h4 className="title">
            <small className="text-center">Wallet Info</small>
          </h4>
          <hr/>
            <Segment >
              <Header as='h5'> {this.props.address}</Header>
              <Header as='h5'>
                <Header.Subheader>ETH : {this.props.balances['ETH']}</Header.Subheader>
              </Header>
              <Header as='h5'>
                <Header.Subheader>ZAP : {this.props.balances['ZAP']}</Header.Subheader>
              </Header>
            </Segment>
          <div className="footer">
            <hr />
            <div className="stats">
              {this.props.statsIcon} {this.props.statsIconText}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WalletCard;
