import {ethers} from 'ethers';
import "dotenv/config";
const ExcuteABI =  require("../artifacts/contracts/Error/EIP838.sol/ExcuteContract.json");
const ErrorABI = require("../artifacts/contracts/Error/EIP838.sol/ErrorContract.json");

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER!);
    const admin = new ethers.Wallet(process.env.ADMIN_KEY!,provider);

    const ExcuteFactory = new ethers.ContractFactory(ExcuteABI.abi,ExcuteABI.bytecode,admin);
    const ErrorFactory = new ethers.ContractFactory(ErrorABI.abi,ErrorABI.bytecode,admin);
    const ErrorContract = await ErrorFactory.deploy();
    const ExcuteContract = await ExcuteFactory.deploy(ErrorContract.address);

    const case1 = ErrorFactory.interface.encodeFunctionData('ping',[0]) // require("Require Case 0")
    const case2 = ErrorFactory.interface.encodeFunctionData('ping',[1]) // revert("Require Case 1")
    const case3 = ErrorFactory.interface.encodeFunctionData('ping',[2]) // revert RevertCase2(2,"Custom Error Case 3")
    const case4 = ErrorFactory.interface.encodeFunctionData('ping',[3]) // SUCCESS CASE
    
    // Revert tx와 Success tx 구분 물어보기
    try {
        const tx = await ExcuteContract.excute(case1);
        await tx.wait();
        console.log("SUCCESS");
    } catch (error:any) {
        // console.log(JSON.stringify(error))
        console.log("FAIL");
    }

    const result = await ExcuteContract.a();
    console.log(result);
    
}

main();