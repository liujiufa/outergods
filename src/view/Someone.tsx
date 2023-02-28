import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";
import { Table, Pagination, Collapse, Space, Select } from 'antd';
import { NftUserType } from '../API'
import { getUserInfo, getNftUserInfo, getNftUserState, getUserAwardList, getUserGiveLikeList, drawAward, syncUserNftData, getNfts } from '../API'
import { createAddMessageAction, createSetLodingAction } from '../store/actions'
import { useWeb3React } from '@web3-react/core'
import { stateType } from '../store/reducer'
import { useSelector, useDispatch } from "react-redux";
import copy from 'copy-to-clipboard';
import { Menu, Dropdown, PaginationProps } from 'antd';
import { AddrHandle, HowLongAgo } from '../utils/tool'
import '../assets/style/GoodsDetial.scss'
import '../assets/style/Personal.scss'
import { Contracts } from '../web3'
import Goods, { NftInfo } from '../components/HotspotCard'
import { useTranslation } from 'react-i18next'
import { useViewport } from '../components/viewportContext'
import { Chain } from '../config'
import CollectionScreenModal from '../components/CollectionScreenModal'
import ReceRecord from '../components/ReceRecord'
import NoData from '../components/NoData'
import ActionBox from '../components/ActionBox'
import LaunchLogo from '../assets/image/LaunchLogo.png'
import write from '../assets/image/writeWhite.png'
import chainIcon from '../assets/image/ETHIcon.png'
import copyIcon from '../assets/image/copyIcon.png'
import shareIcon from '../assets/image/shareIcon.png'
import minSet from '../assets/image/minSet.png'
import twitterIcon from '../assets/image/twitterIcon.png'
import facebookIcon from '../assets/image/facebookIcon.png'
import youtubeIcon from '../assets/image/youtubeIcon.png'
import stateItem1 from '../assets/image/stateItem1.png'
import stateItem2 from '../assets/image/stateItem2.png'
import stateItem3 from '../assets/image/stateItem3.png'
import stateItem4 from '../assets/image/stateItem4.png'
import Search from '../assets/image/searchIcon.png'
import demoTestImg from '../assets/image/demoTestImg.png'
import viewIcon from '../assets/image/viewIcon.png'
import typeItem1 from '../assets/image/typeItem1.png'
import typeItem2 from '../assets/image/typeItem2.png'
import typeItem3 from '../assets/image/typeItem3.png'
import typeItem4 from '../assets/image/typeItem4.png'
import typeItem5 from '../assets/image/typeItem5.png'
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import authentication from '../assets/image/authentication.svg'
import NotCertified from '../assets/image/NotCertified.svg'

interface userInfoType {
    userName: string | null,
    brief: string | null,
    createTime: number,
    headImg: string | null,
}
interface AwardType {
    amount: number,
    totalAmount: number,
    coinName: string,
    totalAmountString: string,
    amountString: string,
    id: number
}
interface NftCurrentItemType {
    amount: number,
    totalAmount: number,
    coinName: string,
    totalAmountString: string,
    amountString: string,
    id: number
}
interface NftCurrentType {
    cursor: string
    page: number
    page_size: number
    result: NftCurrentItemType[]
    status: string
    total: number
}
export default function Personal(): JSX.Element {
    // 控制图标上下
    const [expand16, setExpand16] = useState(true);
    const [params] = useSearchParams();
    const web3React = useWeb3React()
    const dispatch = useDispatch();
    const { width } = useViewport()
    let { t } = useTranslation();
    const [tabActive, setTabActive] = useState(0);
    let state = useSelector<stateType, stateType>(state => state);
    let [userInfo, setUserInfo] = useState<userInfoType | any>(null)
    let [userNft, setUsetNft] = useState<NftInfo[]>([])
    let [userCurrentNft, setUserCurrentNft] = useState<NftCurrentType | null>()
    const navigate = useNavigate();
    let [tabIndex, setTabIndex] = useState<number>(0)
    let [showScreenModal, setShowScreenModal] = useState<boolean>(false)
    let [showReceRecord, setShowReceRecord] = useState<boolean>(false)
    let [shareActive, setShareActive] = useState<boolean>(false)
    let [nftState, setNftstate] = useState(0)
    let [nftSort, setNftSort] = useState(0)
    const [activeKey, setActiveKey] = useState("");
    let [pageNum, setPageNum] = useState<number>(1)
    let [tableData, setTableData] = useState<any>([])
    let [userLikeList, setUserLikeList] = useState<NftInfo[]>([])
    const [activeType, setActiveType] = useState(-1);

    let address = params.get('address')
    // 下拉图标旋转
    const handleDropDown = (fun: any, value: boolean) => {
        fun(!value);
    }
    /* 修改筛选条件 */
    function changeScreen(ScreenData: NftUserType, stateIndex?: number, sortIndex?: number) {
        stateIndex !== undefined && setNftstate(stateIndex)
        sortIndex !== undefined && setNftSort(sortIndex)
        setPageNum(1)
        getNftUserInfo({ ...ScreenData, pageSize: 10, currentPage: 1, userAddress: web3React.account as string }).then(res => {
            console.log(res, 'OrderDetail')
            setUsetNft(res.data)
        })
    }
    function LoadMore(fig: string) {
        console.log("加载更多", fig)
        if (fig) {
            dispatch(createSetLodingAction(true))
            getNfts({
                "address": address,
                // "chain": "bsc%20testnet",
                "chain": Chain,
                "cursor": fig,
                "pageSize": 10
            }).then((res) => {
                res.data.result = [...userCurrentNft!!.result, ...res.data.result]
                setUserCurrentNft(res.data)
                dispatch(createSetLodingAction(false))
            })
        } else {
            dispatch(createAddMessageAction(t('No more')))
        }
    }

    function LoadMoreActive(fig: string) {
        console.log("加载更多", fig)
        if (fig) {
            dispatch(createSetLodingAction(true))
            getNfts({
                "address": web3React.account,
                // "chain": "bsc%20testnet",
                "chain": Chain,
                "cursor": fig,
                "pageSize": 10
            }).then((res: any) => {
                if (res.code === 200) {
                    console.log(res.data, "个人中心物品");
                    res.data.result = [...userCurrentNft!!.result, ...res.data.result]
                    setUserCurrentNft(res.data)
                    dispatch(createSetLodingAction(false))
                }
            }).catch((res: any) => {
                dispatch(createSetLodingAction(false))
            })
        } else {
            dispatch(createAddMessageAction(t('No more')))
        }
    }

    useEffect(() => {
        if (address) {
            dispatch(createSetLodingAction(true))
            getNfts(
                {
                    "address": address,
                    // "chain": "bsc%20testnet",
                    "chain": Chain,
                    "cursor": "",
                    "pageSize": 10
                }
            ).then((res: any) => {
                if (res.code === 200) {
                    dispatch(createSetLodingAction(false))
                    console.log(res.data, "个人中心物品");
                    setUserCurrentNft(res.data)
                }

            })
        } else {
            setUserCurrentNft(null)
        }
    }, [address])

    useEffect(() => {
        if (address) {
            getUserInfo(address).then((res) => {
                setUserInfo(res.data)
                console.log(res, '用户信息')
            })
        }
    }, [address])

    function share() {
        // console.log(window.location)
        copy(window.location.origin + window.location.pathname + '#/Someone?address=' + web3React.account)
        dispatch(createAddMessageAction(t('Copied')))
    }
    function getFullYear(time: number) {
        var date = new Date(time); // 初始化日期
        return date.getFullYear();
    }
    function getMonth(time: number) {
        var date = new Date(time); // 初始化日期
        return date.getMonth() + 1;
    }
    /* 判断跳转到出售页面还是正在出售页面 */
    function goPath(goods: any) {
        /* 状态正常去挂卖 */
        if (goods.status === 0) {
            return navigate(`/NFTDetails?tokenId=${goods.tokenId}&&tokenAddress=${goods.tokenAddress}`)
        }
        /* 挂卖中去商品详情页改价 */
        if (goods.status === 1) {
            return navigate(`/NFTDetails?tokenId=${goods.tokenId}&&tokenAddress=${goods.tokenAddress}`)
        }
    }
    function copyUserAddr() {
        if (address) {
            copy(address as string)
            dispatch(createAddMessageAction(t('Copied')))
        } else {
            dispatch(createAddMessageAction(t('Please connect your wallet')))
        }
    }
    function shareActiveFun() {
        setShareActive(!shareActive)
    }
    function goSomeone(address: string) {
        if (address) {
            navigate('/Someone?address=' + address)
        }
    }

    // useEffect(() => {
    //     if (address) {
    //         getUserGiveLikeList(address).then(res => {
    //             console.log(res.data, "用户点赞列表")
    //             setUserLikeList(res.data)
    //         })
    //     }
    // }, [address, tabActive])

    useEffect(() => {
        if (address && state.token) {
            getUserGiveLikeList(address).then(res => {
                res.data.map((item: any) => {
                    item.metadata = JSON.parse(item.metadata) || {}
                })
                console.log(res.data, "用户点赞列表")
                setUserLikeList(res.data)
            })
        }
    }, [address, state.token, tabActive])

    useEffect(() => {
        if (address && state.token) {
            getNftUserState({
                userAddress: address,
                status: activeType,
                type: -1
            }).then(res => {
                console.log(res.data, "动态")
                setTableData(res.data)
            })
        }
    }, [address, state.token, tabActive, activeType])

    return (
        <div id="Personal" >
            <div className="Personal">
                <div className="personalContent">
                    <div className="topBox">
                        <div className="userHeader">
                            <img id="headImg" src={userInfo?.headImg || LaunchLogo} alt="" />
                        </div>
                        <div className="Info">
                            <div className="userName">
                                <div className='name' title={userInfo?.userName || t('Username')}>{userInfo?.userName || t('Username')}</div>
                                {/* <div className="level flexCenter">VIP0</div> */}
                            </div>
                            <div className="userAddress flexCenter pointer" onClick={copyUserAddr} >
                                <span>{address ? AddrHandle(address as string, 5, 4) : t('User address')}</span>
                                <img className="copyIcon" src={copyIcon} alt="" />
                            </div>
                            <div className="media-group">
                                <div className="outlinkBox">
                                    {userInfo?.tweet && <div className="linkItem" onClick={() => { navigate(userInfo?.tweet) }}><img src={twitterIcon} alt="" /></div>}
                                    {userInfo?.facebook && <div className="linkItem" onClick={() => { navigate(userInfo?.facebook) }}><img src={facebookIcon} alt="" /></div>}
                                    {userInfo?.youtubeIcon && <div className="linkItem" onClick={() => { navigate(userInfo?.youtubeIcon) }}><img src={facebookIcon} alt="" /></div>}
                                </div>
                                <div className="btnGroupRow l-hidden">
                                    <div className="share pointer flexCenter shareBox" onClick={() => { shareActiveFun() }}>
                                        <img src={shareIcon} alt="" />{t('Share')}
                                        {shareActive &&
                                            <>
                                                <div className='copyLinkBox'>
                                                    <div className="title">{t("Copy Link")}</div>
                                                    <div className="outLink">{t("Share on Facebook")}</div>
                                                    <div className="outLink">{t("Share on Twitter")}</div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                    {web3React.account?.toLowerCase() === address?.toLowerCase() && <div className="share pointer flexCenter" onClick={() => { navigate('/UserInfo') }}>
                                        <img src={minSet} alt="" />{t('Settings')}
                                    </div>}
                                </div>
                            </div>
                            {width > 425 && <div className="introduce">{t('Join in April 2022 / short self-introduction', { FullMonth: getMonth(userInfo?.createTime), FullYear: getFullYear(userInfo?.createTime) })}{userInfo?.brief || t('short self-introduction')}</div>}
                        </div>

                        <div className="btnGroupRow m-hidden">
                            <div className="share pointer flexCenter shareBox" onClick={() => { shareActiveFun() }} >
                                <img src={shareIcon} alt="" />{t('Share')}
                                {shareActive && <>
                                    <div className='copyLinkBox'>
                                        <div className="title">{t("Copy Link")}</div>
                                        <div className="outLink">{t("Share on Facebook")}</div>
                                        <div className="outLink">{t("Share on Twitter")}</div>
                                    </div>
                                </>}
                            </div>
                            {web3React.account?.toLowerCase() === address?.toLowerCase() && <div className="share pointer flexCenter" onClick={() => { navigate('/UserInfo') }}>
                                <img src={minSet} alt="" />{t('Settings')}
                            </div>}
                        </div>

                    </div>
                    {!(width > 425) && <div className="introduce introduce-m">{t('Join in April 2022 / short self-introduction', { FullMonth: getMonth(userInfo?.createTime), FullYear: getFullYear(userInfo?.createTime) })}{userInfo?.brief || t('short self-introduction')}</div>}
                    <div className="tebBox">
                        <div className={tabActive === 0 ? "tab tabActive" : "tab"} onClick={() => { setTabActive(0) }}>{t("Items")}</div>
                        <div className={tabActive === 1 ? "tab tabActive" : "tab"} onClick={() => { setTabActive(1) }}>{t("Collections1")}</div>
                        <div className={tabActive === 2 ? "tab tabActive" : "tab"} onClick={() => { setTabActive(2) }}>{t("Activities")}</div>
                    </div>
                    <div className="line"></div>

                    <div className="tabContentBox">
                        {/* 0:物品 */}
                        {tabActive === 0 && <>
                            <div className="bigContent m-bigContent">
                                <div className="slider">
                                    <div className="stateBox">
                                        <div className="stateTitle m-hidden-block">{t("State")}</div>
                                        <div className='m-hidden-block'>
                                            <div className="stateItem flexCenter activeState"><img src={stateItem1} alt="" /> {t("All")} </div>
                                            <div className="stateItem flexCenter"><img src={stateItem2} alt="" /> {t("On sale")}</div>
                                            <div className="stateItem flexCenter"><img src={stateItem3} alt="" /> {t("Not list")}</div>
                                            <div className="stateItem flexCenter"><img src={stateItem4} alt="" /> {t("hidden")} </div>
                                        </div>

                                        <div className='nft-type l-hidden'>
                                            <div className="stateItem flexCenter activeState"><img src={stateItem1} alt="" /> {t("All")} </div>
                                            <div className="stateItem flexCenter"><img src={stateItem2} alt="" /> {t("On sale")}</div>
                                            <div className="stateItem flexCenter"><img src={stateItem3} alt="" /> {t("Not list")}</div>
                                            <div className="stateItem flexCenter"><img src={stateItem4} alt="" /> {t("hidden")} </div>
                                        </div>

                                    </div>
                                    <div className="seriesBox">
                                        <div className="seriesTitle m-hidden">
                                            {t("Collection")}
                                        </div>
                                        <div className="seriesSearch">
                                            <div className="searchBox">
                                                <div className="search" onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}>
                                                    <img src={Search} alt="" />
                                                    <input type="text" placeholder={t("Collection name")} />
                                                </div>
                                            </div>
                                        </div>
                                        {false && <div className="seriesBox">
                                            <div className="seriesItem">
                                                <div className="seriesLeft">
                                                    <div className="imgBox">
                                                        <img src={demoTestImg} alt="" />
                                                    </div>
                                                    <div className="infoBox">
                                                        <div className="seriesTitle">{t("Collection name")}</div>
                                                        <div className="seriesPries">0.01ETH</div>
                                                    </div>
                                                </div>
                                                <div className="seriesRight">
                                                    <div className="number">2</div>
                                                    <img src={viewIcon} alt="" />
                                                </div>
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                                <div className="content">
                                    {userCurrentNft && userCurrentNft?.result?.length > 0 ? <>
                                        <div className="goodsList">{
                                            userCurrentNft?.result.map((item, index) =>
                                                <div className="userNft">
                                                    <Goods key={index} NftInfo={item} goPath={() => { goPath(item) }} tag="Personal" address={address}>
                                                    </Goods>
                                                </div>
                                            )}</div>
                                        <div className="LoadMore flexCenter" onClick={() => { LoadMore(userCurrentNft!!.cursor) }}>{t('Load More')}  {'>'}</div>
                                    </> : <NoData />}
                                </div>
                            </div>
                        </>}
                        {/* 1：收藏 */}
                        {tabActive === 1 && <>
                            <div className="bigContent">
                                <div className="content">
                                    {userLikeList.length > 0 ? <>
                                        <div className="goodsList" id="goodsList">
                                            {userLikeList.map((item: any, index: any) => <div className="userNft">
                                                <Goods key={index} goPath={() => { goPath(item) }} NftInfo={item} tag="collect"></Goods>
                                            </div>)}
                                        </div>
                                        <div className="LoadMore flexCenter" onClick={() => { LoadMoreActive(userCurrentNft!!.cursor) }}>{t('Load More')}  {'>'}</div>
                                    </> : <NoData></NoData>
                                    }
                                </div>
                            </div>
                        </>}
                        {/* 2：动态 */}
                        {tabActive === 2 && <>
                            <div className="bigContent m-bigContent actionContent">
                                <div className="slider m-hidden-block actionSlider">
                                    <div className="typeTitle">{t("Type")}</div>
                                    <div className="typeBox">
                                        <div className={activeType === -1 ? "flexCenter kindTitle activeType" : "flexCenter kindTitle"} onClick={() => { setActiveType(-1) }}> <img src={typeItem1} alt="" /> {t("All")}</div>
                                        <div className={activeType === 0 ? "flexCenter putType activeType" : "flexCenter putType"} onClick={() => { setActiveType(0) }}> <img src={typeItem2} alt="" /> {t("List")}</div>
                                        <div className={activeType === 2 ? "flexCenter cancelType activeType" : "flexCenter cancelType"} onClick={() => { setActiveType(2) }}> <img src={typeItem3} alt="" /> {t("Cancel")}</div>
                                        <div className={activeType === 1 ? "flexCenter successfulType activeType" : "flexCenter successfulType"} onClick={() => { setActiveType(1) }}> <img src={typeItem4} alt="" /> {t("Sale")}</div>
                                        <div className={activeType === 4 ? "flexCenter managepriceType activeType" : "flexCenter managepriceType"} onClick={() => { setActiveType(4) }}> <img src={typeItem5} alt="" /> {t("Change")}</div>
                                    </div>
                                </div>

                                <Select
                                    className='l-hidden selectM'
                                    defaultValue="all"
                                    style={{ width: "100%" }}
                                    dropdownStyle={{ background: "#E7E7FF" }}
                                    options={[
                                        { value: 'all', label: t("All") },
                                        { value: 'putType', label: t("List") },
                                        { value: 'cancelType', label: t("Cancel") },
                                        { value: 'successfulType', label: t("Sale") },
                                        { value: 'managepriceType', label: t("Change") },]}
                                />

                                {/* 动态注释 */}
                                {tableData.length > 0 && <ActionBox tableData={tableData}></ActionBox>}
                            </div>
                        </>}
                    </div>
                </div>
            </div>
            <ReceRecord isShow={showReceRecord} close={() => { setShowReceRecord(false) }}></ReceRecord>
            {/* 筛选弹窗 */}
            <CollectionScreenModal isShow={showScreenModal} close={() => { setShowScreenModal(false) }} changeScreen={changeScreen} ></CollectionScreenModal>
        </div >
    )
}
