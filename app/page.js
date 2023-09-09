"use client";
import Image from "next/image";
import Header from "./components/Header";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import contactabi from "./abi/abi.json";
const axios = require("axios");
const FormData = require("form-data");

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
        const myContractAddress = "0xe6b0f97e12177Ffe74c9E6c07E2f2a0887A4c22f";
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
    const file = e.target.files[0];
    setImage(file);
    console.log(file);
  }
  async function onSubmit(event) {
    if (!name && !description && !image) {
      alert("Fill the required details");
      return;
    }
    const JWT =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjYWYyNjJjNS1lZTU2LTQyZGYtODg3MS0zYzYzYTAxYTA0OTMiLCJlbWFpbCI6Im1pdHVuc2hpbDc0N0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNzljY2NhYmJmOGE0Y2RiMmFmOGUiLCJzY29wZWRLZXlTZWNyZXQiOiJmODg5NzE2MzViNzY0NGNlYzE4OGI2NzFlZTJiODZiODQ5MDMyMGI0MWIzZjYyNWQ3ODQ4NmNkYmQ2Yzg2NjYzIiwiaWF0IjoxNjk0MjUwMjc2fQ.1Urp80DzpKX7I0iTPgmWJ2j55SEYU0eWUAtTds8A5XA";
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", image);

    const pinataMetadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: "Bearer " + JWT,
          },
        }
      );

      const ipfshash = res.data.IpfsHash;
      try {
        const jsondic = {
          name,
          description,
          image: `ipfs/${ipfshash}`,
        };
        const resjson = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          jsondic,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + JWT,
            },
          }
        );
        const jasonHash = resjson.data.IpfsHash;
        const tokenURI = `https://ipfs.io/ipfs/${jasonHash}`;
        const conc = contract?.mintNFT(address, tokenURI);
        console.log("My own token ID:", conc);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
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
            <input type="file" onChange={onChangeValue} />
            <button
              className="bg-blue-400 px-4 py-2 rounded-lg"
              onClick={onSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
