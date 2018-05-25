(function() {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    var contract = web3.eth.contract([{
            "constant": true,
            "inputs": [{
                "name": "name",
                "type": "string"
            }],
            "name": "get",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [{
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "set",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]).at("0x4e386219ffbec87f0979c0c52452af9e5d5d070c");

 //   var key = "8c60dd2e7a70c4861857caf3e01dcc162e2b9ff8fcf6ecc9f861bf178db1390d";
   // var salary = contract.get(key);

    //console.log(key,salary.toString(10));
})();