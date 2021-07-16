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

    it('Initializes contract with correct values', async () => {
        assert.equal(await dappToken.name(), "DApp Token");
        assert.equal(await dappToken.symbol(), "DAPP");
    });

    it('sets the initial supply upon development', async function () {
        var totalSupply = await dappToken.totalSupply();

        var adminBalance = await dappToken.balanceOf(accounts[0]);

        assert.equal(adminBalance.toNumber(), 1000000);
        assert.equal(totalSupply.toNumber(), 1000000);
    });

    it('should fail when low balance', async () => {
        try {
            await dappToken.transfer(accounts[1], 1000001);
            assert.fail("The transaction should have thrown an error");
        }
        catch (err) {
            assert.include(err.message, "revert", "The error message should contain 'revert'");
        }
    });

    it('should transfer token', async () => {
        var acc0Balance = +await dappToken.balanceOf(accounts[0]);
        var acc1Balance = +await dappToken.balanceOf(accounts[1]);
        console.log(acc1Balance)

        var receipt = await dappToken.transfer(accounts[1], 10, { from: accounts[0] });

        assert.lengthOf(receipt.logs, 1, "Invalid event logs");
        assert.equal(receipt.logs[0].event, 'Transfer');
        assert.equal(receipt.logs[0].args._to, accounts[1]);
        assert.equal(receipt.logs[0].args._from, accounts[0]);
        assert.equal(receipt.logs[0].args._value, 10);
        assert.equal(await dappToken.balanceOf(accounts[0]), acc0Balance - 10, "Error in sender balance");
        assert.equal(await dappToken.balanceOf(accounts[1]), acc1Balance + 10, "Error in receiver balance");

        var value = await dappToken.transfer.call(accounts[1], 10, { from: accounts[0] });
        assert.isTrue(value, "function should return true if all execution success");
    });
});