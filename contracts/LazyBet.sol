// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./lib/@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IERC20 {
  function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
  function transfer(address recipient, uint256 amount) external returns (bool);
  function balanceOf(address account) external view returns (uint256);
  function allowance(address _owner, address _spender) external view returns (uint256);
  function approve(address _spender, uint _value) external returns (bool success);
}

contract LazyBet is ReentrancyGuard {

  address public initiator; // Bet initiator
  address public judge; // Bet judge

  address public token; // Bet token
  uint public minValue; // Bet min value

  string public message; // Bet message
  uint public endTime; // Bet end time

  enum BetState { None, Open, Closed, Cancelled }

  struct Bet {
    uint value;
    uint8 bet; // 0: not bet, 1: bet true, 2: bet false
    bool isClaimed;
  }

  BetState public state; // Bet state

  address[] public participants; // Bet participants
  mapping(address => Bet) public bets; // Bet records

  uint[2] public betValues; // Bet values

  uint8 result; // Bet result

  modifier onlyInitiator() {
    require(msg.sender == initiator, "Only the initiator can perform this action");
    _;
  }

  modifier onlyJudge() {
    require(msg.sender == initiator, "Only the AI can perform this action");
    _;
  }

  event BetOpened(address indexed initiator, address token, uint minValue, string message, uint endTime, address judge);
  event BetCancelled(address indexed initiator);
  event BetPlaced(address indexed participant, uint value, uint8 bet);
  event BetResultSet(uint8 result, address indexed judge);
  event BetClaimed(address indexed participant, uint value);

  constructor() { }

  function open(
    address _initiator,
    address _token,
    uint _minValue,
    string memory _message,
    uint _endTime,
    address _judge
  ) public {
    require(state == BetState.None, "The bet is not open");

    initiator = _initiator;
    token = _token;
    minValue = _minValue;
    message = _message;
    endTime = _endTime;
    judge = _judge;

    state = BetState.Open;

    emit BetOpened(initiator, token, minValue, message, endTime, judge);
  }

  function cancel() public onlyInitiator {
    require(state == BetState.Open, "The bet is not open");
    state = BetState.Cancelled;

    emit BetCancelled(initiator);
  }

  function bet(bool _result, uint _value) public payable nonReentrant {
    require(state == BetState.Open, "The bet is not open");
    require(block.timestamp < endTime, "The bet has ended");
    require(_value >= minValue, "The bet value must be greater than minimum value");
    require(bets[msg.sender].value == 0, "The participant has already bet");

    _pay(_value);

    participants.push(msg.sender);

    bets[msg.sender].value = _value;
    bets[msg.sender].bet = _result ? 2 : 1;
    bets[msg.sender].isClaimed = false;

    betValues[_result ? 1 : 0] += _value;

    emit BetPlaced(msg.sender, _value, _result ? 2 : 1);
  }

  function setResult(uint8 _result) public onlyJudge {
    require(state == BetState.Open, "The bet is not open");
    require(result == 0, "The result has already been set");
    require(_result == 1 || _result == 2, "Invalid result");

    result = _result;
    state = BetState.Closed;

    uint _total = betValues[0] + betValues[1];
    uint fee = _total / 100;
    _fee(fee);

    emit BetResultSet(result, judge);
  }

  function claim() public nonReentrant {
    require(state == BetState.Closed || state == BetState.Cancelled, "The bet is not closed or cancelled");

    uint _value = bets[msg.sender].value;
    require(_value > 0, "The participant has not bet");

    if (state == BetState.Cancelled) {
      _claim(_value); // Return the bet value
    } else {
      require(bets[msg.sender].bet == result, "The participant has not won");
      require(!bets[msg.sender].isClaimed, "The participant has already claimed");

      uint _total = betValues[0] + betValues[1];
      require(betValues[result - 1] > 0, "Division by zero in claim calculation");

      bets[msg.sender].isClaimed = true;

      uint fee = _total / 100;
      _total -= fee;

      _claim(_total * _value / betValues[result - 1]); // Return the bet value
    }

    emit BetClaimed(msg.sender, _value);
  }

  function _pay(uint _value) internal {
    if (token == address(0)) {
      require(msg.value == _value, "Incorrect value");
    } else {
      IERC20(token).transferFrom(msg.sender, address(this), _value);
    }
  }

  function _claim(uint _value) internal {
    if (token == address(0)) {
      payable(msg.sender).transfer(_value);
    } else {
      IERC20(token).transfer(msg.sender, _value);
    }
  }

  // transfer fee to AI
  function _fee(uint _value) internal {
    if (token == address(0)) {
      payable(initiator).transfer(_value);
    } else {
      IERC20(token).transfer(initiator, _value);
    }
  }
}
