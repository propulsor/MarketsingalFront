import React from 'react'
import step1 from './step1.png'
import step2 from './step2.png'
import step3p0 from './step3.0.png'
import step3p1 from './step3.1.png'
import step4 from './step4.png'
import info from './info.png'
import dot from './dot.png'

import './HowTo.css'

export default function HowTo() {
    return <div className='how-to'>
        <h3>Here are the steps to subscribe to the Trend Signals endpoint data (note that the same steps applies to other API endpoints):</h3>

        <h4>1. Have Eth in your MetaMask wallet. This is for paying gas when making requests to the Ethereum Zap contract.</h4>
        <img src={step1} alt='step 1'/>
        <br></br>
        <br></br>
        <br></br>

        <h4>2. Send some Zaps into your MetaMask wallet. See the right side of this screen-shot for the amount of Zaps this demo wallet has.</h4>
        <img src={step2} alt='step 2' />

        <br></br>
        <h4>On the right side of the page there’s the information for the signal. There’s also the input field for users to put in number to determine how many Zaps they need to get a Dot. For instance, Trend Signals requires 0.01 Zap for 1 dot.</h4>
        <img src={info} alt='info' />

        <br></br>
        <br></br>
        <br></br>

        <h4>3. Approve some Zaps by filling out the number of Zaps you want. Then click on the 'Approve' buton. It'll pull up MetaMask and you can click on 'Send' to send the request to the Ethereum contract.
        </h4>
        <img src={step3p0} alt='step 3.0' />
        <br></br>
        <br></br>
        <br></br>

        <h4>4. Bond dots. This step also calls the smart contract via MetaMask so that you can get the Dots, which is gives you access to subscribe to the blocks in the next step to get data.</h4>
        <img src={dot} alt='dot' />

        <br></br>
        <br></br>
        <br></br>

        <h4>5. Subscribe to blocks. </h4>
        <img src={step4} alt='step 5' />
        <br></br>
        <br></br>
        <br></br>

    </div>
    
  }