import React, { Component } from "react";
import { Navbar,Nav } from "react-bootstrap";
import HeaderLinks from "./HeaderLinks.jsx";
import {Modal,Button,Image,Message} from "semantic-ui-react"
import dashboardRoutes from "routes/dashboard.jsx";

class Header extends Component {
  constructor(props) {
    super(props);
    this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
    this.state = {
      sidebarExists: false
    };
  }
  mobileSidebarToggle(e) {
    if (this.state.sidebarExists === false) {
      this.setState({
        sidebarExists: true
      });
    }
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function() {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  }



  render() {
    return (
      <Navbar >
        {/* <Navbar.Header>
        <p>Pubkey : {this.props.pubkey}</p>
        <p>Address : {this.props.address}</p>

          <Navbar.Toggle onClick={this.mobileSidebarToggle} />
        </Navbar.Header> */}

        


          <HeaderLinks />
          

      </Navbar>
    );
  }
}

export default Header;
