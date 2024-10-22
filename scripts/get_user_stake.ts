import { Address, toNano } from '@ton/core';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { Materchef } from '../wrappers/Materchef';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('user  address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }
    // const key = BigInt(args.length > 0 ? args[0] : await ui.input('key input'));
    const affPool = provider.open(Materchef.createFromAddress(address));
    const key = BigInt(hashStringToInt("UQCurVvRb5OxkA0BffeL0I_i0I9USbsAu0SkC5bAdNmDBL0G"));
    console.log("userReward===",key)
    const userReward = await affPool.getUserStake(BigInt(4));
    // console.log("(provider.sender().address as Address).toString()",(provider.sender().address as Address).toString())
    console.log("userReward===",userReward)


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