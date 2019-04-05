import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import HeaderLinks from "../Header/HeaderLinks.jsx";
import {Menu, Segment} from "semantic-ui-react"
import imagine from "assets/img/sidebar-5.jpg";
import logo from "assets/img/signal.png";
import { Link } from "react-router-dom";

// import dashboardRoutes from "routes/dashboard.jsx";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      activeItem:this.props.endpoints[0]
    };
  }
  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    const sidebarBackground = {
      backgroundImage: "url(" + imagine + ")"
    };
    return (
      <div
        id="sidebar"
        className="sidebar"
        data-color="black"
        data-image={imagine}
      >
        <div className="sidebar-background" style={sidebarBackground} />
        <div className="logo">
          <a
            href="https://www.creative-tim.com"
            className="simple-text logo-mini"
          >
            <div className="logo-img">
              <img src={logo} alt="logo_image" />
            </div>
          </a>
          <a
            href="https://www.marketsignal.info"
            className="simple-text logo-normal"
          >
            Market Signal
          </a>
        </div>
        <div className="sidebar-wrapper">
            <Menu inverted vertical size='massive' borderless fluid pointingtextAlign="center" secondary className='nav'>
          <Menu.Header as='h2'content="ENDPOINTS" textAlign="center" className='nav-link'/>
            {this.props.endpoints.map((e) => {
              console.log('ahhh', e)
                return (
                  <Link to={`/${e}`}>
                    <Menu.Item name={e} active={this.state.activeItem=={e}} onClick={()=>{this.props.updateEndpoint(e)}}  className='nav-link'/>
                  </Link>
                  // <Link to='/{e}/'>{e}</Link>
                  
                );
            })}
          </Menu>
        </div>
      </div>
    );
  }
}

export default Sidebar;
