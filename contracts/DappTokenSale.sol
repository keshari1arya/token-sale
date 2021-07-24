// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

import "./DappToken.sol";

contract DappTokenSale {
    address payable admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(DappToken _tokenContract, uint256 _tokenPrice) {
        admin = payable(address(msg.sender));
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == mult(_numberOfTokens, tokenPrice));

        tokenSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        require(msg.sender == admin);
        require(
            tokenContract.transfer(
                admin,
                tokenContract.balanceOf(address(this))
            )
        );
        selfdestruct(admin);
    }

    function mult(uint256 a, uint256 b) private pure returns (uint256 c) {
        require(b == 0 || (c = a * b) / b == a);
    }
}
