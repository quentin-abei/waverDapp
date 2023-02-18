import "./App.css";
import abi from "./utils/wave.json";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

function App() {
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [waves, setWaves] = useState([]);

  const contract_address = "0xD577A08a58a3DB4384dE53615F984ED6728f08F4";

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum != "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } else alert("please install metamask");
    } catch (error) {
      console.error(error);
    }
  };

  const wave = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contract_address, abi, signer);
    console.log("Going to wave");
    const tip = { value: ethers.utils.parseUnits("0.01") };
    const tx = await contract.waveAt(
      name ? name : "anon",
      message ? message : "I love your work",
      tip
    );
    setName("");
    setMessage("");
  };

  const getWaves = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contract_address, abi, provider);
    console.log("fetching");
    const tx = await contract.getWaves();
    setWaves(tx);
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
    // console.log(message);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  useEffect(() => {
    connectWallet();
    getWaves();
  }, []);

  return (
    <div className="App">
      <div className="navbar">
        <div className="logo">
          <h3>WEB3DAPP</h3>
        </div>

        <div className="connect_button">
          {account ? (
            <button className="connect">
              {account.slice(0, 6) + "..." + account.slice(38, 42)}
            </button>
          ) : (
            <button className="connect" onClick={connectWallet}>
              Connect
            </button>
          )}
        </div>
      </div>

      <div className="main">
        <div className="main_input">
        <div className="main_text">
            <h3>Wave at me for 0.01 ETH<br/> On Goerli Testnet </h3>
          </div>
          <form className="main_form">
            <input  className="main_holder" type="text" onChange={handleName} placeholder="Your name" />
            <input
            className="main_holder"
              type="text"
              onChange={handleMessage}
              placeholder="Your message"
            />
            <button className="main_button" type="button" onClick={wave}>
              Wave at me !
            </button>
          </form>
          
        </div>

        <div className="main_waves">
          <div className="card">
            {waves.map((wave, id) => {
              const { from, name, message } = wave;
              return (
                <div key={id} className="waves_info">
                  <p className="waves_text">
                    {message} &nbsp; from <span>{name}</span>
                  </p>
                  <p className="waves_text">{from}</p>                
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
