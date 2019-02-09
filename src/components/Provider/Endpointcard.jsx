import React, { Component } from "react";
import {Card} from "semantic-ui-react";

export class EndpointCard extends Component {
  render() {
    const Curve = this.props.curve.join(" ")
    return (
      <Card>
        <Card.Content>
            <Card.Header>{this.props.name}</Card.Header>
            <Card.Meta>Curve : {Curve}</Card.Meta>
        </Card.Content>
        <Card.Content extra>
        <Card.Meta> Bonded : {this.props.bonded} Issued : {this.props.issued}</Card.Meta>
        </Card.Content>
        </Card>
    );
  }
}

export default EndpointCard;
