import * as React from "react";
import logo from "./logo.svg";
import {ethers} from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";

import "./App.css";

const greeterAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const tokenAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

function App() {
  const [greeting, setGreetingValue] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  const [userAccount, setUserAccount] = React.useState("");

  const fetchGreeting = async () => {
    //check if window.ethereum is available
    if (typeof window.ethereum !== "undefined" && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      /// setup our contract
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        // get the value we are reading from the blockchain
        const data = await contract.greet();
        console.log("data: ", data);
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  const getBalance = async () => {
    //check if window.ethereum is available
    if (typeof window.ethereum !== "undefined" && window.ethereum) {
      // ensure wallet is connected
      // get available accounts
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      //setup provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //setup contract
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      //get balance
      const balance = await contract.balanceOf(account);
      //log balance
      console.log("balance is ", balance.toString());
    }
  };

  const sendCoins = async () => {
    //check if window.ethereum is available
    if (typeof window.ethereum !== "undefined" && window.ethereum) {
      // get access to wallet
      await requestAccount();
      // create a new signer so that we can actually write data to blockchain
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // create new instance of contract and pass the signer
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      // send the coins, pass the account and the amount
      const tx = await contract.transfer(userAccount, amount);
      // wait for it to succeed
      await tx.wait();
      // do something here
      console.log(`Sent ${amount} tokens to ${userAccount}`);
    }
  };

  const requestAccount = async () => {
    return await window.ethereum.request({method: "eth_requestAccounts"});
  };

  const setGreeting = async () => {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum); //create another provider
      const signer = provider.getSigner(); // away to get transaction so we need to sign the transaction using a signer
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer); // create a contract instance with a signer
      const transaction = await contract.setGreeting(greeting); // send the transaction

      setGreetingValue(""); // clear existing greeting and update ui
      await transaction.wait(); // waiting for transaction to be confirmed onto blockchain, test is fast, production is slow

      fetchGreeting(); // log the latest trasnaction value outputted by the contract
    }
  };

  return (
    <div className="App">
      <div className="wrapper">
        <h5>Basic greeting</h5>
        <div className="actions">
          <button type="button" onClick={fetchGreeting}>
            Fetch Greeting
          </button>
          <button type="button" onClick={setGreeting}>
            Set Greeting
          </button>
        </div>
        <input
          value={greeting}
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Enter greeting"
          required
        />
      </div>
      <div className="wrapper">
        <h5>Send coins and get balance</h5>
        <div className="actions">
          <button type="button" onClick={getBalance}>
            Get Balance
          </button>
          <button type="button" onClick={sendCoins}>
            Send Coins
          </button>
        </div>
        <div className="inputs">
          <input
            onChange={(e) => setUserAccount(e.target.value)}
            placeholder="Account ID"
            required
          />
          <input
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
          />
        </div>
      </div>
    </div>
  );
}

export default App;
