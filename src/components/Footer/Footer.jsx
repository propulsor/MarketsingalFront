import React, { Component } from "react";
import { Grid } from "react-bootstrap";
import {Segment} from "semantic-ui-react"

class Footer extends Component {
  render() {
    return (
      <footer className="footer fixed-bottom">
        <Grid fluid inverted>
          <nav className="pull-left">
            <ul>
              <li>
                <a href="#pablo">Home</a>
              </li>
              <li>
                <a href="#pablo">Company</a>
              </li>
              <li>
                <a href="#pablo">Portfolio</a>
              </li>
              <li>
                <a href="#pablo">Blog</a>
              </li>
            </ul>
          </nav>
          <p className="copyright pull-right">
            &copy; {new Date().getFullYear()}{" "}
            <a href="http://www.cryptoTips.com">CryptoTips</a>, made with
            love for a better web
          </p>
        </Grid>
      </footer>
    );
  }
}

export default Footer;
