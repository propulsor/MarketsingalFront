import * as React from 'react';
import {render} from 'react-dom';
// import Accounts from './Accounts';
import Dashboard from "./layouts/Dashboard/Dashboard.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard.css?v=1.2.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import "semantic-ui-css/semantic.min.css";

import './index.css';
import InstallMetaMask from "./InstallMetaMask"
import registerServiceWorker from './registerServiceWorker';
import * as Web3 from "web3"


const App = () => {
    let web3
    // Detect if Web3 is found, if not, ask the user to install Metamask
    if (!window.web3 && !window.ethereum) {
        return <InstallMetaMask metamaskDetected={false}/>;

    }
    else {
        if(window.web3){
            web3 = new Web3(window.web3.currentProvider)
        }
        else{
            web3 = new Web3(window.ethereum)
            try{
                window.ethereum.enable()
            }catch(err){
                console.log("##FAILED TO LOAD WEB3 ETHEREUM",err)
            }
        }
    }
        return(

        <Dashboard web3={web3}/>
    );

};

render(<App />, document.getElementById('root')
);
registerServiceWorker();
