import { useCallback, useMemo } from 'react'
//（连接钱包）
import { InjectedConnector, NoEthereumProviderError, UserRejectedRequestError } from '@web3-react/injected-connector'
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract';
import { provider } from 'web3-core';
import Web3 from 'web3'
import { abiObj, contractAddress } from './config'
import BigNumber from 'big.js'
//NE：在转换为字符串时展示为科学计数法的最小小数位数。默认值是-7，即小数点后第7为才开始不是0。
//PE：在转换为字符串时展示位科学计数法的最小整数位数。默认值是21，即数字长度超过21位。
BigNumber.NE = -40
BigNumber.PE = 40
//declare就是告诉TS编译器你担保这些变量和模块存在，并声明了相应类型，编译的时候不需要提示错误！
//在.d.ts文件里如果顶级声明不用export的话，declare和直接写type、interface效果是一样的，在其他地方都可以直接引用 
//告诉TS编译器你担保这些变量和模块存在，并声明了相应类型，编译的时候不需要提示错误！
declare let window: any;
interface contractType {
    [propName: string]: Contract;
}
export const ChainId = {
    // BSC: 97,
    BSC: 56,
}
//切换链
const SCAN_ADDRESS = {
    [ChainId.BSC]: 'https://bscscan.com'
}
//配置连接链的信息
const networkConf = {
    [ChainId.BSC]: {
        // chainId: '0x61',
        chainId: '0x38',
        chainName: 'BSC',
        nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18,
        },
        // RPC就是从一台机器（客户端）上通过参数传递的方式调用另一台机器（服务器）上的一个函数或方法（可以统称为服务）并得到返回的结果。
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        // rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        blockExplorerUrls: [SCAN_ADDRESS[ChainId.BSC]],
    }
}
//切换链
export const changeNetwork = (chainId: number) => {
    return new Promise<void>(reslove => {
        const { ethereum } = window
        if (ethereum && ethereum.isMetaMask && networkConf[chainId]) {
            ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        // 连接链参数
                        ...networkConf[chainId]
                    }
                ],
            }).then(() => {
                setTimeout(reslove, 500)
            })
        } else {
            reslove()
        }
    })
}
// react-web3允许连接的链
export const injected = new InjectedConnector({
    supportedChainIds: [ChainId.BSC],
})
// 先链接钱包，再切换
const connectFun = (connector: InjectedConnector, activate: any, deactivate: any) => {
    // const { activate, deactivate, active } = useWeb3React()
    return activate(connector, undefined, true).then((e: any) => {
        if (window.ethereum && window.ethereum.on) {
            // 监听钱包事件
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                    // 无账号，则代表锁定了,主动断开
                    deactivate()
                }
                // 账号改了，刷新网页
            })

            window.ethereum.on('disconnect', () => {
                // 断开连接
                deactivate()
            })

            window.ethereum.on('disconnect', () => {
                // 断开连接
                deactivate()
            })

            // window.ethereum.on('message', message => {
            //     console.log('message', message)
            // })

        }
    })
}

export const useConnectWallet = () => {
    const { activate, deactivate, active } = useWeb3React()
    const connectWallet = useCallback((connector: InjectedConnector, chainId: number) => {
        // connectFun(connector, activate, deactivate).catch((error: any) => {
        //切换到指定链
        return activate(connector, undefined, true).then((e) => {

            //调用连接方法
            // connectFun(connector, activate, deactivate)
            //     if (window.ethereum && window.ethereum.on) {
            //         // 监听钱包事件
            //         // const { ethereum } = window
            //         window.ethereum.on('accountsChanged', (accounts: string[]) => {
            //             if (accounts.length === 0) {
            //                 // 无账号，则代表锁定了,主动断开
            //                 deactivate()
            //             }
            //             // 账号改了，刷新网页
            //         })

            //         window.ethereum.on('disconnect', () => {
            //             // 断开连接
            //             deactivate()
            //         })

            //         window.ethereum.on('disconnect', () => {
            //             // 断开连接
            //             deactivate()
            //         })

            //         // window.ethereum.on('message', message => {
            //         //     console.log('message', message)
            //         // })

            //     }
            // }).catch((error) => {
            //     switch (true) {
            //         case error instanceof UnsupportedChainIdError:
            //             // console.log('链错了')
            //             break
            //         case error instanceof NoEthereumProviderError:
            //             // console.log('不是钱包环境')
            //             break
            //         case error instanceof UserRejectedRequestError:
            //             // console.log('用户拒绝连接钱包')
            //             break
            //         default:
            //         // console.log(error)
            //     }
            // })
        }).catch(errr => {
            changeNetwork(chainId).then(() => {

            })
        })
    }, [])

    useMemo(() => {
        // 首次尝试连接
        !active && connectWallet(injected, ChainId.BSC)
        window.ethereum && window.ethereum.on('chainChanged', () => {
            // 切换网络后，尝试连接
            !active && connectWallet(injected, ChainId.BSC)
        })
        window.ethereum && window.ethereum.on('accountsChanged', (accounts: string[]) => {
            !active && connectWallet(injected, ChainId.BSC)
        })
    }, [])
    return connectWallet
}



export class Contracts {
    //单例
    static example: Contracts
    web3: Web3
    contract: contractType = {}
    constructor(library: provider) {
        this.web3 = new Web3(library)
        //保存实例到静态属性
        Contracts.example = this
    }
    //判断合约是否实例化
    verification(contractName: string) {
        if (!this.contract[contractName]) {
            this.contract[contractName] = new this.web3.eth.Contract(abiObj[contractName], contractAddress[contractName])
        }
    }
    //合约的方法
    //查询余额
    balanceOf(addr: string) {
        this.verification('Token')
        return this.contract.Token?.methods.balanceOf(addr).call({ from: addr })
    }
    //查询授权
    Tokenapprove(addr: string, toaddr: string) {
        this.verification('Token')
        return this.contract.Token?.methods.allowance(addr, toaddr).call({ from: addr })
    }
    //授权
    approve(addr: string, toaddr: string) {
        this.verification('Token')
        // var amount = Web3.utils.toBN("99999999999999999999999999999999")
        var amount = Web3.utils.toBN(Web3.utils.toWei("100000", "ether"))
        return this.contract.Token?.methods.approve(toaddr, amount).send({ from: addr })
    }
    //购买
    buy(addr: string, reward: string) {
        this.verification('IDO')
        return this.contract.IDO?.methods.buy(reward).send({ from: addr })
    }
    //查询释放
    idoBalanceMapping(addr: string) {
        this.verification('IDO')
        return this.contract.IDO?.methods.idoBalanceMapping(addr).call({ from: addr })
    }
    //查询下级返佣
    getUserRefereeByAddress(addr: string) {
        this.verification('IDO')
        return this.contract.IDO?.methods.getUserRefereeByAddress().call({ from: addr })
    }
    //提取推荐收益
    userDrawRefereeToken(addr: string) {
        this.verification('IDO')
        return this.contract.IDO?.methods.userDrawRefereeToken().send({ from: addr })
    }
    //提取返还IDO
    userDrawToken(addr: string) {
        this.verification('IDO')
        return this.contract.IDO?.methods.userDrawToken().send({ from: addr })
    }
    //查询结束区块
    endBlock(addr: string) {
        this.verification('IDO')
        return this.contract.IDO?.methods.endBlock().call({ from: addr })
    }
    //查询是否开启释放领取
    openDraw(addr: string) {
        this.verification('IDO')
        return this.contract.IDO?.methods.openDraw().call({ from: addr })
    }
    //查询是否开启推荐奖励领取
    refereeOpenDraw(addr: string) {
        this.verification('IDO')
        return this.contract.IDO?.methods.refereeOpenDraw().call({ from: addr })
    }
    //查询用户是否购买
    buyMapping(addr: string) {
        this.verification('IDO')
        return this.contract.IDO?.methods.buyMapping(addr).call({ from: addr })
    }
    //查询邀请可领取量
    refereeTotalMapping(addr: string) {
        this.verification('IDO')
        return this.contract.IDO?.methods.refereeTotalMapping(addr).call({ from: addr })
    }
    //查询开始购买区块
    beginBlock(addr: string) {
        this.verification('IDO')
        return this.contract.IDO?.methods.beginBlock().call({ from: addr })
    }
    //查询当前区块高度
    QueryBlock() {
        return this.web3.eth.getBlockNumber()
    }
    //签名数据
    Sign(addr: string, msg: string) {
        return this.web3.eth.personal.sign(this.web3.utils.utf8ToHex(msg) as string, addr, '123')
    }
    //是否1155
    supportsInterface(addr: string, interfaceId: string, addr1155: string) {
        let Contract = new this.web3.eth.Contract(abiObj.NFT1155, addr1155)
        return Contract.methods.supportsInterface(interfaceId).call({ from: addr })
    }
    //721授权
    approveMarket(addr: string, addr721: string) {
        let Contract = new this.web3.eth.Contract(abiObj.NFT721, addr721)
        // console.log(contractAddress.Market,tokenId)
        return Contract.methods.setApprovalForAll(contractAddress.Market, true).send({ from: addr })
    }
    //1155授权
    approveMarket1(addr: string, addr1155: string) {
        let Contract = new this.web3.eth.Contract(abiObj.NFT1155, addr1155)
        // console.log(contractAddress.Market,tokenId)
        return Contract.methods.setApprovalForAll(contractAddress.Market, true).send({ from: addr })
    }
    //查询721授权
    getapproveMarket(addr: string, addr721: string) {
        let Contract = new this.web3.eth.Contract(abiObj.NFT721, addr721)
        return Contract.methods.isApprovedForAll(addr, contractAddress.Market).call({ from: addr })
    }
    //查询1155授权
    getapproveMarket1(addr: string, addr1155: string) {
        let Contract = new this.web3.eth.Contract(abiObj.NFT1155, addr1155)
        return Contract.methods.isApprovedForAll(addr, contractAddress.Market).call({ from: addr })
    }
    //交易场购买订单
    makeOrder(addr: string, data: string, payableAmount: string) {
        console.log();
        BigNumber.NE = -40
        BigNumber.PE = 40
        let num = new BigNumber(payableAmount).times(10 ** 18).toString()
        this.verification('Market')
        return this.contract.Market?.methods.makeOrder(data).send({ from: addr, value: num })
    }
    //铸造
    toMintNft(addr: string, data: string, payableAmount: number,) {
        BigNumber.NE = -40
        BigNumber.PE = 40
        let num = new BigNumber(payableAmount).times(10 ** 18).toString()
        this.verification('Casting')
        return this.contract.Casting?.methods.toMintNft(data).send({ from: addr, value: num })
    }
    Casting(addr: string, data: string, payableAmount: number,) {
        BigNumber.NE = -40
        BigNumber.PE = 40
        let num = new BigNumber(payableAmount).times(10 ** 18).toString()
        this.verification('Casting')
        return this.contract.Casting?.methods.toMintNft(data).send({ from: addr, value: num })
    }
    //查询BNB余额
    getBalance(addr: string) {
        return this.web3.eth.getBalance(addr)
    }
    //USDT查询余额
    USDTbalanceOf(addr: string) {
        this.verification('USDT')
        return this.contract.USDT?.methods.balanceOf(addr).call({ from: addr })
    }
    //USDT查询授权
    USDTallowance(addr: string, toaddr: string) {
        this.verification('USDT')
        return this.contract.USDT?.methods.allowance(addr, toaddr).call({ from: addr })
    }
    //TOKEN授权
    USDTapprove(addr: string, toaddr: string) {
        this.verification('USDT')
        // var amount = Web3.utils.toBN("99999999999999999999999999999999")
        var amount = Web3.utils.toBN(Web3.utils.toWei("100000", "ether"))
        return this.contract.USDT?.methods.approve(toaddr, amount).send({ from: addr })
    }
    //TOKEN授权
    TOKENapprove(addr: string, toaddr: string, tokenAddr: string) {
        let Contract = new this.web3.eth.Contract(abiObj.Token, tokenAddr)
        // var amount = Web3.utils.toBN("99999999999999999999999999999999")
        var amount = Web3.utils.toBN(Web3.utils.toWei("100000", "ether"))
        return Contract.methods.approve(toaddr, amount).send({ from: addr })
    }
    //TOKEN查询授权
    TOKENallowance(addr: string, toaddr: string, tokenAddr: string) {
        let Contract = new this.web3.eth.Contract(abiObj.Token, tokenAddr)
        return Contract.methods.allowance(addr, toaddr).call({ from: addr })
    }
    //TOKEN查询余额
    TOKENbalanceOf(addr: string, tokenAddr: string) {
        let Contract = new this.web3.eth.Contract(abiObj.Token, tokenAddr)
        return Contract.methods.balanceOf(addr).call({ from: addr })
    }
    //领取收益
    getMarketAward(addr: string, data: string) {
        this.verification('MarketReceive')
        return this.contract.MarketReceive?.methods.getAward(data).send({ from: addr })
    }
    //领取收益
    getAward(addr: string, data: string) {
        this.verification('Receive')
        return this.contract.Receive?.methods.getAward(data).send({ from: addr })
    }
    //领取收益
    CastingGetAward(addr: string, data: string) {
        this.verification('CastingReceive')
        return this.contract.CastingReceive?.methods.getAward(data).send({ from: addr })
    }
    //领取收益
    JSGGetAward(addr: string, data: string) {
        this.verification('JSGReceive')
        return this.contract.JSGReceive?.methods.getAward(data).send({ from: addr })
    }
}
