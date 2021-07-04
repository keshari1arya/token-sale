pragma solidity ^0.5.16;

contract DappToken {
    uint256 public totalSupply;
    string public name = "DApp Token";
    string public symbol = "DAPP";

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }
}
