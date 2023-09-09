"use client";
import Image from "next/image";
import Header from "./components/Header";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import contactabi from "./abi/abi.json";

export default function Home() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function initialize() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        setAddress(address);
        setBalance(ethers.utils.parseEther(balance));
        myContractAddress = "0xE52a1C056a87A05472c86F626E5a76dab8061864";
        const contract = new ethers.Contract(
          myContractAddress,
          contactabi,
          signer
        );
        setContract(contract);
      }
    }
    initialize();
  }, []);
  return (
    <div>
      <Header></Header>
      <div className="text-center">
        <p className="text-md text-blue-400 lg:text-3xl">
          Hi {address?.slice(0, 10)}...{address?.slice(-10)}
        </p>
      </div>
    </div>
  );
}
