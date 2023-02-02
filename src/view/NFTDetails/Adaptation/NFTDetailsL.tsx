
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
import ManageModal from '../../../components/ManageModal'
import CancelSaleModal from '../../../components/CancelSaleModal'
import ConfirmBuyModal from '../../../components/ConfirmBuyModal'
import SaleNFTModal from '../../../components/SaleNFTModal'
import StepSaleNFTModal from '../../../components/StepSaleNFTModal'


const TABS = ["描述",
    "属性",
    "信息"
]

export default function NFTDetailsL() {
    const [tabIndex, setTabIndex] = useState(0)
    const [expand1, setExpand1] = useState(true)
    const [manageModal, setManageModal] = useState(false)
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
    const handleDropDown = (fun: any, value: boolean) => {
        fun(!value);
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
                        <img src={NFTImage} alt="" />
                    </div>
                    <div className='right'>
                        <h4 className='title'>
                            NFT名称
                        </h4>
                        <div className="project">
                            <div className="name">
                                <img src={NFTImage} alt="" className="logo" />
                                <div className="project-name">项目名称</div>
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
                                <div className="name">项目名称</div>
                            </div>
                            <div className="address">
                                <div className="account">
                                    OxaD12....DGHD  <img src={CopyPng} alt="" className="copy" />
                                </div>
                            </div>
                        </div>
                        <div className="buy">
                            <div className="buy-left">
                                <div className="buy-left-top">一口价</div>
                                <div className="buy-left-bottom">
                                    <img src={UsdtPng} className="buy-left-bottom-coin" />
                                    <div className="coin-group">
                                        0.55 USDT
                                        <div className="coin-group-price">
                                            ($77.61)
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="buy-right">
                                <div className="buy-right-button">立即购买</div>
                            </div>
                        </div>
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
                                            项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍项目介绍
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
                                            [0, 1, 2, 4, 5].map((item, idx) =>
                                                <div className={`nft-details-attribute-item ${!((idx + 1) % 3) ? "nft-details-attribute-item-right" : ""}`}>
                                                    <div className="nft-details-attribute-title">
                                                        部位
                                                    </div>
                                                    <div className="nft-details-attribute-title">
                                                        属性
                                                    </div>
                                                    <div className="nft-details-attribute-content">
                                                        5788 (89%)持有这个
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div> : (tabIndex === 2 ?
                                        <div className="nft-details-info-group">
                                            <div className="nft-details-info-item">
                                                <div className="nft-details-info-item-title">
                                                    合约地址
                                                </div>
                                                <div className="nft-details-info-item-content">
                                                    Ox242v....2432G
                                                </div>
                                            </div>
                                            <div className="nft-details-info-item">
                                                <div className="nft-details-info-item-title">
                                                    代币ID
                                                </div>
                                                <div className="nft-details-info-item-content">
                                                    34232
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
            <ManageModal isShow={false} close={() => { setManageModal(false) }} ></ManageModal>
            <CancelSaleModal isShow={false} close={() => { setManageModal(false) }} ></CancelSaleModal>
            <ConfirmBuyModal isShow={false} close={() => { setManageModal(false) }} ></ConfirmBuyModal>
            <SaleNFTModal isShow={false} close={() => { setManageModal(false) }} ></SaleNFTModal>
            <StepSaleNFTModal isShow={true} close={() => { setManageModal(false) }} ></StepSaleNFTModal>
        </div>
    )
}
