var qasToken = artifacts.require("./qasToken.sol");

module.exports = function(deployer) {
  deployer.deploy(qasToken);
}
