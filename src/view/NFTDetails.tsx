


import { Tooltip } from 'antd'
import BinancePng from '../assets/image/nftDetails/binance.png'
import TipsPng from '../assets/image/nftDetails/tips.png'
import CopyPng from '../assets/image/nftDetails/copy.png'
import UsdtPng from '../assets/image/nftDetails/usdt.png'
import SharePng from '../assets/image/nftDetails/share.png'
import FabulousPng from '../assets/image/nftDetails/fabulous.png'
import RefreshPng from '../assets/image/nftDetails/refresh.png'


import '../assets/style/NFTDetails.scss'
import { Fragment, useState } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'


const TABS = ["描述",
    "属性",
    "信息"]

export default function NFTDetails() {
    const [tabIndex, setTabIndex] = useState(0)
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
    return (
        <div className="NFTDetailsPage">
            <div className="contentBox">
                <div className="tabBox">
                    <div className='left'>
                        <img src="https://th.bing.com/th/id/R.171e8fe1aa1544a1868ab710eed82d82?rik=FLPxvVVL9C9bnQ&riu=http%3a%2f%2fwww.pp3.cn%2fuploads%2fallimg%2f200710%2f14-200G00Z321.jpg&ehk=Lb0IHCCZIdqYQOi28m%2borU8c1ARGbTEC%2f8WYzfwRuHo%3d&risl=&pid=ImgRaw&r=0" alt="" />
                    </div>
                    <div className='right'>
                        <h4 className='title'>
                            NFT名称
                        </h4>
                        <div className="project">
                            <div className="name">
                                <img src="https://pages.anjukestatic.com/usersite/site/img/seo/app-download.jpg" alt="" className="logo" />
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
                            <img src={SharePng} alt="" />
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
            </div>
        </div>
    )
}
