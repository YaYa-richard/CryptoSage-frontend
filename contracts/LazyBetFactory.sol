// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./LazyBet.sol";
import "./lib/@openzeppelin/contracts/access/Ownable.sol";

contract LazyBetFactory is Ownable {

  address[] public bets;

  bytes public lazyBetBytecode = type(LazyBet).creationCode;

  event BetCreated(address indexed betAddress, address indexed initiator);

  constructor() Ownable(msg.sender) {}

  function setLazyBetBytecode(bytes memory _lazyBetBytecode) external onlyOwner {
    lazyBetBytecode = _lazyBetBytecode;
  }

  // Function to create a new LazyBet contract
  function createBet(
    string memory _message, address _token, uint _minValue, address _judge, uint _endTime
  ) public returns (address) {
    bytes memory bytecode = lazyBetBytecode;

    require(bytecode.length != 0, "Bytecode cannot be empty");

    // Generate a unique salt using the length of bets array
    bytes32 salt = keccak256(abi.encodePacked(bets.length, msg.sender));

    // Deploy LazyBet contract with `create2`
    address betAddress;
    assembly {
      betAddress := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
      if iszero(extcodesize(betAddress)) { revert(0, 0) }
    }

    LazyBet newBet = LazyBet(betAddress);

    newBet.open(msg.sender, _token, _minValue, _message, _endTime, _judge);

    bets.push(betAddress);

    emit BetCreated(betAddress, msg.sender);

    return betAddress;
  }

  // Function to get the total number of bets
  function betsCount() public view returns (uint) {
    return bets.length;
  }

  // Function to get all bet addresses
  function allBets() public view returns (address[] memory) {
    address[] memory betAddresses = new address[](bets.length);
    for (uint i = 0; i < bets.length; i++) {
      betAddresses[i] = address(bets[i]);
    }
    return betAddresses;
  }
}
