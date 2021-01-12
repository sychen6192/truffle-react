pragma solidity ^0.4.17;

contract MarketFactory {
    address[] public deployedMarkets;
    mapping(address => string) public deployedDescription;
    
    function createMarket(string description, uint stack) public {
        address newMarket = new Market(description, stack, msg.sender);
        deployedMarkets.push(newMarket);
        deployedDescription[newMarket] = description;
    }
    
    function getDeployedMarkets() public view returns (address[]) {
        return deployedMarkets;
    }
}

contract Market {
    struct Gambler {
        address gamblerAddress;
        uint value;
        bool gamblersChoice;
    }
    
    Gambler[] public gamblers;
    address public manager;
    uint public stack;
    string public description;
    uint public gamblersYesCount;
    uint public gamblersNoCount;
    bool complete;
    uint prize;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(string _description, uint _stack, address _creator) public {
        manager = _creator;
        stack = _stack;
        description = _description;
        complete = false;
        prize = 0;
    }
    
    function getSummary() public view returns (
        uint, uint, uint, uint, uint, address
    ) {
        return (
            stack,
            address(this).balance,
            gamblers.length,
            gamblersYesCount,
            gamblersNoCount,
            manager
        );
    }
    
    function getState() public view returns(bool) {
        return complete;
    }
    
    function betYes() public payable {
        require(msg.value >= stack);
        require(!complete);
        Gambler memory newGambler = Gambler({
            gamblerAddress: msg.sender,
            value: msg.value,
            gamblersChoice: true
        });
        
        gamblers.push(newGambler);
        gamblersYesCount++;
    }
    
    function betNo() public payable {
        require(msg.value >= stack);
        require(!complete);
        Gambler memory newGambler = Gambler({
            gamblerAddress: msg.sender,
            value: msg.value,
            gamblersChoice: false
        });
        gamblers.push(newGambler);
        gamblersNoCount++;
    }
    
    function getGamblersCount() public view returns (uint) {
        return gamblers.length;
    }
    
    function finalizeBetting(bool result) public restricted {
        require(msg.sender==manager);
        require(!complete);
        if (result) {
            prize = address(this).balance / gamblersYesCount;
        } else {
            prize = address(this).balance / gamblersNoCount;
        }
        for (uint i=0; i < gamblers.length; i++) {
            if (gamblers[i].gamblersChoice == result) {
                gamblers[i].gamblerAddress.transfer(prize);
            }
        }
        complete = true;
    }
}
  