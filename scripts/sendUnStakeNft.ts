import { Address, toNano } from '@ton/core';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { NftItem } from '../wrappers/NftItem';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Nft  address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }
    const nftAddress = provider.open(NftItem.createFromAddress(address));
    
    await nftAddress.sendUnStakeNft(provider.sender(), 
        {
        value: toNano('0.1'),
        queryId: Date.now()});
    // const userReward = await nftAddress.getInfoNFT();
    // const userReward = await nftAddress.getInfoAddress();
    // const userReward = await nftAddress.getInfoStackAddress();
    // console.log("(provider.sender().address as Address).toString()",(provider.sender().address as Address).toString())
    // const hashInt = hashStringToInt((provider.sender().address as Address).toString());
    // console.log("userReward===",userReward)

    ui.write('Waiting for affPool to userReward...');

    // let counterAfter = await couter.getCounter();
    // let attempt = 1;
    // while (counterAfter === counterBefore) {
    //     ui.setActionPrompt(`Attempt ${attempt}`);
    //     await sleep(2000);
    //     counterAfter = await couter.getCounter();
    //     attempt++;
    // }

    ui.clearActionPrompt();
    ui.write('userReward affPool successfully!');
}
function hashStringToInt(str: string) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0; // Ensure the hash is a positive integer
}