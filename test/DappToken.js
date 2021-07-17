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

    it('should approve tokens for delegated transfer', async () => {
        var success = await dappToken.approve.call(accounts[1], 100);
        assert.isTrue(success, "approve returns true");

        var receipt = await dappToken.approve(accounts[1], 100, { from: accounts[0] });
        assert.lengthOf(receipt.logs, 1, "Invalid event logs");
        assert.equal(receipt.logs[0].event, 'Approval');
        assert.equal(receipt.logs[0].args._owner, accounts[0]);
        assert.equal(receipt.logs[0].args._spender, accounts[1]);
        assert.equal(receipt.logs[0].args._value, 100);

        var allowance = await dappToken.allowance(accounts[0], accounts[1]);
        assert.equal(allowance.toNumber(), 100, 'Allowance should be 100');
    });

    it('should handle delegate transfer', async () => {
        var fromAccount = accounts[2];
        var toAccount = accounts[3];
        var spendingAccount = accounts[4];
        var transferReceipt = await dappToken.transfer(fromAccount, 100, { from: accounts[0] });
        var approveReceipt = await dappToken.approve(spendingAccount, 10, { from: fromAccount });

        try {
            var transferFromReceipt = await dappToken.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
            assert.fail("The transaction should have thrown an error");
        } catch (error) {
            assert.include(error.message, "revert", "Cant transfer amount more than balance");
        }

        try {
            var transferFromReceipt = await dappToken.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
            assert.fail("The transaction should have thrown an error");
        } catch (error) {
            assert.include(error.message, "revert", "Cant transfer amount more than allowance");
        }

        var success = await dappToken.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
        assert.isTrue(success);

        var receipt = await dappToken.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
        assert.lengthOf(receipt.logs, 1, "Invalid event logs");
        assert.equal(receipt.logs[0].event, 'Transfer');
        assert.equal(receipt.logs[0].args._from, fromAccount);
        assert.equal(receipt.logs[0].args._to, toAccount);
        assert.equal(receipt.logs[0].args._value, 10);

        var balanceOfFromAccount = await dappToken.balanceOf(fromAccount);
        assert.equal(balanceOfFromAccount.toNumber(), 90);

        var balanceOfToAccount = await dappToken.balanceOf(toAccount);
        assert.equal(balanceOfToAccount.toNumber(), 10);

        var allowance = await dappToken.allowance(fromAccount, spendingAccount);
        assert.equal(allowance.toNumber(), 0);
    });
});