import {Address, toNano } from '@ton/core';
import { NftCollection,buildNftCollectionContentCell } from '../wrappers/NftCollection';
import { compile, NetworkProvider } from '@ton/blueprint';
// MCS_06d36d1d68dea89ecde6145a
export async function run(provider: NetworkProvider) {
    // const nftCollection = provider.open(NftCollection.createFromConfig({}, await compile('NftCollection')));

    const metadata_collection ={
        "name": "Unicorn kingdom collection",
        "description": "Make your way from the unicorn to the Unicorn KING of the crypto Kingdom UAE.",
        "social_links": ["https://t.me/DucksOnTON"],
        "cover_image":"https://unicorn-kingdom.s3.amazonaws.com/0.jpg"
      }
    const metadataNft = {
        "name": "Unicorn",
        "description": "This is the second NFT item 1.",
        "image": "https://unicorn-kingdom.s3.amazonaws.com/1.jpg",
        "attributes": [
          {
            "trait_type": "Background",
            "value": "Red"
          },
          {
            "trait_type": "Eyes",
            "value": "Blue"
          }
        ]
      }
    const nftCollection = provider.open(NftCollection.createFromConfig({
        ownerAddress: provider.sender().address as Address,
        nextItemIndex: 0,
        collectionContent: buildNftCollectionContentCell(
            {
                collectionContent: 'https://23dbcc463339.acl.swanipfs.com/ipfs/QmNRnMQdbGSKbr7iFLiNY5xMbU8aV8tunAhDmA6VixzBmc',
                commonContent: 'https://unicorn-nft.s3.amazonaws.com/'
            }
        ),
       
        nftItemCode: await compile('NftItem'),
        royaltyParams: {
            royaltyFactor: 2,
            royaltyBase: 100,
            royaltyAddress: provider.sender().address as Address
        },
        monitor: Address.parse('UQAE_1nN08SFQBrDnqjyxgIfgZuWTb5_CHmYNlWLtGynN0tp'),
        amount_monitor:toNano("0.1"),
        stake_address: Address.parse('EQCcI4MhPKBdT-jEXTQEV7Ybfm3Ba0YPtcTN-j5LOM9gf2bo'),
    }, await compile('NftCollection')));
    await nftCollection.sendDeploy(provider.sender(), toNano('0.2'));
    await provider.waitForDeploy(nftCollection.address);
    // run methods on `nftCollection`
}
