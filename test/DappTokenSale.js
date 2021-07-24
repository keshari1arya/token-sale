const { assert } = require("chai");
const _deploy_contracts = require("../migrations/2_deploy_contracts");

var DappToken = artifacts.require('./DappToken.sol');
var DappTokenSale = artifacts.require('./DappTokenSale.sol');
require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('DappTokenSale', (accounts) => {
    var token;
    var tokenSale;
    var tokenPrice = 1000000000000000000 // wei
    var admin;
    var buyer;

    before(async () => {
        token = await DappToken.deployed();
        tokenSale = await DappTokenSale.deployed();
        admin = accounts[0];
        buyer = accounts[1];
    })

    it('initialize with correct value', async () => {
        assert.notEqual(tokenSale.address, 0x0);
        var adminAddress = tokenSale.tokenContract();
        assert.notEqual(adminAddress, 0x0);
        var price = await tokenSale.tokenPrice();
        assert.equal(price, tokenPrice);
    });

    it('Buy token', async () => {
        var numberOfTokens = 10;
        var value = numberOfTokens * tokenPrice;        

        var receipt = await tokenSale.buyTokens(numberOfTokens, { from: buyer, value: value });
        assert.lengthOf(receipt.logs, 1, "Invalid event logs");
        assert.equal(receipt.logs[0].event, 'Sell');
        assert.equal(receipt.logs[0].args._buyer, buyer);
        assert.equal(receipt.logs[0].args._amount, numberOfTokens);

        var tokenSold = await tokenSale.tokenSold();
        assert.equal(tokenSold, numberOfTokens, "token sold incremented");

        try {
            var receipt = await tokenSale.buyTokens(numberOfTokens, { from: buyer, value: 1 });
        }
        catch (err) {
            assert.include(err.message, "revert", "cant sell with underpaying'");
        }
    })

    it('ends token sale', async () => {   
        try {
            await tokenSale.endSale({ from: buyer })
        }
        catch (err) {
            assert.include(err.message, "revert", "Must be admin to end sale'");
        }
        await tokenSale.endSale({ from: admin});
        var balance = await token.balanceOf(admin)
        assert(balance.toNumber(), 999990, 'returns all tokens to admin')
    })
});