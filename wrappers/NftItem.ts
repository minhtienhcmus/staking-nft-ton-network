import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type NftItemConfig = {};

export function nftItemConfigToCell(config: NftItemConfig): Cell {
    return beginCell().endCell();
}

export class NftItem implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftItem(address);
    }

    static createFromConfig(config: NftItemConfig, code: Cell, workchain = 0) {
        const data = nftItemConfigToCell(config);
        const init = { code, data };
        return new NftItem(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
    async sendStakeNft(provider: ContractProvider, via: Sender,
        opts: {
            value: bigint;
            queryId: number;
            // itemIndex: number;
            // itemOwnerAddress: Address;
            // itemContent: string;
            // amount: bigint;
            // level:bigint;
            // type: bigint;
            // key: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x511a4466, 32)
                .storeUint(opts.queryId, 64)
                // .storeUint(opts.itemIndex, 64)
                // .storeCoins(opts.amount)
                // .storeRef(nftMessage)
                .endCell(),
        });
    }
    async sendUnStakeNft(provider: ContractProvider, via: Sender,
        opts: {
            value: bigint;
            queryId: number;
            // itemIndex: number;
            // itemOwnerAddress: Address;
            // itemContent: string;
            // amount: bigint;
            // level:bigint;
            // type: bigint;
            // key: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x511a4467, 32)
                .storeUint(opts.queryId, 64)
                // .storeUint(opts.itemIndex, 64)
                // .storeCoins(opts.amount)
                // .storeRef(nftMessage)
                .endCell(),
        });
    }

    async sendHarVestNft(provider: ContractProvider, via: Sender,
        opts: {
            value: bigint;
            queryId: number;
            itemIndex: number;
            key: bigint;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x511a4468, 32)
                .storeUint(opts.queryId, 64)
                .storeUint(opts.itemIndex, 256)
                .storeUint(opts.key,128)
                // .storeRef(nftMessage)
                .endCell(),
        });
    }
    
    async getInfoNFT(provider: ContractProvider) {
        const result = await provider.get('get_nft_data', []);

        let a = {
            init: result.stack.readBigNumber(),
            index: result.stack.readBigNumber(),
            collection_address: result.stack.readAddress(),
            owner_address: result.stack.readAddress(),
            content: this.readDataFromCell(result.stack.readCell())
        }
        return a;
    }
    async getInfoStackAddress(provider: ContractProvider) {
        const result = await provider.get('get_address_stake', []);
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
    async getInfoAddress(provider: ContractProvider) {
        const result = await provider.get('get_data_info', []);
        console.log("====",result)
        let a = {
            // init: result.stack.readAddress(),
            // index: result.stack.readBigNumber(),
            // collection_address: result.stack.readAddress(),
            // owner_address: result.stack.readAddress(),
            content: this.readDataInfoFromCell(result.stack.readCell())
        }
        return a;
    }
    
    async getInfoStatusStaking(provider: ContractProvider) {
        const result = await provider.get('is_staking_status', []);
        let a = {
            init: result.stack.readNumber()
        }
        return a;
    }
    
    async getInfoOwnerAddress(provider: ContractProvider) {
        const result = await provider.get('get_owner_address', []);
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
    readDataFromCell(cell: Cell): any {
        // Convert the cell into a slice for reading
        const slice = cell.beginParse();
        console.log("=slice===",slice);
    // Read the buffer from the slice
    const itemContentBuffer = slice.loadBuffer(slice.remainingBits / 8);
    // const level = slice.loadUint(32);
    // const type = slice.loadUint(8);
    // const key = slice.loadUint(128);
    // Convert the buffer to a string (assuming itemContent was a string)
    const itemContent = itemContentBuffer.toString('utf-8');
        // Read the first integer (42) with 32 bits
        // const itemOwnerAddress = slice.();
        // console.log(`itemOwnerAddress value: ${slice.loadAddress()  }`);
    
        // Read the second integer (256) with 16 bits
        
        // console.log(`jetton_wallet_aff value: ${itemContent}`);
        return {itemContent};
    }
    readDataInfoFromCell(cell: Cell): any {
        // Convert the cell into a slice for reading
        const slice = cell.beginParse();
        console.log("=slice===",slice);
    // Read the buffer from the slice
    // const itemContentBuffer = slice.loadBuffer(slice.remainingBits / 8);
    const level = slice.loadUint(32);
    const type = slice.loadUint(8);
    const key = slice.loadUint(128);
    // Convert the buffer to a string (assuming itemContent was a string)
    // const itemContent = itemContentBuffer.toString('utf-8');
        // Read the first integer (42) with 32 bits
        // const itemOwnerAddress = slice.();
        // console.log(`itemOwnerAddress value: ${slice.loadAddress()  }`);
    
        // Read the second integer (256) with 16 bits
        
        // console.log(`jetton_wallet_aff value: ${itemContent}`);
        return {level,type,key};
    }
}
