import * as React from 'react';


export default class InstallMetamask extends React.Component{
    state = { metamaskDetected: false, metamaskUnlocked: false };
    constructor(props) {
        super(props);
    }
    render() {
        if (!this.props.metamaskDetected) {
            return (
                <div>
                    <h1> Please install Metamask </h1>
                    <a
                        href="https://metamask.io/"
                        target="_blank"
                        title="Metamask is required to use the 0x Sandbox. Click to download."
                    >
                        <img
                            src="https://github.com/MetaMask/faq/raw/master/images/download-metamask-dark.png"
                            width="200px"
                            alt="Download Metamask"
                        />
                    </a>
                    <p> Once metamask is installed, please refresh this page </p>
                </div>
            );
        }
        else if (!this.props.metamaskUnlocked) {
            return <h1>Please unlock Metamask and refresh the page</h1>;
        }
        return <h1>Please refresh the page</h1>;
    }
}
