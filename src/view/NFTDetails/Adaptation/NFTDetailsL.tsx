
import { Tooltip, Menu, Dropdown, Collapse, Space } from 'antd';
import copy from "copy-to-clipboard"
import BinancePng from '../../../assets/image/nftDetails/binance.png'
import TipsPng from '../../../assets/image/nftDetails/tips.png'
import CopyPng from '../../../assets/image/nftDetails/copy.png'
import UsdtPng from '../../../assets/image/nftDetails/usdt.png'
import SharePng from '../../../assets/image/nftDetails/share.png'
import FabulousPng from '../../../assets/image/nftDetails/fabulous.png'
import RefreshPng from '../../../assets/image/nftDetails/refresh.png'
import NFTImage from '../../../assets/image/4.png'
import demoTestImg from '../../../assets/image/demoTestImg.png'
import authentication from '../../../assets/image/authentication.png'
import openIcon from '../../../assets/image/openIconWhite.png'
import switchIcon from '../../../assets/image/switchIcon.png'
import './NFTDetailsL.scss'
import { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { ExclamationCircleOutlined } from '@ant-design/icons'
import Goods, { NftInfo } from '../../../components/HotspotCard'
import { useSearchParams, useNavigate } from "react-router-dom";
import { getNftOrderState, getNftUserInfoDetail, getUserOrder } from '../../../API'
import { stateType } from '../../../store/reducer'
import { createAddMessageAction } from "../../../store/actions"

import ManageModal from '../../../components/ManageModal'
import CancelSaleModal from '../../../components/CancelSaleModal'
import ConfirmBuyModal from '../../../components/ConfirmBuyModal'
import SaleNFTModal from '../../../components/SaleNFTModal'
import SaleModal from '../../../components/SaleModal'
import ConfirmBuyNFTModal from '../../../components/ConfirmBuyNFTModal'
import NoData from '../../../components/NoData'

import defaultCard from '../../../assets/image/defaultCard.png'
import { useWeb3React } from '@web3-react/core'
import { AddrHandle, HowLongAgo } from '../../../utils/tool'
import { useTranslation } from 'react-i18next'
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useViewport } from '../../../components/viewportContext';

import NotCertified from '../../../assets/image/NotCertified.png'
import { decimalNum } from '../../../utils/decimalNum';

const TABS = ["描述",
    "属性",
    "信息"
]

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
export default function NFTDetailsL({
    OrderDetail,
    CopyLink,
    attrOrInfo,
    NFTTypeDetail
}: any) {
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
    let [isShare, setIsShare] = useState<boolean>(false)
    let [buyNFTModal, setBuyNFTModal] = useState<boolean>(false)
    let [showEnterCancel, setShowEnterCancel] = useState<boolean>(false)
    let [currentTradeOrder, setCurrentTradeOrder] = useState<NftInfo>()
    let [OrderNFTDetail, setOrderNFTDetail] = useState<OrderDetailType | undefined>(undefined)

    const [nftData, setNftData] = useState([{
        title: "总市值",
        price: "0.55",
        range: "-254"
    }, {
        title: "交易额(24H)",
        price: "0.55",
        range: "45.56"

    }, {
        title: "地板价",
        price: "0.55",
        range: "-254"

    }])
    let [UserOrder, setUserOrder] = useState<NftInfo[]>([])
    const [activeKey, setActiveKey] = useState("");

    const [params] = useSearchParams();
    let DynamicStateMap = [
        {
            key: "全部",
            value: -1
        },
        {
            key: t('Listing'),
            value: 0
        },
        {
            key: t('Sale'),
            value: 1
        },
        {
            key: t('Cancel an order'),
            value: 2
        },
        {
            key: t('Send'),
            value: 3
        }
    ];
    let tokenId = params.get('tokenId')
    let tokenAddress = params.get('tokenAddress')
    let owner_of = params.get('owner_of')
    let operateTtype = [
        "上架",
        "成交",
        "取消",
        "转出",
        "调价",
    ]
    const handleDropDown = (fun: any, value: boolean) => {
        fun(!value);
    }
    // 确认购买
    const buyBtnFun = () => {
        setBuyNFTModal(true)
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
            <Menu.Item>全部</Menu.Item>
        </Menu>
    );
    useEffect(() => {
        if (state.token && tokenAddress && tokenId) {
            getNftUserInfoDetail(tokenAddress as string, tokenId).then(res => {
                if (res.data.metadata) {
                    res.data.metadata = JSON.parse(res.data.metadata)
                    res.data.normalizedMetadata = JSON.parse(res.data.normalizedMetadata
                    )
                }
                console.log(res.data, "OrderNFTDetail");
                setOrderNFTDetail(res.data)
                if (state.token) {
                    getUserOrder(res.data.userAddress).then(res => {
                        setUserOrder(res.data)
                    })
                }
            })
            getNftOrderState(tokenId, -1, tokenAddress).then((res: any) => {
                console.log(res, 'NFT动态');
                if (res.code === 200) {
                    setTableData(res.data)
                }
            })
        }
    }, [state.token, tokenAddress, tokenId])

    return (
        <div className="NFTDetailsPage">
            <div className="contentBox">
                <div className="tabBox">
                    <div className='left m-hidden'>
                        {
                            <img
                                id="nftImg"
                                src={OrderDetail?.normalizedMetadata.image || defaultCard}
                                onError={(e: any) => {
                                    // 替换的图片
                                    e.target.src = defaultCard;
                                    // 控制不要一直触发错误
                                    e.onError = null;
                                }}
                                alt="" />
                        }
                    </div>
                    <div className='right'>
                        <h4 className='title'>
                            <div className='title-name'>{OrderDetail && OrderDetail?.name}</div>
                            <span className="icon l-hidden">
                                <Tooltip title={<span style={{ fontWeight: 400, fontSize: "14px", color: "#000000" }}>CHAIN</span>} color="#FFF" key="coin">
                                    <img className='first' src={BinancePng} alt="" />
                                </Tooltip>
                                <Tooltip title={<span style={{ fontWeight: 400, fontSize: "14px", color: "#000000" }}>TIPS</span>} color="#FFF" key="tips">
                                    <img src={TipsPng} alt="" />
                                </Tooltip>
                            </span>

                        </h4>
                        <div className="project">
                            <div className="name">
                                <img src={NFTImage} alt="" className="logo" />
                                <div className="project-name">{OrderDetail && OrderDetail.normalizedMetadata.name}</div>
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
                                <div className="name">持有者</div>
                            </div>
                            {
                                <div className="address">
                                    <div className="account">
                                        {owner_of?.slice(0, 6)}...{owner_of?.slice(owner_of.length - 4)} <img onClick={() => { CopyAddressFun(owner_of as string) }} src={CopyPng} alt="" className="copy" />
                                    </div>
                                </div>}
                        </div>

                        <div className='left l-hidden'>
                            {
                                <img
                                    id="nftImg"
                                    src={OrderDetail?.normalizedMetadata.image || defaultCard}
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
                                                <div className="title">复制链接</div>
                                                <div className="outLink">在Facebook上分享</div>
                                                <div className="outLink">在Twitter上分享</div>
                                            </div>
                                        </>}
                                    </div>
                                    <div className="sanlian-box">
                                        <img src={FabulousPng} alt="" />
                                        <div className="sanlian-text">
                                            100
                                        </div>
                                    </div>
                                    <img src={RefreshPng} alt="" />

                                </div>
                            </div>
                        </div>

                        {/* 出售 */}
                        {
                            NFTTypeDetail === "0" && (owner_of?.toLocaleLowerCase() === web3React.account?.toLocaleLowerCase()) && <div className="sale flexCenter" onClick={() => { setSaleNFTModal(true) }}>
                                出售
                            </div>
                        }

                        {/* 调价 */}
                        {
                            NFTTypeDetail === "1" && (owner_of?.toLocaleLowerCase() === web3React.account?.toLocaleLowerCase()) && <div className="buy">
                                <div className="buy-left">
                                    <div className="buy-left-top">一口价</div>
                                    <div className="buy-left-bottom">
                                        <img src={UsdtPng} className="buy-left-bottom-coin" />
                                        <div className="coin-group">
                                            {decimalNum(OrderDetail?.nnftOrder?.price) || '-'} {OrderDetail?.nnftOrder?.coinName}
                                            <div className="coin-group-price">
                                                (${decimalNum(OrderDetail?.nnftOrder?.uorderPrice) || '-'})
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="buy-right managePrice">
                                    <div className="buy-right-button flexCenter" onClick={() => { setShowPriceChange(true) }}>调整价格</div>
                                    <div className="cancelBtn flexCenter" onClick={() => { setShowEnterCancel(true) }}>取消</div>
                                </div>
                            </div>
                        }

                        {/* 未上架（别人未上架） */}
                        {
                            NFTTypeDetail === "0" && (owner_of?.toLocaleLowerCase() !== web3React.account?.toLocaleLowerCase()) && <div className="buy">
                                <div className="buy-left">
                                    <div className="buy-left-top">未上架</div>
                                    <div className="buy-left-bottom">
                                        <div className="coin-group">
                                            -
                                        </div>
                                    </div>
                                </div>
                                <div className="buy-right">
                                    <div className="buy-right-button noSale" >立即购买</div>
                                </div>
                            </div>
                        }

                        {/* 立即购买(别人已上架) */}
                        {
                            NFTTypeDetail === "1" && (owner_of?.toLocaleLowerCase() !== web3React.account?.toLocaleLowerCase()) && <div className="buy">
                                <div className="buy-left">
                                    <div className="buy-left-top">一口价</div>
                                    <div className="buy-left-bottom">
                                        <img src={UsdtPng} className="buy-left-bottom-coin" />
                                        <div className="coin-group">
                                            {Number(decimalNum(OrderDetail?.nnftOrder?.price)) || '-'} {OrderDetail?.nnftOrder?.coinName}
                                            <div className="coin-group-price">
                                                (${Number(decimalNum(OrderDetail?.nnftOrder?.uorderPrice))|| '-'})
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="buy-right">
                                    <div className="buy-right-button" onClick={() => { buyBtnFun() }}>立即购买</div>
                                </div>
                            </div>
                        }

                        <div className="right-nft-details">
                            <div className="right-nft-details-tabs">
                                {
                                    TABS.map((item, idx) => <div className={idx === tabIndex ? "right-nft-details-tab right-nft-details-activetab" : "right-nft-details-tab"} onClick={() => {
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
                                                OrderDetail && OrderDetail.normalizedMetadata?.description
                                            }
                                        </div>
                                        <div className="nft-details-card">
                                            {
                                                nftData.map((item, index) => <div className={`nft-details-card-group ${!index ? "nft-details-card-group-frist" : (index === nftData.length - 1 ? "nft-details-card-group-last" : "nft-details-card-group-center")}`} >
                                                    <div className="nft-details-card-title">
                                                        {item.title}
                                                    </div>
                                                    <div className="nft-details-card-price">
                                                        ${item.price}
                                                    </div>
                                                    <div className={Number(item.range) < 0 ? "nft-details-card-range-down" : "nft-details-card-range-up"}>
                                                        {Number(item.range) < 0 ? `${item.range}%` : `+${item.range}%`}
                                                    </div>
                                                </div>)
                                            }

                                        </div>
                                    </div> : (tabIndex === 1 ? <div className='nft-details-attribute-group'>
                                        {
                                            attrOrInfo ? <>{
                                                OrderDetail && OrderDetail?.normalizedMetadata && OrderDetail?.normalizedMetadata?.attributes.length > 0 && Object.keys(OrderDetail?.normalizedMetadata?.attributes[0]).map((item, idx) =>
                                                    <div className={`nft-details-attribute-item ${!((idx + 1) % 3) ? "nft-details-attribute-item-right" : ""}`}>

                                                        <div className="nft-details-attribute-title">
                                                            {item}
                                                        </div>
                                                        <div className="nft-details-attribute-content">
                                                            ({OrderDetail && OrderDetail?.normalizedMetadata?.attributes.length > 0 && OrderDetail?.normalizedMetadata?.attributes[0][item]})
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            </> : null
                                        }
                                    </div> : (tabIndex === 2 ?
                                        <div className="nft-details-info-group">
                                            <div className="nft-details-info-item">
                                                <div className="nft-details-info-item-title">
                                                    合约地址
                                                </div>
                                                <div className="nft-details-info-item-content">
                                                    {AddrHandle(OrderDetail?.tokenAddress, 10, 6)}
                                                </div>
                                            </div>
                                            <div className="nft-details-info-item">
                                                <div className="nft-details-info-item-title">
                                                    代币ID
                                                </div>
                                                <div className="nft-details-info-item-content">
                                                    {OrderDetail && (OrderDetail.tokenId.length > 16 ? AddrHandle(OrderDetail.tokenId, 10, 6) : OrderDetail.tokenId)}
                                                </div>
                                            </div>
                                            <div className="nft-details-info-item">
                                                <div className="nft-details-info-item-title">
                                                    链
                                                </div>
                                                <div className="nft-details-info-item-content">
                                                    BNB Chain
                                                </div>
                                            </div>
                                            <div className="nft-details-info-item">
                                                <div className="nft-details-info-item-title">
                                                    创作者收益
                                                    <Tooltip color="#D5DBFF" placement="topLeft" title={<span style={{ fontWeight: 400, fontSize: "14px", color: "#7285FF" }}>此项目的创作者每次销售都会收到10%</span>}>
                                                        <ExclamationCircleOutlined style={{ cursor: "pointer" }} />
                                                    </Tooltip>
                                                </div>
                                                <div className="nft-details-info-item-content">
                                                    10%
                                                </div>
                                            </div>
                                        </div> : null))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sanlian m-hidden">
                    <div className="sanlian-container">
                        <div className="sanlian-content">
                            <div className="shareBox">
                                <img onClick={() => { setIsShare(!isShare) }} src={SharePng} alt="" />
                                {isShare && <>
                                    <div className='copyLinkBox'>
                                        <div className="title">复制链接</div>
                                        <div className="outLink">在Facebook上分享</div>
                                        <div className="outLink">在Twitter上分享</div>
                                    </div>
                                </>}
                            </div>
                            <div className="sanlian-box">
                                <img src={FabulousPng} alt="" />
                                <div className="sanlian-text">
                                    100
                                </div>
                            </div>
                            <img src={RefreshPng} alt="" />

                        </div>
                    </div>
                </div>

                {/* 大屏动态 */}
                {width > 768 && <div className='activeBox'>
                    <div className="itemBigBox">
                        <div className="titleBox">
                            <div className="activeTip flexCenter">动态</div>
                            <div className="right">
                                <div className="dropDownBox">
                                    <div className="MarketSearchRow">
                                        <Dropdown overlay={typeMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand1, expand1)}>
                                            <div className="search">
                                                <div className="searchBox">全部</div>
                                                <img className={expand1 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                                            </div>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="switch"><img src={switchIcon} alt="" /></div>
                            </div>
                        </div>
                        <div className="contentBox">
                            <div className="itemBox NFTDetailsTitleBox">
                                <div className="item type">类型</div>
                                <div className="item">物品</div>
                                <div className="item">价格</div>
                                <div className="item">从</div>
                                <div className="item">到</div>
                                <div className="item date">日期</div>
                            </div>
                            {tableData.length > 0 &&
                                tableData.map((item: any, index: number) => <div key={index} className="itemBox">
                                    <div className="item type">
                                        <div className="top">{operateTtype[item.operateType]}</div>
                                        <div className="bottom">{t('as fixed price')}</div>
                                    </div>
                                    <div className="item projectName">
                                        <div className="leftBox">
                                            <img src={item.projectLogo} alt="" />
                                        </div>
                                        <div className="right">
                                            <div className="top">{item.projectName} {item.isAuthentication === 1 ? <img src={authentication} alt="" /> : <img src={NotCertified} alt="" />}</div>
                                            <div className="bottom">{item.nftName}</div>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="top">{item.uorderPrice}</div>
                                        <div className="bottom">{item.num} {item.coinName}</div>
                                    </div>
                                    <div className="item" onClick={() => { goSomeone(item.formAddress) }}>
                                        {
                                            item.formAddress ? AddrHandle(item.formAddress, 6, 4) : '-'
                                        }
                                    </div>
                                    <div className="item" onClick={() => { goSomeone(item.toAddress) }}>
                                        {
                                            item.toAddress ? AddrHandle(item.toAddress, 6, 4) : '-'
                                        }
                                    </div>
                                    <div className="item date">
                                        {HowLongAgo(item.createTime)}
                                    </div>
                                </div>)
                            }


                        </div>
                    </div>
                </div>}
                {/* 小屏动态 */}
                {width < 768 && <div className="itemBigBox ">
                    <div className="contentBox">
                        <Space direction="vertical">
                            <Collapse activeKey={activeKey} expandIcon={() => <></>} defaultActiveKey={['1']}>
                                {tableData.length > 0 ? tableData.map((item: any, index: number) =>
                                    <Fragment>
                                        <Collapse.Panel
                                            header={
                                                <div className="itemBox">
                                                    <div className="item type">
                                                        <div className="top">{operateTtype[item.operateType]}</div>
                                                        <div className="bottom">一口价</div>
                                                    </div>
                                                    <div className='group'>
                                                        <div className="item projectName">
                                                            <div className="leftBox">
                                                                <img src={item.projectLogo} alt="" />
                                                            </div>
                                                            <div className="right">
                                                                <div className="top">{item.projectName} {item.isAuthentication === 1 ? <img src={authentication} alt="" /> : <img src={NotCertified} alt="" />}</div>
                                                                <div className="bottom">{item.nftName}</div>
                                                            </div>
                                                        </div>
                                                        <div className="item project-price">
                                                            <div className="top">{Number(decimalNum(item.uorderPrice, 4))}</div>
                                                            <div className="bottom">{Number(decimalNum(item.num, 4))} {item.coinName}</div>
                                                        </div>
                                                        <div className='drap-icon' onClick={() => {
                                                            if (activeKey === (index + "")) {
                                                                setActiveKey("")
                                                            } else {
                                                                setActiveKey(index + "")
                                                            }
                                                        }} >
                                                            {
                                                                activeKey !== "1" ? <DownOutlined /> : <UpOutlined />
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            } key={index + ""}>
                                            <div className="group">
                                                <div className="item">
                                                    <div className="text" onClick={() => { goSomeone(item.formAddress) }}>
                                                        {
                                                            item.formAddress ? AddrHandle(item.formAddress, 6, 4) : '-'
                                                        }
                                                    </div>
                                                    <div className="type">从</div>
                                                </div>
                                                <div className="item">
                                                    <div className="text" onClick={() => { goSomeone(item.toAddress) }}>
                                                        {
                                                            item.toAddress ? AddrHandle(item.toAddress, 6, 4) : '-'
                                                        }
                                                    </div>
                                                    <div className="type">到</div>

                                                </div>
                                                <div className="item date">
                                                    <div className="text type-date">
                                                        {HowLongAgo(item.createTime)}
                                                    </div>
                                                    <div className="type">日期</div>
                                                </div>
                                            </div>
                                        </Collapse.Panel>
                                        <div className="separate" style={{ display: tableData.length === (index + 1) ? "none" : "block" }}></div>
                                    </Fragment>
                                ) : <NoData />}
                            </Collapse>
                        </Space>
                    </div>
                </div>}

                {/* 来自这个项目 */}
                <div className='activeBox'>
                    <div className="itemBigBox">
                        <div className="titleBox">
                            <div className="subTitle">来自这个项目</div>
                        </div>
                        <div className="contentBox">
                            <div className="goodsList">
                                {
                                    [1, 2, 3, 4].map((item) => <div className="goods-item">
                                        <Goods></Goods>
                                    </div>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <ManageModal isShow={true} close={() => { setManageModal(false) }} ></ManageModal> */}
            {OrderDetail && <ManageModal isShow={showPriceChange} tokenId={OrderDetail?.nnftOrder?.tokenId} coinName={OrderDetail?.nnftOrder?.coinName as string} orderId={OrderDetail?.nnftOrder?.id as number} close={() => { setShowPriceChange(false) }}></ManageModal>}
            {/* <CancelSaleModal isShow={false} close={() => { setManageModal(false) }} ></CancelSaleModal> */}
            {OrderDetail && <CancelSaleModal isShow={showEnterCancel} tokenId={OrderDetail?.nnftUser?.tokenId} orderId={OrderDetail?.nnftOrder?.id as number} close={() => { setShowEnterCancel(false) }}></CancelSaleModal>}
            <ConfirmBuyModal isShow={false} close={() => { setManageModal(false) }} ></ConfirmBuyModal>
            <ConfirmBuyModal isShow={false} close={() => { setManageModal(false) }} ></ConfirmBuyModal>
            {OrderDetail && <SaleModal isShow={saleNFTModal} close={() => { setSaleNFTModal(false) }} data={{ nftName: OrderDetail!.normalizedMetadata.name, projectName: OrderDetail!.name, image: OrderDetail!.normalizedMetadata.image, id: OrderDetail!.id, tokenId: OrderDetail!.tokenId, tokenAddress: OrderDetail!.tokenAddress }}></SaleModal>}
            {OrderDetail && <ConfirmBuyNFTModal NFTInfo={OrderDetail?.nnftOrder} NFTDetail={OrderDetail} isShow={buyNFTModal} close={() => { setBuyNFTModal(false) }} ></ConfirmBuyNFTModal>}
        </div >
    )
}
