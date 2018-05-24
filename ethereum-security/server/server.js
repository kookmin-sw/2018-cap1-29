var Web3 = require('web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
var lightwallet = require('eth-lightwallet');
var fs = require('fs');
var shell = require('shelljs');
var txutils = lightwallet.txutils;


var web3 = new Web3(
    new Web3.providers.HttpProvider('http://127.0.0.1:8545')
);
var address = '0xD1327ffe8765732Ff675d7B533f7AAD93053739b';
var key = '609378169defc198fd60738d298e69840b78e721e8b4a15cc45e95e142bc2a9b';

var bytecode = '60806040523480156200001157600080fd5b50620f4240600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550620f42406000819055506040805190810160405280601681526020017f4b6f6f6b6d696e20536563757269747920546f6b656e0000000000000000000081525060079080519060200190620000b092919062000172565b506012600860006101000a81548160ff021916908360ff1602179055506040805190810160405280600381526020017f4b53540000000000000000000000000000000000000000000000000000000000815250600990805190602001906200011a92919062000172565b5033600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600181905550600060028190555062000221565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620001b557805160ff1916838001178555620001e6565b82800160010185558215620001e6579182015b82811115620001e5578251825591602001919060010190620001c8565b5b509050620001f59190620001f9565b5090565b6200021e91905b808211156200021a57600081600090555060010162000200565b5090565b90565b611a3680620002316000396000f30060806040526004361061013e576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063044215c61461014857806306fdde03146101b5578063095ea7b31461024557806316f66e55146102aa57806318160ddd146102d557806323b872dd1461030057806327e235e3146103855780632a2a3284146103dc578063313ce56714610407578063446a37e0146104385780635c658165146104f4578063664e97041461056b57806370a082311461059657806378a89567146105ed57806381f5e555146106185780638da5cb5b146106b9578063933e16af1461071057806395d89b411461076b5780639f181b5e146107fb578063a9059cbb14610826578063b44272631461088b578063baf8b45914610895578063dc369a6614610951578063dd62ed3e146109be575b610146610a35565b005b34801561015457600080fd5b5061017360048036038101908080359060200190929190505050610b78565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101c157600080fd5b506101ca610bab565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561020a5780820151818401526020810190506101ef565b50505050905090810190601f1680156102375780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561025157600080fd5b50610290600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610c49565b604051808215151515815260200191505060405180910390f35b3480156102b657600080fd5b506102bf610d3b565b6040518082815260200191505060405180910390f35b3480156102e157600080fd5b506102ea610d41565b6040518082815260200191505060405180910390f35b34801561030c57600080fd5b5061036b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610d47565b604051808215151515815260200191505060405180910390f35b34801561039157600080fd5b506103c6600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611102565b6040518082815260200191505060405180910390f35b3480156103e857600080fd5b506103f161111a565b6040518082815260200191505060405180910390f35b34801561041357600080fd5b5061041c611124565b604051808260ff1660ff16815260200191505060405180910390f35b34801561044457600080fd5b50610479600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611137565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104b957808201518184015260208101905061049e565b50505050905090810190601f1680156104e65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561050057600080fd5b50610555600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611218565b6040518082815260200191505060405180910390f35b34801561057757600080fd5b5061058061123d565b6040518082815260200191505060405180910390f35b3480156105a257600080fd5b506105d7600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611243565b6040518082815260200191505060405180910390f35b3480156105f957600080fd5b5061060261128c565b6040518082815260200191505060405180910390f35b34801561062457600080fd5b5061069f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611296565b604051808215151515815260200191505060405180910390f35b3480156106c557600080fd5b506106ce61136e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561071c57600080fd5b50610751600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611394565b604051808215151515815260200191505060405180910390f35b34801561077757600080fd5b506107806114eb565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156107c05780820151818401526020810190506107a5565b50505050905090810190601f1680156107ed5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561080757600080fd5b50610810611589565b6040518082815260200191505060405180910390f35b34801561083257600080fd5b50610871600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061158f565b604051808215151515815260200191505060405180910390f35b610893610a35565b005b3480156108a157600080fd5b506108d6600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611784565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156109165780820151818401526020810190506108fb565b50505050905090810190601f1680156109435780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561095d57600080fd5b5061097c60048036038101908080359060200190929190505050611834565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156109ca57600080fd5b50610a1f600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611871565b6040518082815260200191505060405180910390f35b60008034111515610a4557600080fd5b610a5a61c350346118f890919063ffffffff16565b9050610aae81600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461193090919063ffffffff16565b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610b068160005461193090919063ffffffff16565b600081905550600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f19350505050158015610b74573d6000803e3d6000fd5b5050565b60056020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60078054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610c415780601f10610c1657610100808354040283529160200191610c41565b820191906000526020600020905b815481529060010190602001808311610c2457829003601f168201915b505050505081565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b60025481565b60005481565b600080600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410158015610e185750828110155b8015610e245750600083115b1515610e2f57600080fd5b610e8183600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461193090919063ffffffff16565b600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610f1683600360008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461194c90919063ffffffff16565b600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8110156110915761101083600460008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461194c90919063ffffffff16565b600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b8373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040518082815260200191505060405180910390a360019150509392505050565b60036020528060005260406000206000915090505481565b6000600254905090565b600860009054906101000a900460ff1681565b6060600660008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561120c5780601f106111e15761010080835404028352916020019161120c565b820191906000526020600020905b8154815290600101906020018083116111ef57829003601f168201915b50505050509050919050565b6004602052816000526040600020602052806000526040600020600091509150505481565b61c35081565b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000600154905090565b6000600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156112f457600080fd5b81600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209080519060200190611347929190611965565b5061135e600160025461193090919063ffffffff16565b6002819055506001905092915050565b600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000806113c06002546113b26001805461193090919063ffffffff16565b61194c90919063ffffffff16565b90506113d76001805461193090919063ffffffff16565b6001819055508260056000600154815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061148381600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461193090919063ffffffff16565b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506114db8160005461193090919063ffffffff16565b6000819055506001915050919050565b60098054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156115815780601f1061155657610100808354040283529160200191611581565b820191906000526020600020905b81548152906001019060200180831161156457829003601f168201915b505050505081565b60015481565b600081600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101580156115e05750600082115b15156115eb57600080fd5b61163d82600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461194c90919063ffffffff16565b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506116d282600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461193090919063ffffffff16565b600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905092915050565b60066020528060005260406000206000915090508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561182c5780601f106118015761010080835404028352916020019161182c565b820191906000526020600020905b81548152906001019060200180831161180f57829003601f168201915b505050505081565b60006005600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b6000600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60008083141561190b576000905061192a565b818302905081838281151561191c57fe5b0414151561192657fe5b8090505b92915050565b6000818301905082811015151561194357fe5b80905092915050565b600082821115151561195a57fe5b818303905092915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106119a657805160ff19168380011785556119d4565b828001600101855582156119d4579182015b828111156119d35782518255916020019190600101906119b8565b5b5090506119e191906119e5565b5090565b611a0791905b80821115611a035760008160009055506001016119eb565b5090565b905600a165627a7a723058208f7c66f22cb6cb7aab635518ebf446ec17086e4eb2c58e14df91712f63322fff0029';
var interface = [{
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "_owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "_token",
      "type": "address"
    }],
    "name": "analysis",
    "outputs": [{
      "name": "success",
      "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [{
      "name": "success",
      "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "createTokens",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_token",
        "type": "address"
      },
      {
        "name": "_result",
        "type": "string"
      }
    ],
    "name": "setResult",
    "outputs": [{
      "name": "success",
      "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [{
        "indexed": true,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [{
      "name": "success",
      "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [{
      "name": "success",
      "type": "bool"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": true,
    "inputs": [{
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [{
      "name": "remaining",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
      },
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "allowed",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_owner",
      "type": "address"
    }],
    "name": "balanceOf",
    "outputs": [{
      "name": "balance",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "address"
    }],
    "name": "balances",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{
      "name": "",
      "type": "uint8"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "_token",
      "type": "address"
    }],
    "name": "getResult",
    "outputs": [{
      "name": "_token_result",
      "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "num",
      "type": "uint256"
    }],
    "name": "getSmartContract",
    "outputs": [{
      "name": "token_address",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getTokenCount",
    "outputs": [{
      "name": "token_count",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getTokenDoneCount",
    "outputs": [{
      "name": "token_done_count",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{
      "name": "",
      "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "RATE",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{
      "name": "",
      "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "uint256"
    }],
    "name": "token",
    "outputs": [{
      "name": "",
      "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{
      "name": "",
      "type": "address"
    }],
    "name": "token_result",
    "outputs": [{
      "name": "",
      "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "tokenCount",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "tokenDone",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{
      "name": "",
      "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

var myContract = web3.eth.contract(interface);
var contractAddress = '0x60c2de96731ba2ce504e70f61e380a9bf256dc43';
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
// var rawTx = txutils.functionTx(interface, 'analysis', ['0x005'], txOptions);
// sendRaw(rawTx);
// var result = myContractInstance.getTokenCount();
// console.log(result)

var getTokenCount = parseInt(myContractInstance.getTokenCount());
var getTokenDoneCount = parseInt(myContractInstance.getTokenDoneCount());

while((getTokenCount-getTokenDoneCount) != 0) {
    getTokenDoneCount = getTokenDoneCount + 1;
    var result_string = '';
    var contract_address = myContractInstance.token(getTokenDoneCount);
    var email_to = myContractInstance.getEmail(contract_address);
    try{
        var code = String(web3.eth.getCode(contract_address));
    }
    catch(err){
        var output = "WrongAddress";
        fs.writeFileSync('./output'+String(getTokenDoneCount)+'.txt', output, function(err){
            if(err) {
                return console.log(err);
            }
        });
        continue;
    }
    fs.writeFileSync('./test.bin', code.substring(2), function(err){
        if(err) {
            return console.log(err);
        }
    });

    try{
        var _output = shell.exec('sudo docker run -v /home/learnitdeep/smartcontract-security-checker/server:/server --name test luongnguyen/oyente /bin/bash -c "cd oyente; python oyente.py -s /server/test.bin -b"', {async:false});
        var output = _output.stderr;

        if (shell.exec('sudo docker rm test').code !== 0) {
            shell.echo('Error: Git commit failed');
            shell.exit(1);
        }
    }
    catch(err){
        var _output = "error1";
        var output = _output;
    }

    try{
        _output = shell.exec('sudo docker run --name test mythril /bin/bash -c "myth -x -a '+String(contract_address)+' --rpc infura-rinkeby --max-depth 4"', {async:false});
        output = output + _output.stdout;
        console.log(output);

        if (shell.exec('sudo docker rm test').code !== 0) {
            shell.echo('Error: Git commit failed');
            shell.exit(1);
        }
    }
    catch(err){
        output = output + "error2";
    }
    fs.writeFileSync('./output'+String(getTokenDoneCount)+'.txt', output, function(err){
        if(err) {
            return console.log(err);
        }
    });
    if(output.indexOf('Callstack Depth Attack Vulnerability:  True') >= 0) {
        result_string = result_string + "Exception.";
    }
    if(output.indexOf('Timestamp Dependency:                  True') >= 0) {
        result_string = result_string + "Timestamp."
    }
    if(output.indexOf('Re-Entrancy Vulnerability:             True') >= 0) {
        result_string = result_string + "re-entrancy.";
    }
    if(output.indexOf('Transaction-Ordering Dependence (TOD): True') >= 0) {
        result_string = result_string + "TOD.";
    }
    if(output.indexOf('==== Ether send ====') >= 0) {
        result_string = result_string + "Access control.";
    }
    if(output.indexOf('tx.origin') >= 0) {
        result_string = result_string + "tx.origin.";
    }

    var rawTx = txutils.functionTx(interface, 'setResult', [result_string], txOptions);
    sendRaw(rawTx);
}
