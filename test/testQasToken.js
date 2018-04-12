var qasToken = artifacts.require("./qasToken.sol");

contract('qasToken', function(accounts) {
  var bounty = 100;
  var master = accounts[0];
  var questioner = accounts[1];

  it("should sign in", function() {
    return qasToken.deployed().then(function(instance) {
      return instance.signIn(questioner, {
        from: master
      });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "Transfer", "event should be Transfer");
      assert.equal(receipt.logs[0].args._from, master, "from account must be " + master);
      assert.equal(receipt.logs[0].args._to, questioner, "to account must be " + questioner);
      assert.equal(receipt.logs[0].args._value.toNumber(), 1000, "value must be " + 1000);
    });
  });

  it("should regist question", function() {
    return qasToken.deployed().then(function(instance) {
      return instance.registQuestion(bounty, {
        from: questioner
      });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "Transfer", "event should be Transfer");
      assert.equal(receipt.logs[0].args._from, questioner, "to account must be " + questioner);
      assert.equal(receipt.logs[0].args._to, master, "from account must be " + master);
      assert.equal(receipt.logs[0].args._value.toNumber(), bounty, "value must be " + bounty);
    });
  });
});