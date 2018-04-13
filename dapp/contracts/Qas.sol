pragma solidity ^0.4.18;

contract ChainList {
  // state variables
  address seller;
  string name;
  string title;
  string content;
  uint256 price;

  // sell an article
  function sellArticle(string _name, string _title, string _content, uint256 _price) public {
    seller = msg.sender;
    name = _name;
    title = _title;
    content = _content;
    price = _price;
  }

  // get an article
  function getArticle() public view returns (
    address _seller,
    string _name,
    string _title,
    string _content,
    uint256 _price
  ) {
      return(seller, name, title, content, price);
  }
}
