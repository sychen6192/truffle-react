import web3 from './getWeb3.js';
import MarketFactory from "./contracts/MarketFactory.json"

const instance = new web3.eth.Contract(
    MarketFactory.abi,
    '0x41dE4115050300D4109cfC3A7Ecef0473E6d2682'
);

export default instance;