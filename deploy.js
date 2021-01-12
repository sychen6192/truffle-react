// Step 1: Get a contract into my application
var json = require("./clients/contracts/MarketFactory.json");

// Step 2: Turn that contract into an abstraction I can use
var contract = require("@truffle/contract");
var MyContract = contract(json);

// Step 3: Provision the contract with a web3 provider
MyContract.setProvider(new Web3.providers.HttpProvider("http://140.113.73.151:8545"));

// Step 4: Use the contract!
MyContract.deployed().then(function(deployed) {
  return deployed.someFunction();
});