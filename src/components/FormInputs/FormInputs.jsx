import React, { Component } from "react";
import { FormGroup, ControlLabel, FormControl, Row } from "react-bootstrap";

function FieldGroup({ label, options,...props }) {
  if(options){
    options = options.map(i=>{return <option>{i}</option>})
    return (
      <FormGroup>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} >
          {options}
        </FormControl>
      </FormGroup>
    )
  }
  else {
    return (
      <FormGroup>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
      </FormGroup>
    );
  }
}

export class FormInputs extends Component {
  render() {
    var row = [];
    for (var i = 0; i < this.props.ncols.length; i++) {
      console.log(this.props.proprieties[i])
      row.push(
        <div key={i} className={this.props.ncols[i]}>
          <FieldGroup value={this.props.parentState} {...this.props.proprieties[i]} />
        </div>
      );
    }
    return <Row>{row}</Row>;
  }
}

export default FormInputs;
