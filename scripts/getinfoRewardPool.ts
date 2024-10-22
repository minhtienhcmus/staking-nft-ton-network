import { Address, toNano } from '@ton/core';
import { NetworkProvider, sleep } from '@ton/blueprint';

import { Materchef } from '../wrappers/Materchef';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('CampaignFactory address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const campaignFactory = provider.open(Materchef.createFromAddress(address));
    console.log("campaignFactory==");
    const getOwnerAddress = await campaignFactory.getInfoRewardPool();
    console.log("getOwnerAddress==",getOwnerAddress);
    // const getJettonAddress = await campaignFactory.getJettonAddress();
    // console.log("getJettonAddress==",getJettonAddress);
    // const getPoolAddress = await campaignFactory.getPoolAddress();
    // console.log("getPoolAddress==",getPoolAddress);
    // const counterBefore = await couter.getCounter();
    // let jettonMaster_address = Address.parse("EQB_3KNt8oOR3kOA6SwtFBsHI8iIBP68eytQuwL8S1sUNGYx");
    // await campaignFactory.sendCreateCampaign(provider.sender(), {
    //     jetton_wallet_aff: jettonMaster_address,
    //     // jetton_wallet_reward: jettonMaster_address,
    //     campaign_budget: toNano(200),
    //     // amount_reward: toNano(200),
    //     // type_campaign: BigInt(62),
    //     value: toNano('0.05'),
    // });
    // ui.write('Waiting for counter to increase...');

    // let counterAfter = await couter.getCounter();
    // let attempt = 1;
    // while (counterAfter === counterBefore) {
    //     ui.setActionPrompt(`Attempt ${attempt}`);
    //     await sleep(2000);
    //     counterAfter = await couter.getCounter();
    //     attempt++;
    // }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}