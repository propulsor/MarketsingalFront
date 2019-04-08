import React from 'react'
import './About.css'
export default function About() {
    return (
    <div className='about'>
      <h4 >
    Market Signal is an Oracle that has been created in the <a target="_blank" rel="noopener noreferrer" href='https://www.zap.org/'>Zap</a> to provide trending data for cryptocurrency. This applies to the trending to the currencies from different cryptocurrency exchanges as well as the general trend for the currencies.
    </h4>

    <h4>Using Ethereum smart contracts, oracles are created via Zap and users can connect to oracle(s) to get data by using currencies within the platform, zaps and dots.  Once the oracles and/or consumers are setup via the smart contracts provided by Zap, the oracles can provide data on-chain or off-chain. The data consumers can also be on-chain or off-chain.
    </h4>

    <h4>If you are interested to learn more about the Oracles, see <a target="_blank" rel="noopener noreferrer" href='https://zapproject.gitbook.io/zapproject/'>here</a> for documentations.
    </h4>
    </div>
    )
  }