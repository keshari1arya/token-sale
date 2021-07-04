const _deploy_contracts = require("../migrations/2_deploy_contracts");

var DappToken = artifacts.require('./DappToken.sol');

contract('DappToken', function (accounts) {
    it('sets the total supply upon development', async function () {
        var token = await DappToken.deployed();
        var totalSupply = await token.totalSupply();
        assert.equal(totalSupply.toNumber(), 1000000);
    });
});