import * as React from "react";
import logo from "./logo.svg";
import {ethers} from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

import "./App.css";

const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function App() {
  const [greeting, setGreetingValue] = React.useState("");

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
      <h3>Simple Ethereum Greeting</h3>
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
  );
}

export default App;
