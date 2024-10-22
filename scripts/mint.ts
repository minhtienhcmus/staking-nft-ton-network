import { Address, toNano } from '@ton/core';
import { NftCollection } from '../wrappers/NftCollection';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
  const ui = provider.ui();
  const ownerAddress = provider.sender().address as Address;;
  // const friendlyAddress = ownerAddress.toString({
  //   testOnly: true,
  //   bounceable: false,
  // });
  const origin_ownerAddress = ownerAddress.toString({bounceable:false,testOnly:true});
  const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Collection address'));
  // console.log(Address.parse('0QClNXF3kqclvxHMuH4NR46quXQQkHhBVoXDB4hyUTeXzpV5'));
  console.log(origin_ownerAddress);
  const nftCollection = provider.open(NftCollection.createFromAddress(address));

  const metadataNft = {
    "name": "Unicorn 01",
    "description": "This is the second NFT item 1.",
    "image": "https://ipfs.io/ipfs/QmbvTLYnuoBpEXVYg5Us6XFzNUiYQj6ocmnvWyBi75PmTA",
  }
  function hashStringToInt(str: string) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0; // Ensure the hash is a positive integer
  }

  await nftCollection.sendMintNft(provider.sender(), {
    value: toNano('0.2'),
    amount: toNano('0.05'),
    itemIndex: 3,
    itemOwnerAddress: provider.sender().address as Address,
    itemContent: 'e99265ab-5ef6-4014-8127-fa837ac1222e.json',
    queryId: Date.now(),
    level: BigInt(25),
    type:BigInt(4),
    key: BigInt(hashStringToInt(origin_ownerAddress))
  });
//EQDqQe8uTY2TSgRrPuaXhPIIOWlpuryovqs5khPmo-79x9ow
//https://lavender-reasonable-rat-162.mypinata.cloud/ipfs/QmUoTzbgqPHe5X3KF9YSttYgsbb3ThtHS3YkCqi5jMYTsc
//https://lavender-reasonable-rat-162.mypinata.cloud/ipfs/QmSy2pVJc1ZtVBJAp3LNaQeg77XhR5mkvKKc8UHZKVfZvs
  ui.write('Nft item deployed successfully!');
}
