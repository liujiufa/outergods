import React, { useState, useEffect } from 'react'
import '../assets/style/CastingMR.scss'
import { getBuyDetail, getCardList, mintNft, loginByPass, CastingGetUserInfo, sendDrawAward, sendUserCancelDrawAward } from '../API'
import { stateType } from '../store/reducer'
import { contractAddress } from '../config'
import { AddrHandle } from '../utils/tool'
import { Contracts } from '../web3'
import copy from 'copy-to-clipboard';
import { useWeb3React } from '@web3-react/core'
import { useSelector, useDispatch } from "react-redux";
import { createAddMessageAction, createSetLodingAction } from '../store/actions'
import { useSearchParams } from "react-router-dom";
import CastingItemMR, { CastingInfo } from '../components/CastingItemMR'
import { useTranslation } from 'react-i18next'

import CastingSuccess from '../components/CastingSuccess'
import LaunchBanner from '../assets/image/LaunchBannerMR.png'
import CastingMRBg from '../assets/image/CastingMRBg.png'
import demonX1 from '../assets/image/demonX1MR.png'
import demonX2 from '../assets/image/demonX2MR.png'
import copyIcon from '../assets/image/copyIconWhite.png'
import AboutMR from '../assets/image/AboutMR.png'
import HowItWorkMR from '../assets/image/HowItWorkMR.png'
import ReleaseMR from '../assets/image/ReleaseMR.png'
import BigNumber from 'big.js'
BigNumber.NE = -40
BigNumber.PE = 40
interface BuyInfo {
    issueIntroduce: string
    payTokenAddress: string
    projectName: string
    cardSystem: string
    projectReferral: string
}
interface invitationInfoType {
    userAccount: {
        amount:number,
        id:number,
        coinName:string,
        totalAmount:number
    }[]
    size: number
}

export default function Casting(): JSX.Element {
    const dispatch = useDispatch();
    const web3React = useWeb3React()
    let { t } = useTranslation()

    let [approveNum, setApproveNum] = useState<string>('0')
    let state = useSelector<stateType, stateType>(state => state);
    let [isShowModel, setIsShowModel] = useState<boolean>(false)
    let [BuyInfoD, setBuyInfo] = useState<BuyInfo | null>(null)
    let [CardList, setCardList] = useState<CastingInfo[]>([])
    let [invitationInfo, setInvitationInfo] = useState<invitationInfoType | null>()
    let [CastingSucInfo, SetCastingSucInfo] = useState('')
    const [params] = useSearchParams();
    let id = params.get('id')
    let refereeUserAddress = params.get('address')
    useEffect(() => {
        if (id && state.token) {
            getBuyDetail(id).then(res => {
                setBuyInfo(res.data)
                // console.log(res, "----------------------")
                getCardList(res.data.id).then(res => {
                    setCardList(res.data)
                    // console.log(res, "铸造列表")
                })
                // console.log(res, "购买详情")
            })
        }
    }, [id, state.token])
    useEffect(() => {
        if (state.token && web3React.account) {
            loginByPass({
                password: '123',
                refereeUserAddress: refereeUserAddress || '',
                userAddress: web3React.account,
                type:2,
                userPower: 0
            }).then(res => {
                // console.log(res, "发射台登录")
                /* 获取奖励信息 */
                CastingGetUserInfo(2).then(res => {
                    setInvitationInfo(res.data)
                    // console.log(res, "用户信息")
                })
            });
        }
    }, [refereeUserAddress, state.token, web3React.account])
    /* 获取授权额度 */
    useEffect(() => {
        if (web3React.account && BuyInfoD?.payTokenAddress) {
            Contracts.example.TOKENallowance(web3React.account, contractAddress.Casting, BuyInfoD?.payTokenAddress as string).then((res: string) => {
                setApproveNum(new BigNumber(res).div(10 ** 18).toString())
            })
        }
    }, [web3React.account, BuyInfoD?.payTokenAddress])
    function isApprove(price: number, coinName: string) {
        return new BigNumber(approveNum).gte(price) || coinName === 'BNB'
    }
    function approve() {
        dispatch(createSetLodingAction(true))
        Contracts.example.TOKENapprove(web3React.account as string, contractAddress.Casting, BuyInfoD?.payTokenAddress as string).then((res: any) => {
            Contracts.example.TOKENallowance(web3React.account as string, contractAddress.Casting, BuyInfoD?.payTokenAddress as string).then((res: string) => {
                setApproveNum(new BigNumber(res).div(10 ** 18).toString())
            })
            dispatch(createAddMessageAction(t('Authorized')))
        }).finally(() => {
            dispatch(createSetLodingAction(false))
        })
    }
    async function casting(price: number, coinName: string, cardType: number, sellOut: boolean) {
        // console.log(coinName, price)
        if (!sellOut) {
            return dispatch(createAddMessageAction(t('All have been minted')))
        }
        let Balance
        if (coinName === "DEMON") {
            /* 判断授权 */
            if (new BigNumber(approveNum).lt(price as number)) {
                return dispatch(createAddMessageAction(t('Please authorize')))
            }
            Balance = await Contracts.example.TOKENbalanceOf(web3React.account as string, BuyInfoD?.payTokenAddress as string)
            Balance = new BigNumber(Balance).div(10 ** 18).toString()
        }
        if (coinName === 'BNB') {
            Balance = await Contracts.example.getBalance(web3React.account as string)
            Balance = new BigNumber(Balance).div(10 ** 18).toString()
        }
        // console.log(Balance, "余额")
        //判断余额不足
        if (new BigNumber(Balance as string).lt(price)) {
            return dispatch(createAddMessageAction(t('Not enough balance')))
        }
        dispatch(createSetLodingAction(true))
        mintNft(cardType,2).then(res => {
            // console.log(res, "铸造加密")

            SetCastingSucInfo(res.data.data)
            price = coinName === "BNB" ? price : 0;
            Contracts.example.toMintNft(web3React.account as string, res.data.sign, price).then((res: any) => {
                // console.log(res, "铸造结果")
                setIsShowModel(true)
                dispatch(createAddMessageAction(t('Minting success')))
            }).finally(() => {
                dispatch(createSetLodingAction(false))
            })
        }, () => {
            dispatch(createSetLodingAction(false))
            dispatch(createAddMessageAction(t('Minting failed')))
        })
    }
    function invitation() {
        if (!web3React.account) {
            return dispatch(createAddMessageAction(t('Please connect your wallet')))
        } else {
            copy(window.location.origin + window.location.pathname + '#/ABOUT?id=2&address=' + web3React.account)
            dispatch(createAddMessageAction(t('Copied')))
        }
    }
    function rewards(coinName:string) {
        if (web3React.account) {
            sendDrawAward(2,coinName).then((res: any) => {
                // console.log(res, "领取发射台奖励加密")
                if (res.code === 200) {
                    dispatch(createSetLodingAction(true))
                    Contracts.example.CastingGetAward(web3React.account as string, res.data).then((res: any) => {
                        // console.log(res, "领取结果")
                        dispatch(createAddMessageAction(t('Claimed')))
                    }, (err: any) => {
                        if (err.code === 4001) {
                            sendUserCancelDrawAward().then(res => {
                                // console.log(res, "取消成功")
                            })
                        }
                    }).finally(() => {
                        dispatch(createSetLodingAction(false))
                    })
                } else {
                    dispatch(createAddMessageAction(t('Failed')))
                }
            })
        }
    }
    return (
        <div className="Casting">
            <div className="Banner">
                <img src={LaunchBanner} alt="" />
            </div>
            <div className="BgBox">
                <div className="LRlayout LRlayout1">
                    <div className="Text">
                        <div className="main"><img src={AboutMR} alt="" /></div>
                        <div className="sub sub1">$LERN (Love to Earn)is a Web 3 lifestyle app with metaverse
                            gameplay and adult social elements.
                            Theoretically means that users can build a community with their partner
                            and earn 1024 DAO, a real crypto token.</div>
                        {/* <div className="sub">{BuyInfoD && BuyInfoD.projectReferral}</div> */}
                    </div>
                    <img src={demonX1} alt="" />
                </div>
                <div className="LRlayout LRlayout2">
                    <img src={demonX2} alt="" />
                    <div className="Text Text1" style={{ marginLeft: 117 }}>
                        <div className="main"><img src={HowItWorkMR} alt="" /></div>
                        {/* <div className="sub">{BuyInfoD && BuyInfoD.cardSystem}</div> */}
                        <div className="sub">Moulin Rouge creates an interactive and immersive online community that promotes the functional and educational development of special cultural
                            and artistic spirits and healthy adult cultures,revolutionizing
                            entertainment financing and monetization through community incentives.</div>
                    </div>
                </div>
                <div className="titleBox">
                    <div className="introduceTitle"><img src={ReleaseMR} alt="" /></div>
                </div>
                <div className="introduce">
                    
                    {BuyInfoD && BuyInfoD.issueIntroduce}
                </div>
                <div className="CastingList">
                    {
                        CardList.map((item, index) => <div className="item" key={index}>
                            <CastingItemMR approveNum={approveNum} castingFun={casting} approveFun={approve} data={item}></CastingItemMR>
                            {/* {
                                isApprove(item.price, item.coinName) ? <div className={item.totalIssueNum > item.alreadyBuyNum ? 'CastingBtn flexCenter' : 'CastingBtn invalid flexCenter'} onClick={() => { casting(item.price, item.coinName, item.cardType, item.totalIssueNum > item.alreadyBuyNum) }}>{t('Mint')}</div> : <div className="CastingBtn flexCenter" onClick={approve}>{t('Authorize')}</div>
                            } */}


                        </div>)
                    }
                </div>
                {/* 邀请 */}
                <div className="invitation">
                    <div className="send">{t('Send your referral link')}</div>
                    <div className="invitationLink">
                        <div className="LinkBox">{window.location.origin + '/#/ABOUT?id=2&address=' + AddrHandle(web3React.account as string)}
                            <img src={copyIcon} onClick={invitation} alt="" />
                        </div>
                    </div>
                    {
                        invitationInfo && <div className="invitationNum">{t('Number of valid invitations')}：{invitationInfo.size}</div>
                    }

                    {/* {
                        invitationInfo && <div className="receive">
                            {invitationInfo.amount} Demon
                            <div className="receiveBtn flexCenter" onClick={rewards}>
                                {t('Claim')}
                            </div>
                        </div>
                    } */}
                    {
                        invitationInfo?.userAccount.map((item)=><div key={item.id} className="receive">
                        {item.amount} {item.coinName}
                        <div className="receiveBtn flexCenter" onClick={()=>rewards(item.coinName)}>
                            {t('Claim')}
                        </div>
                    </div>)
                    }

                    <div className="rule">
                        <div className="ruleTitle">{t('Reward rules')}：</div>
                        <div className="ruleContent">{t('rule1')}<br></br>
                            {t('rule2')}<br></br><br></br>
                        </div>
                        ({t('Right',{projectName:BuyInfoD?.projectName})})<br></br>
                    </div>
                </div>
            </div>
            <CastingSuccess isShow={isShowModel} image={CastingSucInfo} close={() => { setIsShowModel(false) }}></CastingSuccess>
        </div>
    )
}
