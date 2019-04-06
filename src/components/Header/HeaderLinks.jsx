import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import zapLogo from "assets/img/zap.png"
class HeaderLinks extends Component {
  render() {
    const notification = (
      <div>
        <i className="fa fa-globe" />
        <b className="caret" />
        <span className="notification">5</span>
        <p className="hidden-lg hidden-md">Notification</p>
      </div>
    );
    return (
      <div>
        {/* <Nav>

        </Nav> */}
        <Nav pullRight>
          <NavItem eventKey={1} href="https://zap.org" target="_blank">
          <a
            href="https:/zap.org"
            className="simple-text logo-mini"
            target="_blank"
          >
            <div className="logo-img">
              <img className='shrinked' src={zapLogo} alt="logo_image" />
            </div>
          </a>
            <a>Powered by ZAP.ORG</a>
          </NavItem>


        </Nav>
      </div>
    );
  }
}

export default HeaderLinks;
