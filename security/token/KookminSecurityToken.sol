/*
Implements EIP20 token standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
.*/

pragma solidity ^0.4.21;

import "./EIP20Interface.sol";
import "./SafeMath.sol";

contract KookminSecurityToken is EIP20Interface {

    using SafeMath for uint256;
    
    uint256 constant private MAX_UINT256 = 2**256 - 1;
    uint256 public githubCount;
    uint256 public tokenCount;
    uint256 public githubDone;
    uint256 public tokenDone;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;
    mapping (uint256 => bytes32) public github;
    mapping (uint256 => address) public token;
    mapping (address => bytes32) public result;
    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
    string public name;                   // fancy name: Kookmin Security Token
    uint8 public decimals;                // How many decimals to show. I would choose 18.
    string public symbol;                 // KST
    
    // 1 ether = 50000 KST
    uint256 public constant RATE = 50000;
    
    address public owner;
    
    function () payable {
        createTokens();
    }

    function KookminSecurityToken(
        uint256 _initialAmount,
        string _tokenName,
        uint8 _decimalUnits,
        string _tokenSymbol
    ) public {
        balances[msg.sender] = _initialAmount;               // Give the creator all initial tokens
        totalSupply = _initialAmount;                        // Update total supply
        name = _tokenName;                                   // Set the name for display purposes
        decimals = _decimalUnits;                            // Amount of decimals for display purposes
        symbol = _tokenSymbol;                               // Set the symbol for display purposes
        owner = msg.sender;   // Owner is me!
        githubCount = 0;
        tokenCount = 0;
    }
    
    function createTokens() payable{
        require(msg.value > 0);
        
        uint256 tokens = msg.value.mul(RATE);
        balances[msg.sender] = balances[msg.sender].add(tokens);
        totalSupply = totalSupply.add(tokens);
        
        owner.transfer(msg.value);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value && _value > 0);
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && allowance >= _value && _value > 0);
        balances[_to] = balances[_to].add(_value);
        balances[_from] = balances[_from].sub(_value);
        if (allowance < MAX_UINT256) {
            allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        }
        emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
    
    function githubAnalysis(bytes32 _github) public returns (bool success) {
        githubCount = githubCount.add(1);
        github[githubCount] = _github;
        uint256 tokens = githubCount.add(tokenCount).add(1).sub(githubDone).sub(tokenDone);
        balances[msg.sender] = balances[msg.sender].add(tokens);
        totalSupply = totalSupply.add(tokens);
        
        return true;
    }
    
    function tokenAnalysis(address _token) public returns (bool success) {
        uint256 tokens = githubCount.add(tokenCount).add(1).sub(githubDone).sub(tokenDone);
        tokenCount = tokenCount.add(1);
        token[tokenCount] = _token;
        balances[msg.sender] = balances[msg.sender].add(tokens);
        totalSupply = totalSupply.add(tokens);
        
        return true;
    }
    
    function addTokenDone() public returns (bool success) {
        require(msg.sender == owner);
        tokenDone = tokenDone.add(1);
        return true;
    }
    
    function addGithubDone() public returns (bool success) {
        require(msg.sender == owner);
        githubDone = githubDone.add(1);
        return true;
    }
    
    function setResult(address _token, bytes32 _result) public returns (bool success) {
        require(msg.sender == owner);
        result[_token] = _result;
        return true;
    }
    
    function getResult(address _token) public view returns (bytes32 token_result) {
        return result[_token];
    }
    
    function getGithubCount() public view returns (uint256 github_Count) {
        return githubCount;
    }
    
    function getTokenCount() public view returns (uint256 token_Count) {
        return tokenCount;
    }
    
    function getGithub(uint256 num) public view returns (bytes32 github_address) {
        return github[num];
    }
    
    function getToken(uint256 num) public view returns (address token_address) {
        return token[num];
    }
    
}
