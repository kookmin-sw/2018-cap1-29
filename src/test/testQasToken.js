var qasToken = artifacts.require("./qasToken.sol");

contract('qasToken', function(accounts) {
  var bounty = 100;
  var instance;
  var questionTitle = "Question 1";
  var questionDescription = "Description for Question 1";  
  var answerTitle = "Answer 1 for Question 1";
  var answerDescription = "Description for Answer 1 for Question 1"; 
  var chosenAnswerID  =  1;
  var master = accounts[0];
  var questioner = accounts[1];
  var questionee = accounts[2];
  var questionerBefore, questionerAfter;
  var questioneeBefore, questioneeAfter;

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
      return instance.registQuestion(bounty, questionTitle, questionDescription, 
      {
        from: questioner
      });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 2, "two events should have been triggered");
      assert.equal(receipt.logs[0].event, "Transfer", "event should be Transfer");
      assert.equal(receipt.logs[1].event, "LogRegistQuestion", "event should be LogRegistQuestion");
      assert.equal(receipt.logs[0].args._from, questioner, "to account must be " + questioner);
      assert.equal(receipt.logs[0].args._to, master, "from account must be " + master);
      assert.equal(receipt.logs[0].args._value.toNumber(), bounty, "value must be " + bounty);
      assert.equal(receipt.logs[1].args._title, questionTitle, "event question title must be " + questionTitle);
    });
  });
  it("should regist answer", function() {
    return qasToken.deployed().then(function(instance) {
      return instance.registAnswer(1, answerTitle, answerDescription, 
      {
        from: questionee
      });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "LogRegistAnswer", "event should be LogRegistAnswer");
      assert.equal(receipt.logs[0].args._id.toNumber(), 1, "id must be 1");
      assert.equal(receipt.logs[0].args._author, questionee, "event author must be " + questionee);     
      assert.equal(receipt.logs[0].args._title, answerTitle, "event question title must be " + answerTitle);
    });
  });

  it("should choose answer", function() {
    return qasToken.deployed().then(function(instance) {
      questionerBefore=web3.fromWei(web3.eth.getBalance(questioner), "ether").toNumber();
      questioneeBefore=web3.fromWei(web3.eth.getBalance(questionee), "ether").toNumber();
      return instance.chooseAnswer(questionee, 1, bounty, {
        from: questioner
      });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "two events should have been triggered");
      assert.equal(receipt.logs[0].event, "Transfer", "event should be Transfer");
  //    assert.equal(receipt.logs[1].event, "LogChooseAnswer", "event should be LogChooseAnswer");
      assert.equal(receipt.logs[0].args._from, questioner, "to account must be " + questioner);
      assert.equal(receipt.logs[0].args._to, questionee, "from account must be " + questionee);
      assert.equal(receipt.logs[0].args._value.toNumber(), bounty, "value must be " + bounty);
  //    assert.equal(receipt.logs[1].args._answer_id.toNumber(), chosenAnswerID, "value must be " + chosenAnswerID);
      questionerAfter = web3.fromWei(web3.eth.getBalance(questioner), "ether").toNumber();
     });
  });

  it("should upvote", function() {
    return qasToken.deployed().then(function(instance) {
      return instance.upVote(questionee, {
        from: master
      });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "Transfer", "event should be Transfer");
      assert.equal(receipt.logs[0].args._from, master, "to account must be " + master);
      assert.equal(receipt.logs[0].args._to, questionee, "from account must be " + questionee);
      assert.equal(receipt.logs[0].args._value.toNumber(), bounty, "value must be " + bounty);
    });
  });
});