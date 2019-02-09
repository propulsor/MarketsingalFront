import React, {Component} from 'react';
import {Table} from 'semantic-ui-react';
export default class PredictionTable extends Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  getPredictionTable(){
    let pList = this.props.predictions;
    let header =
      (<Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              Prediction ID
            </Table.HeaderCell>
            <Table.HeaderCell>
              Address
            </Table.HeaderCell>
            <Table.HeaderCell>
              Details
            </Table.HeaderCell>
            <Table.HeaderCell>
              Actions
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>)
    let rows =[]
    for(let item of pList){
      rows.push(
        <Table.Row>
          <Table.Cell>
            {item.id}
          </Table.Cell>
          <Table.Cell>
            {item.address}
          </Table.Cell>
          <Table.Cell>
            {item.info}
          </Table.Cell>
          <Table.Cell>
            Take (example)
          </Table.Cell>
        </Table.Row>
      )
    }

  }
  render() {
    let pList = this.props.predictions;
    let header =
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            Prediction ID
          </Table.HeaderCell>
          <Table.HeaderCell>
            Address
          </Table.HeaderCell>
          <Table.HeaderCell>
            Details
          </Table.HeaderCell>
          <Table.HeaderCell>
            Actions
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    let rows = []
    for (let item of pList) {
      rows.push(
        <Table.Row>
          <Table.Cell>
            {item.id}
          </Table.Cell>
          <Table.Cell>
            {item.address}
          </Table.Cell>
          <Table.Cell>
            {item.info}
          </Table.Cell>
          <Table.Cell>
            Take (example)
          </Table.Cell>
        </Table.Row>
      )
    }
    return(
      <div>
      <Table celled inverted>
        {header}
        <Table.Body>
        {rows}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell>1</Table.HeaderCell>
            <Table.HeaderCell>2</Table.HeaderCell>
            <Table.HeaderCell>3</Table.HeaderCell>
            <Table.HeaderCell>4</Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
      </div>
    )
  }
}