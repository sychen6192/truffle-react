import web3 from './getWeb3.js';
import Market from './contracts/Market.json';

export default (address) => {
    return new web3.eth.Contract(Market.abi, address);
};

