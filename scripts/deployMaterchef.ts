import { Address, beginCell, Cell, toNano } from '@ton/core';
import { Materchef, generateEntriesDictionary, InfoEntry } from '../wrappers/Materchef';
import { compile, NetworkProvider } from '@ton/blueprint';
import { JettonMinter } from '../wrappers/JettonMinter';
export async function run(provider: NetworkProvider) {
    const entries: InfoEntry = 
        {
            nftId: BigInt(0),
            owner_address_nft: Address.parse('UQCQOurVXARJMr-nTDVS34MFxLVC9onE4YV9d0s8xTCfGLXn'),
            collections: Address.parse('EQCChbRHW0KsJlSngnk3Ina7IX-mirSeamMJTG6wGIXv10xw'),
            level: BigInt(4),
            typeCard: BigInt(4),
            key: BigInt(hashStringToInt('UQCQOurVXARJMr-nTDVS34MFxLVC9onE4YV9d0s8xTCfGLXn')),

        };
        // int nftId = sl~load_uint(256);
        // slice owner_address_nft = sl~load_msg_addr();
        // slice collections = sl~load_msg_addr();
        // int level = sl~load_uint(32);
        // int typeCard = sl~load_uint(8);
        // int key = sl~load_uint(256);
    // const jettonMinterAddress = Address.parse('EQDqVwsEjdVoWlBitqpSENKx-IEz6SwHlM9xiDsmHB3tj-11'); // XG testnest
    // const jettonMinterAddress = Address.parse('EQBLpngRyPYjRpdy89FLkee0TjrBMXmXYdw8p8En713S4XsL'); // XG testnest
    // mainnet usdt EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs
    const jettonMinterAddress = Address.parse('EQAieaOpoxf7n4tVtjcSECAGUrcD2QMZJN7N8dGWR55s8kaT');
    const jettonMinter = provider.open(JettonMinter.createFromAddress(jettonMinterAddress));
    const materchef = provider.open(Materchef.createFromConfig({
        jetton_usdt:provider.sender().address as Address,
        owner_address:provider.sender().address as Address,
        monitor: provider.sender().address as Address,
        entries:entries,
        total_add: 0,
        budget:  2739726000000 // * decimal
    }, await compile('Materchef')));
    // await jettonMinter.getWalletAddressOf(claimReward.address)
    await materchef.sendDeploy(provider.sender(), toNano('0.05'),{jettonWallet: await jettonMinter.getWalletAddressOf(materchef.address), queryId:Date.now()});
    await provider.waitForDeploy(materchef.address);

    // run methods on `claimReward`
}
function hashStringToInt(str: string) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0; // Ensure the hash is a positive integer
}