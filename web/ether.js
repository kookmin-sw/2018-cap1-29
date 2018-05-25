var Web3 = require('web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
var lightwallet = require('eth-lightwallet');
var fs = require('fs');
var shell = require('shelljs');
var txutils = lightwallet.txutils;

var web3 = new Web3(
    new Web3.providers.HttpProvider('https://rinkeby.infura.io')
);

// Insert your address
var address = '0x219b183D587762257FBe0281A127E0Dd2E93b94D';
// Insert your key
var key = '59ee1bd8e814caac3a87463b7fc7bed19ec064fbb458cdf5b41076b5bef09623'

// Insert your contract bytecode
var bytecode = '60806040526103e8600b556064600c553480156200001c57600080fd5b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6000819055506040805190810160405280600881526020017f48617368436f696e00000000000000000000000000000000000000000000000081525060059080519060200190620000f5929190620001a7565b50600a600660006101000a81548160ff021916908360ff1602179055506040805190810160405280600381526020017f4843580000000000000000000000000000000000000000000000000000000000815250600790805190602001906200015f929190620001a7565b5033600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555062000256565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620001ea57805160ff19168380011785556200021b565b828001600101855582156200021b579182015b828111156200021a578251825591602001919060010190620001fd565b5b5090506200022a91906200022e565b5090565b6200025391905b808211156200024f57600081600090555060010162000235565b5090565b90565b611fa080620002666000396000f30060806040526004361061013e576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde0314610143578063095ea7b3146101d35780630ce90ec2146102385780631289c0611461027d57806317599cc5146102ec57806318160ddd1461045857806323b872dd1461048357806327e235e314610508578063313ce5671461055f57806331b1b97814610590578063465882ea146106e35780634a7114a41461070e5780635c658165146107df57806370a082311461085657806378222373146108ad5780637ca09d99146109325780638fa9e55c1461095d57806395d89b41146109b8578063a9059cbb14610a48578063dd62ed3e14610aad578063e42f70b814610b24578063ee97f7f314610b7f578063f4478abc14610bd6578063fd58451614610bf6575b600080fd5b34801561014f57600080fd5b50610158610cdb565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561019857808201518184015260208101905061017d565b50505050905090810190601f1680156101c55780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156101df57600080fd5b5061021e600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610d79565b604051808215151515815260200191505060405180910390f35b34801561024457600080fd5b5061026360048036038101908080359060200190929190505050610e6b565b604051808215151515815260200191505060405180910390f35b34801561028957600080fd5b506102d2600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919080359060200190929190505050610ecc565b604051808215151515815260200191505060405180910390f35b3480156102f857600080fd5b5061031760048036038101908080359060200190929190505050611011565b604051808981526020018881526020018773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001806020018681526020018581526020018060200184151515158152602001838103835288818151815260200191508051906020019080838360005b838110156103af578082015181840152602081019050610394565b50505050905090810190601f1680156103dc5780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019080838360005b838110156104155780820151818401526020810190506103fa565b50505050905090810190601f1680156104425780820380516001836020036101000a031916815260200191505b509a505050505050505050505060405180910390f35b34801561046457600080fd5b5061046d6111b6565b6040518082815260200191505060405180910390f35b34801561048f57600080fd5b506104ee600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506111bc565b604051808215151515815260200191505060405180910390f35b34801561051457600080fd5b50610549600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611456565b6040518082815260200191505060405180910390f35b34801561056b57600080fd5b5061057461146e565b604051808260ff1660ff16815260200191505060405180910390f35b34801561059c57600080fd5b506105bb60048036038101908080359060200190929190505050611481565b604051808681526020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001848152602001838103835286818151815260200191508051906020019080838360005b8381101561063d578082015181840152602081019050610622565b50505050905090810190601f16801561066a5780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019080838360005b838110156106a3578082015181840152602081019050610688565b50505050905090810190601f1680156106d05780820380516001836020036101000a031916815260200191505b5097505050505050505060405180910390f35b3480156106ef57600080fd5b506106f8611607565b6040518082815260200191505060405180910390f35b34801561071a57600080fd5b506107c560048036038101908080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929050505061160d565b604051808215151515815260200191505060405180910390f35b3480156107eb57600080fd5b50610840600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611742565b6040518082815260200191505060405180910390f35b34801561086257600080fd5b50610897600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611767565b6040518082815260200191505060405180910390f35b3480156108b957600080fd5b50610918600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506117b0565b604051808215151515815260200191505060405180910390f35b34801561093e57600080fd5b506109476118bc565b6040518082815260200191505060405180910390f35b34801561096957600080fd5b5061099e600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506118c2565b604051808215151515815260200191505060405180910390f35b3480156109c457600080fd5b506109cd61193a565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610a0d5780820151818401526020810190506109f2565b50505050905090810190601f168015610a3a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b348015610a5457600080fd5b50610a93600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506119d8565b604051808215151515815260200191505060405180910390f35b348015610ab957600080fd5b50610b0e600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611b31565b6040518082815260200191505060405180910390f35b348015610b3057600080fd5b50610b65600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611bb8565b604051808215151515815260200191505060405180910390f35b348015610b8b57600080fd5b50610b94611c30565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610bf460048036038101908080359060200190929190505050611c56565b005b348015610c0257600080fd5b50610cc160048036038101908080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192908035906020019092919080359060200190929190505050611d5f565b604051808215151515815260200191505060405180910390f35b60058054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610d715780601f10610d4657610100808354040283529160200191610d71565b820191906000526020600020905b815481529060010190602001808311610d5457829003601f168201915b505050505081565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b6000806002600084815260200190815260200160002090506000600a8260040154811515610e9557fe5b04118015610ea7575060648160040154105b15610ec657600a8160040154811515610ebc57fe5b0481600501819055505b50919050565b600080600080600954111515610ee157600080fd5b6000600a54111515610ef257600080fd5b600085118015610f045750600a548511155b1515610f0f57600080fd5b600260008681526020019081526020016000209150600160008360010154815260200190815260200160002090508060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415611003578573ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef866040518082815260200191505060405180910390a360019250611008565b600092505b50509392505050565b60026020528060005260406000206000915090508060000154908060010154908060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806003018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156110ef5780601f106110c4576101008083540402835291602001916110ef565b820191906000526020600020905b8154815290600101906020018083116110d257829003601f168201915b505050505090806004015490806005015490806006018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156111995780601f1061116e57610100808354040283529160200191611199565b820191906000526020600020905b81548152906001019060200180831161117c57829003601f168201915b5050505050908060070160009054906101000a900460ff16905088565b60005481565b600080600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015801561128d5750828110155b151561129857600080fd5b82600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555082600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8110156113e55782600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b8373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040518082815260200191505060405180910390a360019150509392505050565b60036020528060005260406000206000915090505481565b600660009054906101000a900460ff1681565b60016020528060005260406000206000915090508060000154908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806002018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156115595780601f1061152e57610100808354040283529160200191611559565b820191906000526020600020905b81548152906001019060200180831161153c57829003601f168201915b505050505090806003018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156115f75780601f106115cc576101008083540402835291602001916115f7565b820191906000526020600020905b8154815290600101906020018083116115da57829003601f168201915b5050505050908060040154905085565b600b5481565b600061163b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16856119d8565b5060096000815480929190600101919050555060a06040519081016040528060095481526020013373ffffffffffffffffffffffffffffffffffffffff168152602001848152602001838152602001858152506001600060095481526020019081526020016000206000820151816000015560208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040820151816002019080519060200190611710929190611ecf565b50606082015181600301908051906020019061172d929190611ecf565b50608082015181600401559050509392505050565b6004602052816000526040600020602052806000526040600020600091509150505481565b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600081600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555081600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b600c5481565b6000600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156119305761192682600b546119d8565b5060019050611935565b600090505b919050565b60078054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156119d05780601f106119a5576101008083540402835291602001916119d0565b820191906000526020600020905b8154815290600101906020018083116119b357829003601f168201915b505050505081565b600081600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515611a2857600080fd5b81600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b6000600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6000600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415611c2657611c1c82600c546119d8565b5060019050611c2b565b600090505b919050565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000806000600954111515611c6a57600080fd5b6000600a54111515611c7b57600080fd5b600260008481526020019081526020016000209150600160008360010154815260200190815260200160002090508160020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83600401546040518082815260200191505060405180910390a3505050565b60008086118015611d7257506009548611155b1515611d7d57600080fd5b600a6000815480929190600101919050555061010060405190810160405280600a5481526020018781526020013373ffffffffffffffffffffffffffffffffffffffff1681526020018681526020018481526020018381526020018581526020016000151581525060026000600a548152602001908152602001600020600082015181600001556020820151816001015560408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506060820151816003019080519060200190611e71929190611ecf565b506080820151816004015560a0820151816005015560c0820151816006019080519060200190611ea2929190611ecf565b5060e08201518160070160006101000a81548160ff02191690831515021790555090505095945050505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611f1057805160ff1916838001178555611f3e565b82800160010185558215611f3e579182015b82811115611f3d578251825591602001919060010190611f22565b5b509050611f4b9190611f4f565b5090565b611f7191905b80821115611f6d576000816000905550600101611f55565b5090565b905600a165627a7a72305820c9263ae48e71ad954e05dc60bb87a7e61cc3d26926c3f803717d1a9e3e1f72200029'

// Insert your abi
var interface = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_answer_id","type":"uint256"}],"name":"levelUp","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_answer_id","type":"uint256"},{"name":"_value","type":"uint256"}],"name":"chooseAnswer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"answers","outputs":[{"name":"id","type":"uint256"},{"name":"question_id","type":"uint256"},{"name":"author","type":"address"},{"name":"title","type":"string"},{"name":"choosedAnswerCounter","type":"uint256"},{"name":"level","type":"uint256"},{"name":"description","type":"string"},{"name":"choose","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"questions","outputs":[{"name":"id","type":"uint256"},{"name":"author","type":"address"},{"name":"title","type":"string"},{"name":"description","type":"string"},{"name":"bounty","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"initial_amount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"},{"name":"_title","type":"string"},{"name":"_description","type":"string"}],"name":"registQuestion","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"donateToken","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"upvote_amount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"}],"name":"signIn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"}],"name":"upVote","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"master","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_answer_id","type":"uint256"}],"name":"rewardAnswer","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_question_id","type":"uint256"},{"name":"_title","type":"string"},{"name":"_description","type":"string"},{"name":"_choosedAnswerCounter","type":"uint256"},{"name":"_level","type":"uint256"}],"name":"registAnswer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_question_id","type":"uint256"},{"indexed":true,"name":"_answer_id","type":"uint256"},{"indexed":true,"name":"_answer_author","type":"address"}],"name":"LogChooseAnswer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]

var myContract = web3.eth.contract(interface);
var contractAddress = '0xed67240394c97f9b1007422e4bd16cc91858c182';
var myContractInstance = myContract.at(contractAddress);

function sendRaw(rawTx) {
    var privateKey = new Buffer(key, 'hex');
    var transaction = new tx(rawTx);
    transaction.sign(privateKey);
    var serializedTx = transaction.serialize().toString('hex');
    web3.eth.sendRawTransaction(
    '0x' + serializedTx, function(err, result) {
        if(err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
}

var txOptions = {
    nonce: web3.toHex(web3.eth.getTransactionCount(address)),
    gasLimit: web3.toHex(800000),
    gasPrice: web3.toHex(20000000000),
    to: contractAddress
}

// Web3 examples
// get template
//var rawTx = txutils.functionTx(interface, 'transfer', ['0x38dDF905498F4D17585DBEFA71f602395Adb13C1',1000000000000000000], txOptions);
//sendRaw(rawTx);
// set template
// var result = myContractInstance.getTokenCount();
// console.log(result)
