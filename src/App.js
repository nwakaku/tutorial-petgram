import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/layout/navbar/Navbar";
import Footer from "./components/layout/footer/Footer";
import Home from "./components/home-container/home/Home";
import PetDetails from "./components/home-container/pet-details/PetDetails";
import CreatePet from "./components/create-post/CreatePet";
import Web3 from "web3";
import MyPet from "./abis/Pet.json";
import { useState } from "react";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { useWeb3React } from "@web3-react/core";

const CoinbaseWallet = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  appName: "Web3-react Demo",
  supportedChainIds: [80001],
});

function App() {
  // Add variables
  const [contractData, setContractData] = useState("");
  const { activate, deactivate, account } = useWeb3React();

  const loadWeb3 = async () => {
    // if (window.ethereum) {
    //   window.web3 = new Web3(window.ethereum);
    //   await window.ethereum.request({ method: "eth_requestAccounts" });
    // } else if (window.web3) {
    //   window.web3 = new Web3(window.web3.currentProvider);
    // } else {
    //   window.alert(
    //     "Non-Ethereum browser detected. You should consider trying Metamask!"
    //   );
    // }
    await activate(CoinbaseWallet);
  };

  const getContract = async () => {
    const web3 = new Web3(window.ethereum);
    // const accounts = await web3.eth.getAccounts();
    // setAccountat(accounts[0]);
    const networkId = 80001;
    // console.log(chainId);
    const networkData = MyPet.networks[networkId];

    if (networkData) {
      const abi = MyPet.abi;
      const address = MyPet.networks[networkId].address;
      console.log(address)
      // console.log(abi)
      const myContract = new web3.eth.Contract(abi, address);
      setContractData(myContract);
      console.log(myContract);
    } else {
      window.alert(
        "Contract is not deployed to the detected network. Connect to the correct network!"
      );
    }
  };



  // const loadWeb3 = async () => {
  //   if (window.ethereum) {
  //     window.web3 = new Web3(window.ethereum);
  //     await window.ethereum.request({ method: "eth_requestAccounts" });
  //   } else if (window.web3) {
  //     window.web3 = new Web3(window.web3.currentProvider);
  //   } else {
  //     window.alert(
  //       "Non-Ethereum browser detected. You should consider trying Metamask!"
  //     );
  //   }
  // };

  // const getContract = async () => {
  //   const web3 = window.web3;
  //   const accounts = await web3.eth.getAccounts();
  //   setAccount(accounts[0]);
  //   const networkId = await web3.eth.net.getId();
  //   const networkData = MyPet.networks[networkId];

  //   if (networkData) {
  //     const abi = MyPet.abi;
  //     const address = MyPet.networks[networkId].address;
  //     const myContract = new web3.eth.Contract(abi, address);
  //     setContractData(myContract);
  //   } else {
  //     window.alert(
  //       "Contract is not deployed to the detected network. Connect to the correct network!"
  //     );
  //   }
  // };

  const connectWallet = async () => {
    await loadWeb3();
    await getContract();
  };

  return (
    <Router>
      <div className="cl">
        <Navbar
          account={account}
          connectWallet={connectWallet} 
          deactivate={deactivate}
        />
        <Route exact path="/" component={Home} />
        <Switch>
          <Route exact path="/create-pet" component={CreatePet} />
          <Route path="/pet-details/:petId">
            <PetDetails account={account} contractData={contractData} />
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
