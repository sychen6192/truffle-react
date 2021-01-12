const path = require('path')
const HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    // optional config values:
    // gas
    // gasPrice
    // from - default address to use for any transaction Truffle makes during migrations
    // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
    //          - function that returns a web3 provider instance (see below.)
    //          - if specified, host and port are ignored.
    // skipDryRun: - true if you don't want to test run the migration locally before the actual migration (default is false)
    // timeoutBlocks: - if a transaction is not mined, keep waiting for this number of blocks (default is 50)
    // deploymentPollingInterval: - duration between checks for completion of deployment transactions
    contracts_build_directory: path.join(__dirname, "client/src/contracts"),
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*", // match any network
            websockets: true
        },
        iebi: {
            host: "140.113.73.151", // Random IP for example purposes (do not use)
            port: 8545,
            network_id: 57427, // Ethereum public network
            from: "0x795Fd9dE464299e3141e19dc740cc85A4f42E67d",
            provider: function() {
                return new HDWalletProvider("mention party butter stadium scissors obscure cave service fine hobby trap organ", "http://140.113.73.151:8545/");
            },
        }
    },
    compilers: {
        solc: {
            version: "^0.4.26"
        }
    }
};