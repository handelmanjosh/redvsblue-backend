import { Contract } from "ethers";
import { ethers } from "ethers";
import ABI from "./abi";

export const contractAddress = "0x16253E30B16Ef8B611718F2Fd871ef7801aa910b";

export async function addScore(index: number, points: number) {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const contract = new Contract(contractAddress, ABI, wallet);
    await contract.addPoints(index, points);
}