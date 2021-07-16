pragma solidity >=0.5.16 <0.9.0;

contract DappToken {
    uint256 public totalSupply;
    string public name = "DApp Token";
    string public symbol = "DAPP";

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool sussess)
    {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
}
