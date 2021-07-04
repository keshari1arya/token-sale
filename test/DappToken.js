const { assert } = require("chai");
const _deploy_contracts = require("../migrations/2_deploy_contracts");

var DappToken = artifacts.require('./DappToken.sol');
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('DappToken', function (accounts) {
let dappToken;
    before(async () => {
        dappToken = await DappToken.deployed();
    })
    it('Initializes contract with correct values', async()=>{
        assert.equal(await dappToken.name(), "DApp Token");
        assert.equal(await dappToken.symbol(), "DAPP");
    });

    it('sets the initial supply upon development', async function () {
        var totalSupply = await dappToken.totalSupply();

        var adminBalance = await dappToken.balanceOf(accounts[0]);

        assert.equal(adminBalance.toNumber(), 1000000);
        assert.equal(totalSupply.toNumber(), 1000000);
    });
});