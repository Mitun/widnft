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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    async function initialize() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        setAddress(address);
        //setBalance(ethers?.utils?.parseEther(balance));
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

  function onChangeValue(e) {
    const file = e.target;
    setImage(file);
  }
  return (
    <main className="bg-orange-200">
      <div>
        <Header></Header>
        <div className="text-center py-16">
          <p className="text-md text-blue-400 lg:text-3xl">
            {address?.slice(0, 10)}...{address?.slice(-10)}
          </p>
          <p>NFT MarketPlace</p>
          <div className="flex flex-col space-y-2 mt-10  mx-[400px] bg-blue-200 px-10 pt-5 pb-5">
            <label>Name</label>
            <input
              className="border border-black px-2"
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <label>Description</label>
            <input
              className="border border-black px-2"
              type="text"
              placeholder="Enter Your Description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <label>Upload Image</label>
            <input type="file" value={image} onChange={onChangeValue} />
            <button className="bg-blue-400 px-4 py-2 rounded-lg ">
              Submit
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
