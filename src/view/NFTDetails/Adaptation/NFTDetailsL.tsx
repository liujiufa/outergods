
import { Tooltip, Menu, Dropdown } from 'antd'
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
import { Fragment, useState } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import Goods, { NftInfo } from '../../../components/HotspotCard'
import { useSearchParams, useNavigate } from "react-router-dom";
import ManageModal from '../../../components/ManageModal'
import CancelSaleModal from '../../../components/CancelSaleModal'
import ConfirmBuyModal from '../../../components/ConfirmBuyModal'
import SaleNFTModal from '../../../components/SaleNFTModal'
import SaleModal from '../../../components/SaleModal'
import ConfirmBuyNFTModal from '../../../components/ConfirmBuyNFTModal'

import defaultCard from '../../../assets/image/defaultCard.png'
import { useWeb3React } from '@web3-react/core'
import { AddrHandle } from '../../../utils/tool'

const TABS = ["描述",
    "属性",
    "信息"
]
export default function NFTDetailsL({
    OrderDetail,
    CopyLink,
    attrOrInfo,
    NFTTypeDetail
}: any) {
    console.log(OrderDetail, 'NFT详情---------');

    let [showPriceChange, setShowPriceChange] = useState<boolean>(false)
    const web3React = useWeb3React()

    console.log("web3React", web3React)
    const [tabIndex, setTabIndex] = useState(0)
    const [expand1, setExpand1] = useState(true)
    const [manageModal, setManageModal] = useState(false)
    const [saleNFTModal, setSaleNFTModal] = useState(false)
    let [buyNFTModal, setBuyNFTModal] = useState<boolean>(false)
    let [showEnterCancel, setShowEnterCancel] = useState<boolean>(false)
    let [currentTradeOrder, setCurrentTradeOrder] = useState<NftInfo>()
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
    const [params] = useSearchParams();

    let ID = params.get('ID')
    let tokenAddress = params.get('tokenAddress')
    let owner_of = params.get('owner_of')

    const handleDropDown = (fun: any, value: boolean) => {
        fun(!value);
    }
    // 确认购买
    const buyBtnFun = () => {
        setBuyNFTModal(true)
    }

    let typeMenu = (
        <Menu onClick={() => handleDropDown(setExpand1, expand1)}>
            <Menu.Item>全部</Menu.Item>
        </Menu>
    );

    return (
        <div className="NFTDetailsPage">
            <div className="contentBox">
                <div className="tabBox">
                    <div className='left'>
                        {
                            OrderDetail && <img
                                id="nftImg"
                                src={OrderDetail.normalizedMetadata.image || defaultCard}
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
                            {OrderDetail && OrderDetail?.name}
                        </h4>
                        <div className="project">
                            <div className="name">
                                <img src={NFTImage} alt="" className="logo" />
                                <div className="project-name">{OrderDetail && OrderDetail.normalizedMetadata.name}</div>
                            </div>
                            <span className="icon">
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
                                !!web3React.account && <div className="address">
                                    <div className="account">
                                        {web3React.account?.slice(0, 6)}...{web3React.account?.slice(web3React.account.length - 4)} <img onClick={CopyLink} src={CopyPng} alt="" className="copy" />
                                    </div>
                                </div>}
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
                                            {OrderDetail?.nnftOrder?.price || '-'} {OrderDetail?.nnftOrder?.coinName}
                                            <div className="coin-group-price">
                                                (${OrderDetail?.nnftOrder?.uorderPrice || '-'})
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
                                            {OrderDetail?.nnftOrder?.price || '-'} {OrderDetail?.nnftOrder?.coinName}
                                            <div className="coin-group-price">
                                                (${OrderDetail?.nnftOrder?.uorderPrice || '-'})
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
                                                OrderDetail && OrderDetail.normalizedMetadata && Object.keys(OrderDetail.normalizedMetadata?.attributes[0]).map((item, idx) =>
                                                    <div className={`nft-details-attribute-item ${!((idx + 1) % 3) ? "nft-details-attribute-item-right" : ""}`}>

                                                        <div className="nft-details-attribute-title">
                                                            {item}
                                                        </div>
                                                        <div className="nft-details-attribute-content">
                                                            ({OrderDetail && OrderDetail?.normalizedMetadata?.attributes[0][item]})
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
                <div className="sanlian">
                    <div className="sanlian-container">
                        <div className="sanlian-content">
                            <div className="shareBox">
                                <img src={SharePng} alt="" />
                                {true && <>
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
                {/* 动态 */}
                <div className='activeBox'>
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
                        {false && <div className="contentBox">
                            <div className="itemBox NFTDetailsTitleBox">
                                <div className="item type">类型</div>
                                <div className="item">物品</div>
                                <div className="item">价格</div>
                                <div className="item">从</div>
                                <div className="item">到</div>
                                <div className="item date">日期</div>
                            </div>
                            <div className="itemBox">
                                <div className="item type">
                                    <div className="top">上架</div>
                                    <div className="bottom">一口价</div>
                                </div>
                                <div className="item projectName">
                                    <div className="leftBox">
                                        <img src={demoTestImg} alt="" />
                                    </div>
                                    <div className="right">
                                        <div className="top">项目名称 <img src={authentication} alt="" /></div>
                                        <div className="bottom">NFT名称</div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="top">$234.87</div>
                                    <div className="bottom">0.32 BNB</div>
                                </div>
                                <div className="item">
                                    Ox2423...sdw7
                                </div>
                                <div className="item">
                                    Ox2423...12FF
                                </div>
                                <div className="item date">
                                    5分钟前
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
                {/* 来自这个项目 */}
                <div className='activeBox'>
                    <div className="itemBigBox">
                        <div className="titleBox">
                            <div className="subTitle">来自这个项目</div>
                        </div>
                        <div className="contentBox">
                            <div className="goodsList">
                                <Goods></Goods>
                                <Goods></Goods>
                                <Goods></Goods>
                                <Goods></Goods>
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
            {OrderDetail && <SaleModal isShow={saleNFTModal} close={() => { setSaleNFTModal(false) }} data={{ nftName: OrderDetail!.normalizedMetadata.name, projectName: OrderDetail!.name, image: OrderDetail!.normalizedMetadata.image, id: OrderDetail!.id, tokenId: OrderDetail!.tokenId, tokenAddress: OrderDetail!.tokenAddress }}></SaleModal>}
            {OrderDetail && <ConfirmBuyNFTModal NFTInfo={OrderDetail?.nnftOrder} isShow={buyNFTModal} close={() => { setBuyNFTModal(false) }} ></ConfirmBuyNFTModal>}
        </div>
    )
}
