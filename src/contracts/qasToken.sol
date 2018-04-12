pragma solidity ^0.4.18;

import "./EIP20Interface.sol";

contract qasToken is EIP20Interface {

    uint256 constant private MAX_UINT256 = 2**256 - 1;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;
    /*
    senario
    We have [id, address] information.
    All users have metamask(or we provide wallet frontend).
    register question, choose answer.
    */
    string public name;                   //fancy name: eg Simon Bucks
    uint8 public decimals;                //How many decimals to show.
    string public symbol;                 //An identifier: eg SBX
    address public master; /*= 0x9CE08ACc22ad4ee411b0cfE0caE3421ACa5C32ca;*/

    function qasToken(/*
        uint256 _initialAmount,
        string _tokenName,
        uint8 _decimalUnits,
        string _tokenSymbol
    */) public {
        balances[msg.sender] = MAX_UINT256;               // Give the creator all initial tokens
        totalSupply = MAX_UINT256;                        // Update total supply
        name = "HashCoin";                                   // Set the name for display purposes
        decimals = 10;                            // Amount of decimals for display purposes
        symbol = "HCX";
        master = msg.sender;                             // Set the symbol for display purposes
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && allowance >= _value);
        balances[_to] += _value;
        balances[_from] -= _value;
        if (allowance < MAX_UINT256) {
            allowed[_from][msg.sender] -= _value;
        }
        Transfer(_from, _to, _value);
        return true;
    }

    // value = money for the question
    function registQuestion(uint256 _value) public returns (bool success) {

        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[master] += _value;
        Transfer(msg.sender, master, _value);
        return true;
    }

    function signIn(address _to) public returns (bool success) {
        if(msg.sender == master){
            require(balances[master] >= 1000);
            balances[master] -= 1000;
            balances[_to] += 1000;
            Transfer(master, _to, 1000);
            return true;
        } else {
            return false;
        }

    }
        function upVote(address _to) public returns (bool success) {
        if(msg.sender == master){
            transfer(_to, 100);
            return true;
        } else {
            return false;
        }

    }


    function chooseAnswer(address _to, uint256 _value) public returns (bool success) {
        if(msg.sender == master){
            require(balances[master] >= _value);
            balances[master] -= _value;
            balances[_to] += _value;
            Transfer(master, _to, _value);
            return true;
        }
        else{
            return false;
        }
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}
