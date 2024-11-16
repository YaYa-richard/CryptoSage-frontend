"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from 'lucide-react'
import { useRouter} from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {useEffect, useState} from "react";
import {ethers} from "ethers";
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

export default function ConnectedClaimPage() {
    const [claimed, setClaimed] = React.useState(false)
    const [isVisible, setIsVisible] = useState(false);
    const [opacity, setOpacity] = useState(0);
    const [pageState, setPage]=React.useState({
        topic:"",
        end:0,
        yes:0,
        no:0
    })
    let contractAddress:string;
    const router=useRouter();
    let data={
        topic:"Who will win World Cup?",
        end:0,
        yes:0,
        no:0
    };
    const handleClaim = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner()
        contractAddress = sessionStorage.getItem('contractAddress')
        console.log("合约地址:",contractAddress)
        const contract = new ethers.Contract(contractAddress, LAZY_BET_ABI, signer);
        contract.claim();
        //showModal();

        router.push("/");
        setClaimed(true)
    }
    useEffect(() => {
        const Data = sessionStorage.getItem('pageData');
        contractAddress = sessionStorage.getItem('contractAddress')
        data = JSON.parse(Data);
        setPage(data)
    }, []); // 传入空数组，确保只在组件加载时执行一次
    // 显示弹窗
    const showModal = () => {
        setIsVisible(true);
        setOpacity(0); // 重置为透明
    };

    // 隐藏弹窗
    const hideModal = () => {
        setOpacity(0);
        setTimeout(() => setIsVisible(false), 500); // 等待动画结束后隐藏弹窗
    };

    // 控制渐显动画
    useEffect(() => {
        if (isVisible) {
            const fadeInInterval = setInterval(() => {
                setOpacity(prev => {
                    if (prev < 1) {
                        return prev + 0.05; // 每次增加 0.05
                    } else {
                        clearInterval(fadeInInterval);
                        return 1;
                    }
                });
            }, 30); // 每 30 毫秒增加透明度
        }
    }, [isVisible]);
    return (
        <div className="min-h-screen bg-background p-4">
            <div className="mx-auto max-w-2xl">
                <header className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Wallet className="h-6 w-6" />
                        <h1 className="text-xl font-bold">CryptoSage</h1>
                    </div>
                    <ConnectButton/>
                </header>

                <div className="grid gap-6">
                    {isVisible && (
                        <div
                            style={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                padding: '20px',
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                opacity: opacity, // 动画控制透明度
                                transition: 'opacity 0.5s ease-in-out',
                            }}
                        >
                            <h2>弹窗标题</h2>
                            <p>这是一个简单的弹窗示例。</p>
                            <button onClick={hideModal}>关闭</button>
                        </div>
                    )}

                    {isVisible && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                zIndex: 999, // 确保遮罩层位于弹窗下方
                            }}
                        />
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Bet on the Outcome</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Topic: {pageState.topic}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Judge: {pageState.judge}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Bet Token</span>
                                    <span>USDC</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Bet Placed</span>
                                    <span>Outcome - Yes</span>
                                </div>
                                {!claimed ? (
                                    <div className="space-y-4">
                                        <p className="text-lg font-medium">
                                            You won 0.6 USDC!
                                        </p>
                                        <Button className="w-full" onClick={handleClaim}>
                                            Claim
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-lg font-medium">
                                        Claimed 0.6 USDC!
                                    </p>
                                )}
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