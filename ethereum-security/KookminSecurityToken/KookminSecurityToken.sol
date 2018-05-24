pragma solidity ^0.4.21;

import "./EIP20Interface.sol";
import "./SafeMath.sol";

contract KookminSecurityToken is EIP20Interface {
    using SafeMath for uint256;
    uint256 constant private MAX_UINT256 = 2**256 - 1;
    uint256 public tokenCount;
    uint256 public tokenDone;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;
    mapping (uint256 => address) public token;
    mapping (address => bytes32) public token_result;
    string public name;                   // fancy name: Kookmin Security Token
    uint8 public decimals;                // How many decimals to show. I would choose 18.
    string public symbol;                 // KST
    uint256 public constant RATE = 50000;
    address public owner;
    function () payable {
        createTokens();
    }
    function KookminSecurityToken() public {
        balances[msg.sender] = 1000000;               // Give the creator all initial tokens
        totalSupply = 1000000;                        // Update total supply
        name = "Kookmin Security Token";                                   // Set the name for display purposes
        decimals = 18;                            // Amount of decimals for display purposes
        symbol = "KST";                               // Set the symbol for display purposes
        owner = msg.sender;   // Owner is me!
        tokenCount = 0;
        tokenDone = 0;
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
    function analysis(address _token) public returns (bool success) {
        uint256 tokens = tokenCount.add(1).sub(tokenDone);
        tokenCount = tokenCount.add(1);
        token[tokenCount] = _token;
        balances[msg.sender] = balances[msg.sender].add(tokens);
        totalSupply = totalSupply.add(tokens);

        return true;
    }
    function setResult(address _token, bytes32 _result) public returns (bool success) {
        require(msg.sender == owner);
        token_result[_token] = _result;
        tokenDone = tokenDone.add(1);
        return true;
    }
    function getEmail
    function getResult(address _token) public view returns (bytes32 _token_result) {
        return token_result[_token];
    }
    function getTokenCount() public view returns (uint256 token_count) {
        return tokenCount;
    }
    function getTokenDoneCount() public view returns (uint256 token_done_count) {
        return tokenDone;
    }
    function getSmartContract(uint256 num) public view returns (address token_address) {
        return token[num];
    }
}
