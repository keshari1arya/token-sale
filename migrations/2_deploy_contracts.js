const DappToken = artifacts.require("DappToken.sol");
const DappTokenSale = artifacts.require("DappTokenSale.sol");

module.exports = (async (deployer) => {
    var tokenPrice = web3.utils.toBN('1000000000000000000'); // wei
    await deployer.deploy(DappToken, 1000000);
    await deployer.deploy(DappTokenSale, DappToken.address, tokenPrice);
});
