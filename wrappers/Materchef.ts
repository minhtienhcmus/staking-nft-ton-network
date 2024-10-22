import { Address, beginCell, Builder, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode, Slice, toNano, TupleBuilder } from '@ton/core';

export type MaterchefConfig = {
    jetton_usdt: Address,
    owner_address: Address,
    monitor: Address,
    entries: InfoEntry;
    total_add: number,
    budget: number
};

export function materchefConfigToCell(config: MaterchefConfig): Cell {
    let dict: Dictionary<bigint, InfoEntryDic> = Dictionary.empty(Dictionary.Keys.BigUint(256), infoEntryDic);
    // const dictCell = beginCell().storeDict(null).endCell();
    dict.set(config.entries.nftId, config.entries);
    // console.log("====",dictCell)
    return beginCell().storeAddress(config.jetton_usdt).storeAddress(config.owner_address).storeAddress(config.monitor).storeDict(dict).storeUint(config.total_add, 64).storeUint(config.budget, 64).endCell();
}

export class Materchef implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new Materchef(address);
    }

    static createFromConfig(config: MaterchefConfig, code: Cell, workchain = 0) {
        const data = materchefConfigToCell(config);
        const init = { code, data };
        return new Materchef(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint,opts:{
        jettonWallet: Address,
        queryId: number
    }) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().
            storeUint(1, 32)
            .storeUint(opts.queryId, 64)
            .storeAddress(opts.jettonWallet).endCell(),
        });
    }

    async getInfoRewardPool(provider: ContractProvider) {
        const result = await provider.get('get_reward_data', []);
        let a = {
            jetton_address: result.stack.readAddress(),
            owner_address: result.stack.readAddress(),
            monitor: result.stack.readAddress(),
            dic: result.stack.readCell(),
            total_add: result.stack.readBigNumber(),
            budget: result.stack.readBigNumber(),
        }
        return a;
    }

    async sendChangeOwner(
        provider: ContractProvider,
        via: Sender,
        opts: {
            newOwner: Address;
            value: bigint;
            queryId: number;
        }
    ) {
        // const nftContent = beginCell();
        // nftContent.storeBuffer(Buffer.from(opts.itemContent));

        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x21746f75, 32)
                .storeUint(opts.queryId, 64)
                .storeAddress(opts.newOwner)
                .endCell(),
        });
    }

    async sendChangeMonitor(
        provider: ContractProvider,
        via: Sender,
        opts: {
            newOwner: Address;
            value: bigint;
            queryId: number;
        }
    ) {
        // const nftContent = beginCell();
        // nftContent.storeBuffer(Buffer.from(opts.itemContent));

        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xa81f6ff3, 32)
                .storeUint(opts.queryId, 64)
                .storeAddress(opts.newOwner)
                .endCell(),
        });
    }
    async sendChangetokenAddress(
        provider: ContractProvider,
        via: Sender,
        opts: {
            newToken: Address;
            value: bigint;
            queryId: number;
        }
    ) {
        // const nftContent = beginCell();
        // nftContent.storeBuffer(Buffer.from(opts.itemContent));

        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x21746f77, 32)
                .storeUint(opts.queryId, 64)
                .storeAddress(opts.newToken)
                .endCell(),
        });
    }
    async sendChangeBudget(
        provider: ContractProvider,
        via: Sender,
        opts: {
            newBudget: bigint;
            value: bigint;
            queryId: number;
        }
    ) {
        // const nftContent = beginCell();
        // nftContent.storeBuffer(Buffer.from(opts.itemContent));

        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x21746f78, 32)
                .storeUint(opts.queryId, 64)
                .storeUint(opts.newBudget,64)
                .endCell(),
        });
    }
    async sendClaimTokenAdmin(
        provider: ContractProvider,
        via: Sender,
        opts: {
            amount: bigint;
            value: bigint;
            queryId: number;
        }
    ) {
        // const nftContent = beginCell();
        // nftContent.storeBuffer(Buffer.from(opts.itemContent));

        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x4b237978, 32)
                .storeUint(opts.queryId, 64)
                .storeUint(opts.amount,64)
                .endCell(),
        });
    }
    async sendClaimTonAdmin(
        provider: ContractProvider,
        via: Sender,
        opts: {
            amount: bigint;
            value: bigint;
            queryId: number;
        }
    ) {
        // const nftContent = beginCell();
        // nftContent.storeBuffer(Buffer.from(opts.itemContent));

        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x4b237979, 32)
                .storeUint(opts.queryId, 64)
                .storeUint(opts.amount,64)
                .endCell(),
        });
    }
    readDataFromCell(cell: Cell): any {
        // Convert the cell into a slice for reading
        const slice = cell.beginParse();

        // Read the first integer (42) with 32 bits
        const itemOwnerAddress = slice.loadAddress();
        console.log(`itemOwnerAddress value: ${itemOwnerAddress}`);

        // Read the second integer (256) with 16 bits
        const campaign_budget = slice.loadUint(64);
        console.log(`campaign_budget value: ${campaign_budget}`);

        const jetton_wallet_aff = slice.loadAddress();
        console.log(`jetton_wallet_aff value: ${jetton_wallet_aff}`);

        const type_campaign = slice.loadUint(8);
        console.log(`jetton_wallet_aff value: ${type_campaign}`);
        return { itemOwnerAddress, campaign_budget, jetton_wallet_aff, type_campaign };
    }
    async getUserStake(provider: ContractProvider, key: bigint): Promise<[Slice]> {
        let builder = new TupleBuilder();
        console.log("key", key)
        builder.writeNumber(key)
        const result = await provider.get('get_user_reward', builder.build());
        return [this.readDataFromCellKey(result.stack.readCell())];
    }
    async getJettonCanClaim(provider: ContractProvider, nftId: bigint) {
        let builder = new TupleBuilder();
        console.log("key", nftId)
        builder.writeNumber(nftId)
        const result = await provider.get('get_token_can_claim_by_NFT_id', builder.build());
        return result.stack.readNumber();
    }
    
    async getTokenRemain(provider: ContractProvider) {
        const result = await provider.get('get_token_remain', []);
        return result.stack.readNumber();
    }

    readDataFromCellKey(cell: Cell): any {
        // Convert the cell into a slice for reading
        const slice = cell.beginParse();
        // begin_cell().store_slice(owner_address_nft).store_uint(key_,128).store_uint(level,32)
        // .store_uint(typeCard,8).store_uint(1,1).store_uint(timestake,256).end_cell();
        // Read the first integer (42) with 32 bits
        const itemOwnerAddress = slice.loadAddress();
        // console.log(`itemOwnerAddress value: ${itemOwnerAddress}`);
        const collections = slice.loadAddress();
        // Read the second integer (256) with 16 bits
        const key = slice.loadUint(128);
        const level = slice.loadUint(32);
        const typeCard = slice.loadUint(8);
        const isStaking = slice.loadUint(1);
        const timestake = slice.loadUint(128);
        const total_claimed = slice.loadUint(128);
        // console.log(`jetton_wallet_aff value: ${type_campaign}`);
        return { itemOwnerAddress,collections, key ,level,typeCard,isStaking,timestake,total_claimed};
    }
    async sendAddRewardUser(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        opts: {
            queryId: number;
            // key: bigint;
            // value: Slice;
            // validUntil: bigint;
            // owner_address:  Address;
            // amount: bigint;
            entries: InfoEntry[];
        }
    ) {
        const dict = generateEntriesDictionary(opts.entries);
        const dictCell = beginCell().storeDict(dict).endCell();
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xfc889398, 32)
                .storeUint(opts.queryId, 64)
                // .storeUint(opts.key, 256)
                // .storeUint(opts.validUntil, 64)
                .storeRef(dictCell)
                .endCell(),
        });
    }
    async sendAddRewardAirdrop(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        opts: {
            queryId: number;
            // key: bigint;
            // value: Slice;
            // validUntil: bigint;
            // owner_address:  Address;
            // amount: bigint;
            entries: InfoEntry[];
        }
    ) {
        const dict = generateEntriesDictionary(opts.entries);
        const dictCell = beginCell().storeDict(dict).endCell();
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x4df6b26f, 32)
                .storeUint(opts.queryId, 64)
                // .storeUint(opts.key, 256)
                // .storeUint(opts.validUntil, 64)
                .storeRef(dictCell)
                .endCell(),
        });
    }
    async sendClaimReward(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        opts: {
            queryId: number;
            key: bigint;
            // value: Slice;
            // validUntil: bigint;
            // owner_address:  Address;
            // amount: bigint;
        }
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x855511cc, 32)
                .storeUint(opts.queryId, 64)
                .storeUint(opts.key, 256)
                // .storeUint(opts.validUntil, 64)
                .endCell(),
        });
    }
    async sendClaimRemain(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        opts: {
            queryId: number;
            // key: bigint;
            // value: Slice;
            // validUntil: bigint;
            // owner_address:  Address;
            // amount: bigint;
        }
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x4b237977, 32)
                .storeUint(opts.queryId, 64)
                // .storeUint(opts.validUntil, 64)
                .endCell(),
        });
    }
}
export type InfoEntry = {
    nftId: bigint;
    owner_address_nft: Address;
    collections: Address;
    level: bigint;
    typeCard: bigint;
    key: bigint;
};

export type InfoEntryDic = {
    owner_address_nft: Address;
    collections: Address;
    level: bigint;
    typeCard: bigint;
    key: bigint;
};
export const infoEntryValue = {
    serialize: (src: InfoEntry, buidler: Builder) => {
        buidler.storeUint(src.nftId, 256).storeAddress(src.owner_address_nft).storeAddress(src.collections).storeUint(src.level, 32).storeUint(src.typeCard, 8).storeUint(src.key, 128);
    },
    parse: (src: Slice) => {
        return {
            nftId: BigInt(src.loadUint(256)),
            owner_address_nft: src.loadAddress(),
            collections: (src.loadAddress()),
            level: BigInt(src.loadUint(32)),
            typeCard: BigInt(src.loadUint(8)),
            key: BigInt(src.loadUint(128)),
        };
    },
};
export const infoEntryDic = {
    serialize: (src: InfoEntry, buidler: Builder) => {
        buidler.storeAddress(src.owner_address_nft).storeAddress(src.collections).storeUint(src.level, 32).storeUint(src.typeCard, 8).storeUint(src.key, 128);
    },
    parse: (src: Slice) => {
        return {
            owner_address_nft: src.loadAddress(),
            collections: (src.loadAddress()),
            level: BigInt(src.loadUint(32)),
            typeCard: BigInt(src.loadUint(8)),
            key: BigInt(src.loadUint(128))
        };
    },
};
export function generateEntriesDictionary(entries: InfoEntry[]): Dictionary<bigint, InfoEntry> {
    let dict: Dictionary<bigint, InfoEntry> = Dictionary.empty(Dictionary.Keys.BigUint(256), infoEntryValue);

    for (let i = 0; i < entries.length; i++) {
        dict.set(BigInt(i), entries[i]);
    }
 
    return dict;
}
