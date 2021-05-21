var BatterySwap = artifacts.require("./BatterySwap.sol");

module.exports = function(deployer) {
  deployer.deploy(BatterySwap);
};
