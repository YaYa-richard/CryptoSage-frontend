"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from 'lucide-react'
import { useRouter} from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {useEffect} from "react";


export default function ConnectedClaimPage() {
    const [claimed, setClaimed] = React.useState(false)
    const [pageState, setPage]=React.useState({
        topic: "",
        judge: "",
        yes: 0,
        no: 0
    })
    const router=useRouter();
    let data={
        topic:"Who will win the World Cup?",
        judge:"0x12345678",
        yes:0,
        no:0
    };
    const handleClaim = () => {
        router.push("/");
        setClaimed(true)
    }
    useEffect(() => {
        const Data = sessionStorage.getItem('betDetail');
        data = JSON.parse(Data);
        setPage(data)
    }, []); // 传入空数组，确保只在组件加载时执行一次

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