
import { Tooltip, Menu, Dropdown, Collapse, Image } from 'antd';
import copy from "copy-to-clipboard"
import BinancePng from '../../../assets/image/nftDetails/binance.png'
import TipsPng from '../../../assets/image/nftDetails/tips.png'
import CopyPng from '../../../assets/image/nftDetails/copy.png'
import UsdtPng from '../../../assets/image/nftDetails/usdt.png'
import SharePng from '../../../assets/image/nftDetails/share.png'
import FabulousPng from '../../../assets/image/nftDetails/fabulous.png'
import RefreshPng from '../../../assets/image/nftDetails/refresh.png'
import widePng from '../../../assets/image/nftDetails/wide.png'
import NFTImage from '../../../assets/image/4.png'
import demoTestImg from '../../../assets/image/demoTestImg.png'
import authentication from '../../../assets/image/authentication.svg'
import openIcon from '../../../assets/image/openIconWhite.png'
import switchIcon from '../../../assets/image/switchIcon.png'
import AuthenticationPng from '../../../assets/image/authentication.svg'
import NotAuthenticationPng from '../../../assets/image/NotCertified.svg'
import './NFTDetailsL.scss'
import { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { ExclamationCircleOutlined } from '@ant-design/icons'
import Goods, { NftInfo } from '../../../components/HotspotCard'
import { useSearchParams, useNavigate } from "react-router-dom";
import { getNftOrderState, getNftUserInfoDetail, getUserOrder, getTradeCoinNameList, getOrderByProject, getNFTApiData, getNFTMetadata } from '../../../API'
import { stateType } from '../../../store/reducer'
import { createAddMessageAction, createSetLodingAction } from "../../../store/actions"
import ManageModal from '../../../components/ManageModal'
import CancelSaleModal from '../../../components/CancelSaleModal'
import SaleNFTModal from '../../../components/SaleNFTModal'
import SaleModal from '../../../components/SaleModal'
import ConfirmBuyNFTModal from '../../../components/ConfirmBuyNFTModal'
import ActionBox from '../../../components/ActionBox'
import NoData from '../../../components/NoData'
import defaultCard from '../../../assets/image/defaultCard.png'
import { useWeb3React } from '@web3-react/core'
import { AddrHandle, HowLongAgo, NumSplic } from '../../../utils/tool'
import { useTranslation } from 'react-i18next'
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useViewport } from '../../../components/viewportContext';
import NotCertified from '../../../assets/image/NotCertified.svg'
import { decimalNum } from '../../../utils/decimalNum';
import styled from "styled-components"
declare let window: any;

interface OrderDetailType {
    projectName: string,
    nftName: string
    image: string
    description: string
    tokenAddress: string
    isAuthentication: number | null
    tokenId: string
    metadata: {
        [key: string]: string;
    },
    browseNum: number
    giveNum: number
    price: number,
    id: number,
    userAddress: string
}

const AuthenticationGroup = styled.img`
    #root & {
        width: 20px;
        height: 20px;
        margin-left: 12px;
        border-radius: 50%;  

        
        @media (max-width: 750px) {
            margin-left: 4px;
        }
    }
`
export default function NFTDetailsL({
    OrderDetail,
    CopyLink,
    attrOrInfo,
    NFTDetailFun
}: any) {
    console.log(OrderDetail, "NFT详情");
    let [showPriceChange, setShowPriceChange] = useState<boolean>(false)
    const web3React = useWeb3React()
    let { t } = useTranslation()
    const { width } = useViewport()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [DynamicState, setDynamicState] = useState(0)
    let state = useSelector<stateType, stateType>(state => state);
    const [tabIndex, setTabIndex] = useState(0)
    const [expand1, setExpand1] = useState(true)
    const [manageModal, setManageModal] = useState(false)
    const [saleNFTModal, setSaleNFTModal] = useState(false)
    let [tableData, setTableData] = useState([])
    let [coinsKindData, setCoinsKindData] = useState([])
    let [isShare, setIsShare] = useState<boolean>(false)
    let [NFTShow, setNFTShow] = useState<boolean>(false)
    let [buyNFTModal, setBuyNFTModal] = useState<boolean>(false)
    let [showEnterCancel, setShowEnterCancel] = useState<boolean>(false)
    let [currentTradeOrder, setCurrentTradeOrder] = useState<NftInfo>()
    let [OrderNFTDetail, setOrderNFTDetail] = useState<OrderDetailType | undefined>(undefined)
    let [projectOrder, setProjectOrder] = useState<any>([])
    let [pageNum, setPageNum] = useState<number>(1)
    let [orderState, setOrderState] = useState<any>()
    let [imgState, setImgState] = useState<any>()
    let [refreshState, setRefreshState] = useState<any>()
    const [params] = useSearchParams();
    const TABS = [
        t("Description"),
        t("Attributes"),
        t("Information")
    ]
    let tokenId = params.get('tokenId')
    let tokenAddress = params.get('tokenAddress')
    let owner_of = params.get('owner_of')
    const handleDropDown = (fun: any, value: boolean) => {
        fun(!value);
    }
    //2: 弹窗购买&&1：立即购买当前
    const buyBtnFun = (item: any) => {
        console.log(item, "购买");
        if (web3React.account) {
            setBuyNFTModal(true)
            if (item !== 1) {
                setCurrentTradeOrder(item)
            }
        } else {
            dispatch(createAddMessageAction(t("Please connect the wallet first")))
        }
    }
    function goSomeone(address: string) {
        if (address) {
            navigate('/Someone?address=' + address)
        }
    }
    function CopyAddressFun(value: string) {
        copy(value)
        dispatch(createAddMessageAction(t('Copy successful')))
    }

    let typeMenu = (
        <Menu onClick={() => handleDropDown(setExpand1, expand1)}>
            <Menu.Item>{t("All")}</Menu.Item>
        </Menu>
    );

    function LoadMore() {
        let page = pageNum + 1
        setPageNum(page)
        getOrderByProject({
            projectId: OrderDetail?.projectId,
            currentPage: page,
            pageSize: 6
        }).then(res => {
            if (res.data.length === 0) {
                return dispatch(createAddMessageAction(t('No more')))
            } else {
                setProjectOrder([...projectOrder, ...res.data])
            }
        })
    }
    /* 判断跳转到出售页面还是正在出售页面 */
    function goPath(goods: any) {
        return navigate(`/NFTDetails?tokenId=${goods.tokenId}&&tokenAddress=${goods.tokenAddress}`)
    }

    const stateFun = () => {
        let str2 = web3React.account?.toLocaleLowerCase();
        let str3 = orderState?.owner_of?.toLocaleLowerCase();
        // 出售
        if (orderState?.status === 0 && (str3 === str2)) {
            return 0
        }
        // 调价
        if (orderState?.status === 1 && (str3 === str2)) {
            return 1
        }
        // 无法购买
        if (orderState?.status === 0 && (str3 !== str2)) {
            return 2
        }
        // 立即购买
        if (orderState?.status === 1 && (str3 !== str2)) {
            return 3
        }
    }
    // 刷新元数据
    const refreshFun = () => {
        dispatch(createSetLodingAction(true))
        getNFTMetadata(tokenAddress as string, tokenId as string).then((res: any) => {
            if (res.code === 200) {
                dispatch(createSetLodingAction(false))
                console.log(res.data, "nihao");
                setRefreshState(res.data)
                dispatch(createAddMessageAction(t("Refresh successfully")))
                // console.log(OrderDetail.normalizedMetadata, "刷新之后");
                if (!OrderDetail?.normalizedMetadata) {
                    OrderDetail.normalizedMetadata = res.data.normalizedMetadata;
                    // console.log(OrderDetail.normalizedMetadata, "刷新之后");
                }
            }
        }).finally(() => {
            dispatch(createSetLodingAction(false))
        })
    }



    useEffect(() => {
        if (tokenAddress && tokenId) {
            getTradeCoinNameList().then((res: any) => {
                console.log(res.data, '币种');
                if (res.code === 200) {
                    setCoinsKindData(res.data)
                }
            })
        }
    }, [tokenAddress, tokenId])

    useEffect(() => {
        if (tokenAddress && tokenId) {
            getNftOrderState(tokenId, -1, tokenAddress).then((res: any) => {
                console.log(res, 'NFT动态');
                if (res.code === 200) {
                    setTableData(res.data)
                }
            })
        }
    }, [tokenAddress, tokenId, saleNFTModal, buyNFTModal, showEnterCancel, showPriceChange])


    useEffect(() => {
        if (tokenAddress && tokenId) {
            // 首页订单状态判断&&获取持有人
            getNFTApiData(tokenId, tokenAddress).then((res: any) => {
                if (res.code === 200) {
                    setOrderState(res.data)
                    console.log(res.data, "NFT订单状态");
                }
            })
            // 出售完后获取NFT价格
            NFTDetailFun()
        }
    }, [tokenAddress, tokenId, saleNFTModal, buyNFTModal, showEnterCancel, showPriceChange])

    useEffect(() => {
        if (OrderDetail?.projectId) {
            getOrderByProject({
                projectId: OrderDetail?.projectId,
                currentPage: 1,
                pageSize: 6
            }).then(res => {
                res.data.map((item: any, index: number) => {
                    item.metadata = JSON.parse(item.metadata)
                })
                console.log(res.data, '来自这个项目');
                setProjectOrder(res.data)
            })
        }
    }, [OrderDetail?.projectId])

    useEffect(() => {
        if (state.token && OrderDetail?.projectId) {
            getOrderByProject({
                projectId: OrderDetail?.projectId,
                currentPage: 1,
                pageSize: 6
            }).then(res => {
                res.data.map((item: any, index: number) => {
                    item.metadata = JSON.parse(item.metadata)
                })
                console.log(res.data, '来自这个项目');
                setProjectOrder(res.data)
            })
        }
    }, [state.token, OrderDetail?.projectId])

    useEffect(() => {
        if (window.ethereum && window.ethereum.on) {
            // 监听钱包事件
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                setShowEnterCancel(false)
                setSaleNFTModal(false)
                setShowPriceChange(false)
                setBuyNFTModal(false)
            })
        }
    }, [web3React.account])

    return (
        <div className="NFTDetailsPage">
            <div className="contentBox">
                <div className="tabBox">
                    <div className='left m-hidden' onClick={(e) => { e.stopPropagation(); setNFTShow(!NFTShow) }} onMouseEnter={(e) => { setNFTShow(true) }} onMouseLeave={() => { setNFTShow(false) }}>
                        {
                            <img
                                id="nftImg"
                                src={OrderDetail?.normalizedMetadata?.image || defaultCard}
                                onError={(e: any) => {
                                    // 替换的图片
                                    e.target.src = defaultCard;
                                    // 控制不要一直触发错误
                                    e.onError = null;
                                }} alt="" />
                        }
                        <div className={NFTShow ? "NFTImgContainer NFTImgContainerIn" : "NFTImgContainer NFTImgContainerOut"}>
                            <div className="menuItem copyMenu">
                                <img onClick={(e) => { e.stopPropagation(); setIsShare(!isShare) }} src={SharePng} alt="" />
                                {isShare && <>
                                    <div className='copyLinkBox'>
                                        <div className="title">{t("Copy Link")}</div>
                                        <div className="outLink">{t("Share on Facebook")}</div>
                                        <div className="outLink">{t("Share on Twitter")}</div>
                                    </div>
                                </>}
                            </div>
                            <div className="menuItem likeMenu"><img src={FabulousPng} alt="" />{OrderDetail?.giveLikeNum}</div>
                            <div className="menuItem"><img onClick={(e) => { e.stopPropagation(); refreshFun() }} src={RefreshPng} alt="" /></div>
                            <div className="menuItem"><img onClick={(e) => { e.stopPropagation(); setImgState(OrderDetail?.normalizedMetadata?.image) }} src={widePng} alt="" /></div>
                        </div>
                    </div>

                    <div className='right'>
                        <h4 className='title'>
                            <div className='title-name'>{OrderDetail && OrderDetail?.normalizedMetadata?.name}</div>
                            <span className="icon l-hidden">
                                <Tooltip placement='bottom' title={<span style={{ fontWeight: 400, fontSize: "14px", color: "#000000" }}>CHAIN</span>} color="#FFF" key="coin">
                                    <img className='first' src={BinancePng} alt="" />
                                </Tooltip>
                                <Tooltip placement='bottom' title={<span style={{ fontWeight: 400, fontSize: "14px", color: "#000000" }}>TIPS</span>} color="#FFF" key="tips">
                                    <img src={TipsPng} alt="" />
                                </Tooltip>
                            </span>

                        </h4>
                        <div className="project">
                            <div className="name">
                                <img src={OrderDetail?.projectImg || defaultCard} alt="" className="logo" />
                                <div className="project-name" onClick={() => { navigate('/Launch?tokenAddress=' + OrderDetail?.tokenAddress) }}>{OrderDetail?.name}<AuthenticationGroup src={OrderDetail?.isAuthentication ? AuthenticationPng : NotAuthenticationPng} /></div>

                            </div>
                            <span className="icon m-hidden">
                                <Tooltip title={<span style={{ fontWeight: 400, fontSize: "14px", color: "#000000" }}>CHAIN</span>} color="#FFF" key="coin">
                                    <img className='first' src={BinancePng} alt="" />
                                </Tooltip>
                                <Tooltip title={<span style={{ fontWeight: 400, fontSize: "14px", color: "#000000" }}>TIPS</span>} color="#FFF" key="tips">
                                    <img src={TipsPng} alt="" />
                                </Tooltip>
                            </span>


                        </div>
                        <div className="owner">
                            <div className="name">
                                <div className="name">{t("Onwer")}</div>
                            </div>
                            {
                                <div className="address">
                                    <div className="account">
                                        {AddrHandle(refreshState?.owner_of || owner_of || orderState?.owner_of)} <img onClick={() => { CopyAddressFun(refreshState?.owner_of || owner_of as string || orderState?.owner_of) }} src={CopyPng} alt="" className="copy" />
                                    </div>
                                </div>}
                        </div>

                        <div className='left l-hidden'>
                            {
                                <img
                                    id="nftImg"
                                    src={OrderDetail?.normalizedMetadata?.image || defaultCard}
                                    onError={(e: any) => {
                                        // 替换的图片
                                        e.target.src = defaultCard;
                                        // 控制不要一直触发错误
                                        e.onError = null;
                                    }}
                                    alt="" />
                            }
                        </div>

                        <div className="sanlian l-hidden">
                            <div className="sanlian-container">
                                <div className="sanlian-content">
                                    <div className="shareBox">
                                        <img onClick={() => { setIsShare(!isShare) }} src={SharePng} alt="" />
                                        {isShare && <>
                                            <div className='copyLinkBox'>
                                                <div className="title">{t("Copy Link")}</div>
                                                <div className="outLink">{t("Share on Facebook")}</div>
                                                <div className="outLink">{t("Share on Twitter")}</div>
                                            </div>
                                        </>}
                                    </div>
                                    <div className="sanlian-box">
                                        <img src={FabulousPng} alt="" />
                                        <div className="sanlian-text">
                                            {OrderDetail?.giveLikeNum}
                                        </div>
                                    </div>
                                    <img onClick={() => { refreshFun() }} src={RefreshPng} alt="" />

                                </div>
                            </div>
                        </div>

                        {/* 出售 */}
                        {
                            stateFun() === 0 && <div className="sale flexCenter" onClick={() => { setSaleNFTModal(true) }}>
                                {t("Sell")}
                            </div>
                        }

                        {/* 调价 */}
                        {
                            stateFun() === 1 && <div className="buy">
                                <div className="buy-left">
                                    <div className="buy-left-top">{t("as fixed price")}</div>
                                    <div className="buy-left-bottom">
                                        <img src={OrderDetail?.nnftOrder?.coinImgUrl} className="buy-left-bottom-coin" />
                                        <div className="coin-group">
                                            {decimalNum(OrderDetail?.nnftOrder?.price) || '-'} {OrderDetail?.nnftOrder?.coinName}
                                            <div className="coin-group-price">
                                                (${decimalNum(OrderDetail?.nnftOrder?.uorderPrice) || '-'})
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="buy-right managePrice">
                                    <div className="buy-right-button flexCenter" onClick={() => { setShowPriceChange(true) }}>{t("Change the price")}</div>
                                    <div className="cancelBtn flexCenter" onClick={() => { setShowEnterCancel(true) }}>{t("Cancel")}</div>
                                </div>
                            </div>
                        }

                        {/* 未上架（别人未上架） */}
                        {
                            stateFun() === 2 && <div className="buy">
                                <div className="buy-left">
                                    <div className="buy-left-top">{t("Not list")}</div>
                                    <div className="buy-left-bottom">
                                        <div className="coin-group">
                                            -
                                        </div>
                                    </div>
                                </div>
                                <div className="buy-right">
                                    <div className="buy-right-button noSale" >{t("Buy now")}</div>
                                </div>
                            </div>
                        }

                        {/* 立即购买(别人已上架) */}
                        {
                            stateFun() === 3 && <div className="buyBox">
                                <div className="deadTime">
                                    {t("Sale ends at MARCH 8,2023 11:09", { year: OrderDetail?.nnftOrder?.pastTime[0], month: OrderDetail?.nnftOrder?.pastTime[1], day: OrderDetail?.nnftOrder?.pastTime[2], time: `${OrderDetail?.nnftOrder?.pastTime[3]}:${OrderDetail?.nnftOrder?.pastTime[4]}:${OrderDetail?.nnftOrder?.pastTime[5]}` })}
                                    <div className="line"></div>
                                </div>
                                <div id='buy'>
                                    <div className="buy-left">
                                        <div className="buy-left-top">{t("as fixed price")}</div>
                                        <div className="buy-left-bottom">
                                            <img src={OrderDetail?.nnftOrder?.coinImgUrl} className="buy-left-bottom-coin" />
                                            <div className="coin-group">
                                                {Number(decimalNum(OrderDetail?.nnftOrder?.price)) || '-'} {OrderDetail?.nnftOrder?.coinName}
                                                <div className="coin-group-price">
                                                    (${Number(decimalNum(OrderDetail?.nnftOrder?.uorderPrice)) || '-'})
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="buy-right">
                                        <div className="buy-right-button" onClick={() => { buyBtnFun(1) }}>{t("Buy now")}</div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="right-nft-details">
                            <div className="right-nft-details-tabs">
                                {
                                    TABS.map((item, idx) => <div key={idx} className={idx === tabIndex ? "right-nft-details-tab right-nft-details-activetab" : "right-nft-details-tab"} onClick={() => {
                                        setTabIndex(idx)
                                    }}>{item}</div>
                                    )
                                }
                            </div>
                            <div className="right-nft-details-tabcontent">
                                {
                                    !tabIndex ? <div className='nft-details-describe-group'>
                                        <div className="nft-details-describe">
                                            {
                                                OrderDetail?.normalizedMetadata?.description
                                            }
                                        </div>
                                        <div className="nft-details-card">
                                            <div className='nft-details-card-group nft-details-card-group-frist' >
                                                <div className="nft-details-card-title">
                                                    {t("Last traded price")}
                                                </div>
                                                <div className="nft-details-card-price">
                                                    {/* {NumSplic(OrderDetail?.recentPrice)} <span className='coinName'> USDT</span> <div className='U'>(${NumSplic(OrderDetail?.tradeUNum, 2) || 0})</div> */}
                                                    {NumSplic(OrderDetail?.tradeUNum, 2) || 0} <span className='coinName'> {OrderDetail?.coinName}</span> <div className='U'>(${NumSplic(OrderDetail?.recentPrice, 2) || 0})</div>
                                                </div>
                                            </div>
                                            <div className="nft-details-card-group nft-details-card-group-center" >
                                                <div className="nft-details-card-title">
                                                    {t("Transactions")}
                                                </div>
                                                <div className="nft-details-card-price">
                                                    {OrderDetail?.tradeCount || 0}
                                                </div>
                                            </div>
                                            <div className="nft-details-card-group  nft-details-card-group-last">
                                                <div className="nft-details-card-title">
                                                    {t("Floor")}
                                                </div>
                                                <div className="nft-details-card-price">
                                                    {decimalNum(OrderDetail?.floorPriceDouble) || "0"} <span className='coinName'> USDT</span>
                                                </div>
                                            </div>
                                            {/* {
                                                nftData.map((item, index) => <div className={`nft-details-card-group ${!index ? "nft-details-card-group-frist" : (index === nftData.length - 1 ? "nft-details-card-group-last" : "nft-details-card-group-center")}`} >
                                                    <div className="nft-details-card-title">
                                                        {item.title}
                                                    </div>
                                                    <div className="nft-details-card-price">
                                                        {item.price}
                                                    </div>
                                                </div>)
                                            } */}

                                        </div>
                                    </div> : (tabIndex === 1 ? <div className='nft-details-attribute-group'>
                                        {
                                            width > 425 ? <>{
                                                (OrderDetail && OrderDetail?.normalizedMetadata && OrderDetail?.normalizedMetadata?.attributes?.length > 0) ? OrderDetail?.normalizedMetadata?.attributes.map((item: any, idx: any) =>
                                                    <div className={`nft-details-attribute-item ${!((idx + 1) % 3) ? "nft-details-attribute-item-right" : ""}`}>
                                                        <Tooltip color="#D5DBFF" placement="topLeft" title={<span style={{ fontWeight: 400, fontSize: "14px", color: "#7285FF" }}>{item.trait_type}</span>}>
                                                            <div className="nft-details-attribute-title">
                                                                {item.trait_type}
                                                            </div>
                                                        </Tooltip>
                                                        <Tooltip color="#D5DBFF" placement="topLeft" title={<span style={{ fontWeight: 400, fontSize: "14px", color: "#7285FF" }}>{item.value}</span>}>
                                                            <div className="nft-details-attribute-content">
                                                                {item.value}
                                                            </div>
                                                        </Tooltip>
                                                    </div>) : <NoData />
                                            }
                                            </> : <div className='mobileAddrContent'>{
                                                (OrderDetail && OrderDetail?.normalizedMetadata && OrderDetail?.normalizedMetadata?.attributes?.length > 0) ? OrderDetail?.normalizedMetadata?.attributes.map((item: any, idx: any) =>
                                                    <div className='mobileAddr'>
                                                        <div className="topAddr">{item.trait_type}</div>
                                                        <div className="bottomAddr">{item.value}</div>

                                                    </div>) : <NoData />
                                            }
                                            </div>
                                        }
                                    </div> : (tabIndex === 2 ?
                                        <div className="nft-details-info-group">
                                            <div className="nft-details-info-item">
                                                <div className="nft-details-info-item-title">
                                                    {t("Contract address")}
                                                </div>
                                                <div className="nft-details-info-item-content activeItem"  >
                                                    <span className='activeItem' onClick={() => { window.open('https://bscscan.com/address/' + OrderDetail?.tokenAddress) }}>{AddrHandle(OrderDetail?.tokenAddress, 10, 6)}</span>  <img onClick={() => { CopyAddressFun(OrderDetail?.tokenAddress) }} src={CopyPng} alt="" className="copy" />
                                                </div>
                                            </div>
                                            <div className="nft-details-info-item">
                                                <div className="nft-details-info-item-title">
                                                    {t("Token ID")}
                                                </div>
                                                <div className="nft-details-info-item-content activeItem" >
                                                    <span className='activeItem' onClick={() => { window.open(OrderDetail?.tokenUri) }}> {OrderDetail && (OrderDetail?.tokenId?.length > 16 ? AddrHandle(OrderDetail?.tokenId, 10, 6) : OrderDetail?.tokenId)}</span><img onClick={() => { CopyAddressFun(OrderDetail?.tokenId) }} src={CopyPng} alt="" className="copy" />
                                                </div>
                                            </div>
                                            <div className="nft-details-info-item">
                                                <div className="nft-details-info-item-title">
                                                    {t("Chain")}
                                                </div>
                                                <div className="nft-details-info-item-content">
                                                    BNB Chain
                                                </div>
                                            </div>
                                            <div className="nft-details-info-item">
                                                <div className="nft-details-info-item-title">
                                                    {t("Creator earnings")}
                                                    <Tooltip color="#D5DBFF" placement="topLeft" title={<span style={{ fontWeight: 400, fontSize: "14px", color: "#7285FF" }}>{t("The craator", { value: Math.floor((OrderDetail?.nnftOrder?.createFee || OrderDetail?.createFee) / 1000) })}</span>}>
                                                        <ExclamationCircleOutlined style={{ cursor: "pointer", marginRight: "12px" }} />
                                                    </Tooltip>
                                                </div>
                                                <div className="nft-details-info-item-content">
                                                    {Math.floor((OrderDetail?.nnftOrder?.createFee || OrderDetail?.createFee) / 1000)}%
                                                </div>
                                            </div>
                                        </div> : null))
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* 
                <div className="sanlian m-hidden">
                    <div className="sanlian-container">
                        <div className="sanlian-content">
                            <div className="shareBox">
                                <img onClick={() => { setIsShare(!isShare) }} src={SharePng} alt="" />
                                {isShare && <>
                                    <div className='copyLinkBox'>
                                        <div className="title">{t("Copy Link")}</div>
                                        <div className="outLink">{t("Share on Facebook")}</div>
                                        <div className="outLink">{t("Share on Twitter")}</div>
                                    </div>
                                </>}
                            </div>
                            <div className="sanlian-box">
                                <img src={FabulousPng} alt="" />
                                <div className="sanlian-text">
                                    {OrderDetail?.giveLikeNum}
                                </div>
                            </div>
                            <img onClick={() => { refreshFun() }} src={RefreshPng} alt="" />

                        </div>
                    </div>
                </div> 
                */}


                {
                    tableData.length > 0 && <ActionBox tag="NFTDetailsL" expand1={expand1} typeMenu={typeMenu} tableData={tableData}></ActionBox>
                }

                {/* 来自这个项目 */}
                <div className='likeProjectBox'>
                    <div className="titleBox">
                        <div className="subTitle">{t("From this project")}</div>
                    </div>
                    <div className=" contentBoxM">
                        {
                            projectOrder.length > 0 ?
                                <>
                                    <div className="goodsList">
                                        {projectOrder.map((item: any, index: any) =>
                                            <div className="usernft">
                                                <Goods key={index} NftInfo={{ ...item, floorPrice: item.price }} buyBtnFun={() => { buyBtnFun(item) }} tag="Market" target="NFTCard" goPath={() => { goPath(item) }}></Goods>
                                                {/* <Goods key={index} NftInfo={{ ...item, floorPrice: item.price }} buyBtnFun={() => { buyBtnFun(item) }} tag="Market" goPath={() => { goPath(item) }}></Goods> */}
                                            </div>
                                        )}
                                    </div>
                                    <div className="LoadMore pointer flexCenter" onClick={LoadMore}>{t('Load More')}  {'>'}</div>
                                </> : <NoData />
                        }
                    </div>
                </div>
            </div>
            {
                isShare && <div className="Mask" onClick={() => { setIsShare(!isShare) }}></div>
            }
            {imgState && <Image width={200} src={imgState} />}


            {OrderDetail && <ManageModal NFTDetail={OrderDetail} key={showPriceChange + "" + showEnterCancel} coinKind={coinsKindData} isShow={showPriceChange} tokenId={OrderDetail?.nnftOrder?.tokenId} personalFees={OrderDetail?.nnftOrder?.createFee} coinName={OrderDetail?.nnftOrder?.coinName as string} orderId={OrderDetail?.nnftOrder?.id as number} close={() => { setShowPriceChange(false) }}></ManageModal>}
            {OrderDetail && <CancelSaleModal isShow={showEnterCancel} tokenId={OrderDetail?.nnftOrder?.tokenId} orderId={OrderDetail?.nnftOrder?.id as number} close={() => { setShowEnterCancel(false) }}></CancelSaleModal>}
            {OrderDetail && coinsKindData.length > 0 && <SaleModal key={showEnterCancel + "" + saleNFTModal} NFTDetail={OrderDetail} coinKind={coinsKindData} isShow={saleNFTModal} close={() => { setSaleNFTModal(false) }} data={{ nftName: OrderDetail!.normalizedMetadata.name, projectName: OrderDetail!.name, image: OrderDetail!.normalizedMetadata.image, id: OrderDetail!.id, tokenId: OrderDetail!.tokenId, tokenAddress: OrderDetail!.tokenAddress, personalFees: OrderDetail?.nnftOrder?.createFee || OrderDetail?.createFee }}></SaleModal>}
            {OrderDetail && <ConfirmBuyNFTModal projectName={OrderDetail?.name} NFTInfo={OrderDetail?.nnftOrder} NFTDetail={OrderDetail} isShow={buyNFTModal} close={() => { setBuyNFTModal(false) }} ></ConfirmBuyNFTModal>}
        </div >
    )
}
