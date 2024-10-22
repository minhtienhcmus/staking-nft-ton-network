import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Materchef } from '../wrappers/Materchef';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Materchef', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Materchef');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let materchef: SandboxContract<Materchef>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        materchef = blockchain.openContract(Materchef.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await materchef.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: materchef.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and materchef are ready to use
    });
});
