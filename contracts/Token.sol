//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0; // set solidity version

import "hardhat/console.sol"; // ability to use console.log on hardhat

contract Token {
    string public name = "Nader Dabit Token"; // give the token a name
    string public symbol = "NDT"; /// symbol of the token
    uint256 public totalSupply = 1000000; // supply of the token
    address public owner;
    mapping(address => uint256) balances; // mapping of address to balance, like an object in javascript, key is address and value is of type uint

    constructor() {
        // balance of the person that deployed the contract to be equal to the total supply set above
        // msg.sender is set automatically to be available in the context of that contract
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    // transfer to an address a number of tokens
    function transfer(address to, uint256 amount) external {
        // step1: check the balance of the sender to be greater than the amount they are trying to send
        require(balances[msg.sender] >= amount, "Insufficient balance");
        // step2: subtract the amount from the sender's balance
        balances[msg.sender] -= amount;
        // step3: add/transfer the amount to the receiver's balance
        balances[to] += amount;
    }

    // pass address and it returns balance of that address
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
