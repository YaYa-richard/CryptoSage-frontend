"use client"
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from 'lucide-react'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter} from "next/navigation";
import {ethers, parseEther} from "ethers";
import {useEffect, useState} from "react";
import lighthouse from "@lighthouse-web3/sdk"

import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  IndexService
} from "@ethsign/sp-sdk";
import * as test from "node:test";
import {color, fontStyle} from "@mui/system";
import {white} from "next/dist/lib/picocolors";

export default function UnconnectedWalletPage() {

//   const delegationPrivateKey = "0xaaaaa";
  // Create schema
  async function createSchema(feedbackDetails:string){
    const accounts=await window.ethereum.request({ method: 'eth_accounts' });
    const client = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.sepolia,
      account:accounts[0]
    });

    const SchemaRes = await client.createSchema({
      name: "feedback_schema",
      data: [{
        name: feedbackDetails,
        type: accounts[0]
      }],
    });

    const AttestationRes = await client.createAttestation({
      schemaId: SchemaRes.schemaId,
      data: {
        contractDetails: feedbackcomment,
        accounts: [accounts[0]]
      },
      indexingValue: accounts[0].toLowerCase()
    });
    return AttestationRes;
  }
  const [selectedOption, setSelectedOption] = React.useState<string>("yes");
  const [pageState, setPage]=React.useState({
    topic: "",
    end: 0,
    yes: 0,
    no: 0
  })
  const [feedbackSelection, setFeedbackSelection] = React.useState<string>("1")
  const [feedbackValidation, setValidation] = React.useState<string>("")
  const [contractAddress, setAddress] = useState('');
  const [feedbackcomment, setComment] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const LAZY_BET_ABI=[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "initiator",
          "type": "address"
        }
      ],
      "name": "BetCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "participant",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "BetClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "initiator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minValue",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "judge",
          "type": "address"
        }
      ],
      "name": "BetOpened",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "participant",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "bet",
          "type": "uint8"
        }
      ],
      "name": "BetPlaced",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "result",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "judge",
          "type": "address"
        }
      ],
      "name": "BetResultSet",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_result",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "bet",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "betValues",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "bets",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "bet",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "isClaimed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cancel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "endTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "initiator",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "judge",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "message",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minValue",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_initiator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_minValue",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_message",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_endTime",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_judge",
          "type": "address"
        }
      ],
      "name": "open",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "participants",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "_result",
          "type": "uint8"
        }
      ],
      "name": "setResult",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "state",
      "outputs": [
        {
          "internalType": "enum LazyBet.BetState",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "token",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const router=useRouter();
  let contract: ethers.Contract;
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  }
  const handleFeedbackSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeedbackSelection(event.target.value);
  }
  let data={
    topic:"Who will win World Cup?",
    end:0,
    yes:0,
    no:0
  }
  useEffect(() => {
    // 每秒更新一次时间
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);

    // 清理定时器
    return () => clearInterval(interval);
  }, []);

  async function makingBet() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        console.log("钱包已连接，地址为：", accounts[0]);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        contract = new ethers.Contract(contractAddress, LAZY_BET_ABI, signer);

        const op=selectedOption == "yes"
        console.log("op:",op);
        if(currentTime<pageState.end){
          //const value=parseEther("1")
          const value=BigInt(10 ** 18);
          const transaction = await contract.bet(selectedOption == "yes", value);
          await transaction.wait();
          router.push("/HavingBet");
        }
        else{
          console.log("当前时间：",currentTime);
          console.log("截止日期：",pageState.end);
          let s = await contract.state();
          if(Number(s)==2){
            router.push("/FinishBet");
          }
        }
      } else {
        console.log("钱包未连接");
      }
    } else {
      console.log("钱包未检测到");
    }
  }

  async function renderBet(){
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner()
    console.log("合约地址:",contractAddress)
    contract = new ethers.Contract(contractAddress, LAZY_BET_ABI, signer);

    data.topic=await contract.message();
    const time=await contract.endTime();
    const yes_count=await contract.betValues(0);
    const no_count=await contract.betValues(1);
    data.end=Number(time)*1000;
    data.yes = Number(yes_count);
    data.no=Number(no_count);

    sessionStorage.setItem('contractAddress',contractAddress);
    sessionStorage.setItem('pageData', JSON.stringify(data));

    let s = await contract.state();
    console.log(s);
    if(Number(s)==2){
      router.push("/FinishBet");
    }
    else{
      // 调用合约中的 message 函数获取信息
      setPage(data);
    }
  }

  async function submitFeedback(){
    const fb={
      fs:feedbackSelection,
      fc:feedbackcomment
    }

    setValidation("Thanks! You will get ERC 20 rewards!")

    const feedbackText = JSON.stringify(fb); // change the path of your file
    const APIKey = '26f08469.b1676dfe1bc54ee78657d230fd94de6e';// the API key from the lighthouse account
    const uploadResponse = await lighthouse.uploadText(feedbackText, APIKey);
    //const attestationRes = await createSchema(feedbackText);
    console.log(uploadResponse);
    //console.log(attestationRes);
  }

  // 处理输入框内容变化的函数
  const handleInputChange = (event:string) => {
    setAddress(event.target.value);  // 更新输入框的值
  };

  const handleFeedbackComment=(event:string) => {
    setComment(event.target.value);  // 更新输入框的值
  };


  return (
      <div className="min-h-screen bg-background p-4">
        <div className="mx-auto max-w-2xl">
          <header className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              <h1 className="text-xl font-bold">CryptoSage</h1>
            </div>
            <input
                placeholder={"Your bet address:"}
                value={contractAddress}
                onChange={handleInputChange}
            />
            <button onClick={renderBet}>Search</button>
            < ConnectButton chainStatus="full"/>
          </header>

          <div className="grid gap-6">

            <Card>
              <CardHeader>
                <CardTitle>Bet on the Outcome</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Topic:{pageState.topic}
                </p>
                <p className="text-xs text-muted-foreground">
                  End Time:{pageState.end}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Radio buttons for Yes/No options */}
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                          type="radio"
                          id="yes"
                          name="betOption"
                          value="yes"
                          checked={selectedOption === "yes"}
                          onChange={handleOptionChange}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="yes" className="text-sm font-medium text-gray-700">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                          type="radio"
                          id="no"
                          name="betOption"
                          value="no"
                          checked={selectedOption === "no"}
                          onChange={handleOptionChange}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="no" className="text-sm font-medium text-gray-700">No</label>
                    </div>
                  </div>
                  <button
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                      disabled={selectedOption === ""}

                      onClick={makingBet}
                      >
                    Bet
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
              <div className="space-y-2">
                  <h3 className="font-medium">Number of Bets</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Yes: {pageState.yes}</div>
                    <div>No: {pageState.no}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Minimum Bet Size: 1 USDC
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Provide Feedback and get ERC 20</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Radio buttons for Yes/No options */}
                  <div>
                    How fair do you believe this market is for all users?(1 = very unfair, 5 = very fair)
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                          type="radio"
                          id="1"
                          name="rateOption"
                          value="20"
                          onChange={handleFeedbackSelection}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="yes" className="text-sm font-medium text-gray-700">1</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                          type="radio"
                          id="2"
                          name="rateOption"
                          value="40"
                          onChange={handleFeedbackSelection}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="yes" className="text-sm font-medium text-gray-700">2</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                          type="radio"
                          id="3"
                          name="rateOption"
                          value="60"
                          onChange={handleFeedbackSelection}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="yes" className="text-sm font-medium text-gray-700">3</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                          type="radio"
                          id="4"
                          name="rateOption"
                          value="80"
                          onChange={handleFeedbackSelection}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="yes" className="text-sm font-medium text-gray-700">4</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                          type="radio"
                          id="5"
                          name="rateOption"
                          value="100"
                          onChange={handleFeedbackSelection}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="yes" className="text-sm font-medium text-gray-700">5</label>
                    </div>
                  </div>
                  <div>
                    Please explain your reasoning.
                  </div>
                  <div>
                    <input
                        placeholder={"Your answer:"}
                        value={feedbackcomment}
                        onChange={handleFeedbackComment}
                    />
                    <h2>
                      {feedbackValidation}
                    </h2>

                  </div>

                  <button
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                      disabled={selectedOption === ""}

                      onClick={submitFeedback}
                  >
                    Submit
                  </button>
                </div>
              </CardContent>
            </Card>

          </div>

          <footer className="mt-8 pt-4 border-t flex justify-between text-sm text-muted-foreground">
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Contact Us</a>
          </footer>
        </div>
      </div>
  )
}