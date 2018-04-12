var qasToken = artifacts.require("./qasToken.sol");

contract('qasToken', function(accounts) {
  it("should be funding a campaign", function() {
    return qasToken.deployed().then(function(instance) {
      return instance.signIn(accounts[1], {
        from: accounts[0]
      });
    }).then(function(receipt) {
      //console.log(receipt.logs[0].args._from);
      //console.log(receipt.logs[0].args._to);
      //console.log(receipt.logs[0].args._value.toNumber());

      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "Transfer", "event should be Transfer");
      assert.equal(receipt.logs[0].args._from, accounts[0], "from account must be " + accounts[0]);
      assert.equal(receipt.logs[0].args._to, accounts[1], "to account must be " + accounts[1]);
      assert.equal(receipt.logs[0].args._value.toNumber(), 1000, "value must be " + 1000);
    });
  });
});