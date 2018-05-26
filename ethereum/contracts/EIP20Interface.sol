pragma solidity ^0.4.18;

contract EIP20Interface {
    //uint256 public totalSupply;
    function transfer(address _to, uint256 _value) public returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event LogRegistQuestion(uint indexed _id, address indexed _author, string _title);
    event LogRegistAnswer(uint indexed _id, uint indexed _question_id, address indexed _author, string _title, bool _choose);
    event LogChooseAnswer(uint indexed _question_id, uint indexed _answer_id, address indexed _answer_author);
    event LogRewardAnswer(uint indexed _answer_id, address indexed _answer_author, bool _choose, uint256 _reward);
}
