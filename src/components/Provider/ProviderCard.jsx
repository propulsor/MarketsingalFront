import React, { Component } from "react";
import {Card} from "semantic-ui-react";

export class ProviderCard extends Component {
  render() {
    return (
      <Card inverted>
        <Card.Content>
            <Card.Header>{this.props.title}</Card.Header>
            <Card.Meta>Pubkey : {this.props.pubkey}</Card.Meta>
        </Card.Content>
        <Card.Content extra>
        <Card.Meta>Address : {this.props.owner}</Card.Meta>
        </Card.Content>
        </Card>
    );
  }
}

export default ProviderCard;
