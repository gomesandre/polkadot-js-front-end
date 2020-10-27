import React from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';

const wsProvider = new WsProvider('wss://rpc.polkadot.io');

class App extends React.Component {
  
  state = {
    block: {
      number: 0,
      hash: "0x",
    }
  }

  componentDidMount() {
    this.getLatestBlock();
  }

  getLatestBlock = async () => {
    const api = await ApiPromise.create({ provider: wsProvider });
    
    let count = 0;
    
    const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
      this.setState({ block: { number: header.number.toNumber(), hash: header.hash.toHex() }});

      if (++count === 256) {
        unsubscribe();
        process.exit(0);
      }
    });
  };

  render () {
    let {number, hash} = this.state.block;

    if (number !== 0) {
      return <div>
        <div>Block number: { number }</div>
        <div>Block hash: { hash }</div>
      </div>;  
    }

    return <div>
      <div>Loading Polkadot latest block information...</div>
    </div>;
  }
}

export default App;
