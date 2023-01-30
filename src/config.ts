import Token from './ABI/ERC20Token.json';
import IDO from './ABI/IDO.json';
import Token721 from './ABI/Token721.json';
import Market from './ABI/Market.json';
// export let baseUrl:string = 'http://192.168.2.122:8600';
// export let baseUrl:string = 'http://47.107.116.172:8600';
// export let baseUrl: string = 'http://8.219.120.240:9001';
// export let baseUrl: string = 'http://192.168.2.116:8600';
export let baseUrl: string = 'http://47.107.116.172:8600';
export let Url: string = 'https://ipfs.featured.market/ipfs/QmQXNv3BwCUJ446RE82n7JiZSeBJa2ksjkhPZSd9SRM769';
interface abiObjType {
    [propName: string]: any;
}
interface contractAddressType {
    [propName: string]: string;
}
export const abiObj: abiObjType = {
    "Token": Token,
    "USDT": Token,
    "IDO": IDO,
    "NFT": Token721,
    "Market": Market,
    "Casting": Market,
    "Receive": Market,
    "MarketReceive": Market,
    "CastingReceive": Market,
    "JSGReceive": Market,
}
export const contractAddress: contractAddressType = {
    //正式
    // "USDT": "0x55d398326f99059ff775485246999027b3197955",
    // "NFT":"0x84E3C53A51Bf49c249B6D726fedA2E0fD03C5AdA",
    // "Market":"0x9cB6295aeC1B2bdfe5aEC3ba9DB70C01e9F6A2C7",
    // "Casting":"0xC3dAad1a2F12AF30E352b9bA60142D72b9C11F9b",
    // "Receive":"0x632e94414c5814B6A04283A4bE1ea148e97f6DB7",
    // "CastingReceive":"0x2ec141cb6b0ef9646a4c88fa073d76826a9dc91d",
    // "MarketReceive":"0x601D856859c2D447AF87F45BF62807EE835eb0B9",
    // "JSGReceive":"0x6BC4d5fc81464cD5a42d3A856f7617B706b79d67",
    //测试
    "USDT": "0x0d1CDEc8C2e14286Cf076094813A0428B1d74CF7",
    "NFT": "0x198ef8bbefffa8adaf77358f29c63822b4e37e69",
    "Market": "0x5C5E40E603094BC9A67Ee82b7dac0969f48e4783",
    "Casting": "0xb33Dd0b59B3246163F4912c090Afd990733D2432",
    "Receive": "0x2e565b56b9a09446da48192733ea4440fc99f18a",
    "CastingReceive": "0xc48b790649b1f6ccc4c65b8e00cb4a4aacc71768",
    "JSGReceive": "0x2695c06c3bc5f67a36212456060adb327c91279a",
    // 备份
    // "USDT": "0x0d1CDEc8C2e14286Cf076094813A0428B1d74CF7",
    // "NFT": "0x198ef8bbefffa8adaf77358f29c63822b4e37e69",
    // "Market": "0x75a653bB6DB505d97bd6D5224B18033a85a281C6",
    // "Casting": "0xb33Dd0b59B3246163F4912c090Afd990733D2432",
    // "Receive": "0x2e565b56b9a09446da48192733ea4440fc99f18a",
    // "CastingReceive": "0xc48b790649b1f6ccc4c65b8e00cb4a4aacc71768",
    // "JSGReceive": "0x2695c06c3bc5f67a36212456060adb327c91279a",
} 