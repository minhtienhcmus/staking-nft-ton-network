import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, Slice, TupleBuilder } from '@ton/core';
import { CollectionMint, MintValue } from './helpers/collectionHelpers';
import { encodeOffChainContent } from './helpers/content';
export type RoyaltyParams = {
    royaltyFactor: number;
    royaltyBase: number;
    royaltyAddress: Address;
};

export type NftCollectionConfig = {
    ownerAddress: Address;
    nextItemIndex: number;
    collectionContent: Cell;
    nftItemCode: Cell;
    royaltyParams: RoyaltyParams;
    monitor:Address;
    amount_monitor:bigint;
    stake_address: Address;
};

export type NftCollectionContent = {
    collectionContent: string;
    commonContent: string;
};

export function buildNftCollectionContentCell(data: NftCollectionContent): Cell {
    let contentCell = beginCell();

    let collectionContent = encodeOffChainContent(data.collectionContent);

    const commonContent = beginCell();
    commonContent.storeBuffer(Buffer.from(data.commonContent));
    // let commonContent = beginCell();
    // commonContent.storeStringTail(data.commonContent);

    contentCell.storeRef(collectionContent);
    contentCell.storeRef(commonContent.asCell());

    return contentCell.endCell();
}

// export type NftCollectionConfig = {};

export function nftCollectionConfigToCell(config: NftCollectionConfig): Cell {
    return beginCell()
        .storeAddress(config.ownerAddress)
        .storeUint(config.nextItemIndex, 64)
        .storeRef(config.collectionContent)
        .storeRef(config.nftItemCode)
        .storeRef(
            beginCell()
                .storeUint(config.royaltyParams.royaltyFactor, 16)
                .storeUint(config.royaltyParams.royaltyBase, 16)
                .storeAddress(config.royaltyParams.royaltyAddress)
        )
        .storeAddress(config.monitor)
        .storeCoins(config.amount_monitor)
        .storeAddress(config.stake_address)
        .endCell();
}

export class NftCollection implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new NftCollection(address);
    }

    static createFromConfig(config: NftCollectionConfig, code: Cell, workchain = 0) {
        const data = nftCollectionConfigToCell(config);
        const init = { code, data };
        return new NftCollection(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    async sendMintNft(provider: ContractProvider, via: Sender,
        opts: {
            value: bigint;
            queryId: number;
            itemIndex: number;
            itemOwnerAddress: Address;
            itemContent: string;
            amount: bigint;
            level:bigint;
            type: bigint;
            key: bigint;
        }
    ) {
        const nftMessage = beginCell();

      
        console.log("opts.itemOwnerAddress",opts.itemOwnerAddress);
        console.log("opts.itemContent",opts.itemContent);

        const nftContent = beginCell();
        nftContent.storeBuffer(Buffer.from(opts.itemContent));
        const info = beginCell();
        // level
        info.storeUint(opts.level,32);
        // //type
        info.storeUint(opts.type,8);
        // // //key
        info.storeUint(opts.key,128);
        nftMessage.storeAddress(opts.itemOwnerAddress);
        nftMessage.storeRef(nftContent);
        nftMessage.storeRef(info);

        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(1, 32)
                .storeUint(opts.queryId, 64)
                .storeUint(opts.itemIndex, 64)
                .storeCoins(opts.amount)
                .storeRef(nftMessage)
                .endCell(),
        });
    }
    
    async getInfoStackAddress(provider: ContractProvider) {
        const result = await provider.get('get_stake_address', []);
        console.log("====",result)
        let a = {
            init: result.stack.readAddress(),
            // index: result.stack.readBigNumber(),
            // collection_address: result.stack.readAddress(),
            // owner_address: result.stack.readAddress(),
            // content: this.readDataFromCell(result.stack.readCell())
        }
        return a;
    }

    async getCollectionData(provider: ContractProvider) {
        const result = await provider.get('get_collection_data', []);
        console.log("====",result)
        let a = {
            init: result.stack.readNumber(),
            // index: result.stack.readBigNumber(),
            // collection_address: result.stack.readAddress(),
            // owner_address: result.stack.readAddress(),
            // content: this.readDataFromCell(result.stack.readCell())
        }
        return a;
    }
    async getNftAddress(provider: ContractProvider, key: bigint):Promise<Address> {
        let builder = new TupleBuilder();
        console.log("key", key)
        builder.writeNumber(key)
        const result = await provider.get('get_nft_address_by_index', builder.build());
        console.log("====",result)
        // let a = {
        //     init: result.stack.readAddress(),
        //     // index: result.stack.readBigNumber(),
        //     // collection_address: result.stack.readAddress(),
        //     // owner_address: result.stack.readAddress(),
        //     // content: this.readDataFromCell(result.stack.readCell())
        // }
        return result.stack.readAddress();
    }
}
