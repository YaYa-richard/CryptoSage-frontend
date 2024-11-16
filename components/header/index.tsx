"use client"
import { cn } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter, usePathname } from "next/navigation";


export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    return
    // <div className=" w-full backdrop-blur-sm rounded-b-2xl drop-shadow-sm border-b">
    // //     <div className="flex justify-between py-4 container mx-auto ">
    // //         <div className="h-10 flex items-center px-4 bg-green-500">LOGO</div>
    // //         <div className="flex flex-row items-center text-xl font-bold gap-4 translate-x-1/2">
    // //             <div onClick={() => router.push("/")} className={cn(pathname === "/" ? "" : "text-gray-500", "cursor-pointer")}>Market</div>
    // //             <div onClick={() => router.push("/mine")} className={cn(pathname === "/mine" ? "" : "text-gray-500", "cursor-pointer")}>Mine</div>
    // //         </div>
    // //         <ConnectButton />
    // //     </div>
    // // </div>
}