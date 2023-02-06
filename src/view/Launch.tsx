import React, { useEffect, useState } from 'react'
import '../assets/style/Launch.scss'
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPlatformBaseDetail, getNftProjectDetail, getTradeOrder, getTradeOrderState } from '../API'
import { stateType } from '../store/reducer'
import { Dropdown, Menu, Switch } from 'antd'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration' // import plugin
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next'
import Goods, { NftInfo } from '../components/HotspotCard'
import { HowLongAgo, AddrHandle } from '../utils/tool'
import SuccessfulModal from '../components/SuccessfulModal'
import ReportModal from '../components/ReportModal'
import bannerDemo from '../assets/image/bannerDemo.png'
import avtorImg from '../assets/image/4.png'
import authentication from '../assets/image/authentication.png'
import filterOpenIcon from '../assets/image/filterOpenIcon.png'
import filterCloseIcon from '../assets/image/filterCloseIcon.png'
import openRoundIcon from '../assets/image/openRoundIcon.png'
import selectedIcon from '../assets/image/selectedIcon.png'
import ETHIcon from '../assets/image/ETH.png'
import Search from '../assets/image/searchIcon.png'
import outLinkIcon1 from '../assets/image/outLinkIcon1.png'
import outLinkIcon2 from '../assets/image/outLinkIcon2.png'
import outLinkIcon3 from '../assets/image/outLinkIcon3.png'
import outLinkIcon4 from '../assets/image/outLinkIcon4.png'
import outLinkIcon5 from '../assets/image/outLinkIcon5.png'
import outLinkIcon6 from '../assets/image/outLinkIcon6.png'
import outLinkIcon7 from '../assets/image/outLinkIcon7.png'
import openIcon from '../assets/image/openIconWhite.png'
import FilterBack from '../assets/image/filter-back.png'
import NotCertified from '../assets/image/NotCertified.png'

import go from '../assets/image/go.png'
interface detialType {
    name: string
    routingName: string
    image: string
    bannerUrl: string
    castStartTime: number
    castEndTime: number
    startPrice: number
    coinName: string
    twitterUrl?: string
    telegraphGroupUrl?: string
    webUrl?: string
    totalReleaseNum: number
    id: number
    projectExplain: string
}
interface ProjectDetailType {
    playerNum: number
    rackingNum: number
    name: 'string',
    img: string
    backImgUrl: string
    twitterUrl?: string
    telegraphGroupUrl?: string
    webUrl?: string
    floorPrice: number
    tradeNum: number
    tradeAmount: number
    description: string
    isAuthentication: number | null
}
export default function Launch(): JSX.Element {
    const [params] = useSearchParams();
    let state = useSelector<stateType, stateType>(state => state);
    let [startTime, setstartTime] = useState<number>(0)
    let [tabActive, setTabActive] = useState<number>(0)
    let [expand1, setExpand1] = useState<boolean>(false)
    let [expand2, setExpand2] = useState<boolean>(false)
    let [successfulModal, setSuccessfulModal] = useState<boolean>(false)
    let [LaunchDetial, setLaunchDetial] = useState<detialType | null>(null)
    let [ProjectDetail, setProjectDetail] = useState<ProjectDetailType | null>(null)
    let [ProjectOrder, setProjectOrder] = useState<NftInfo[]>([])

    let [tableData, setTableData] = useState([])
    let [newTime, setNewTime] = useState(dayjs().valueOf())
    let { t } = useTranslation()
    let id = params.get('id')
    let projectName = params.get('projectName')
    let operateTtype = [
        "挂单",
        "出售",
        "转出"
    ]
    function goSomeone(address: string) {
        navigate('/Someone?address=' + address)
    }
    dayjs.extend(duration)
    useEffect(() => {
        let time = setInterval(() => {
            if (startTime) {
                setNewTime(dayjs().valueOf())
            }
        }, 1000)
        return () => {
            clearInterval(time)
        }
    }, [startTime])
    useEffect(() => {
        if (state.token && id) {
            getPlatformBaseDetail(id).then(res => {
                setLaunchDetial(res.data)
                setstartTime(res.data.castStartTime)
                console.log(res, "发射台详情")
            })
        }
    }, [state.token])
    useEffect(() => {
        if (state.token && projectName) {
            getNftProjectDetail(projectName).then(res => {
                console.log(res.data, "项目详情")
                setProjectDetail(res.data)
                getTradeOrderState(res.data.name).then(res => {
                    console.log(res, "项目NFT动态")
                    setTableData(res.data)
                })
            })
        }
    }, [state.token, projectName])
    function goLaunchDetial() {
        if (LaunchDetial) {
            navigate('/' + LaunchDetial.routingName + '?id=' + LaunchDetial.id)
        }
    }

    const typeMenu = (
        <Menu>
            <Menu.Item>全部</Menu.Item>
            <Menu.Item>全部</Menu.Item>
        </Menu>
    );

    // 开关
    const onChange = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };

    const navigate = useNavigate();
    const diffTime = dayjs.duration(startTime - newTime);
    // const day = diffTime.days(); //天
    const hours = diffTime.hours(); //小时
    const minutes = diffTime.minutes(); //分钟
    const seconds = diffTime.seconds();
    return (
        <div id="launch" className="ProjectDetail">
            <div className="banner">
                <img src={bannerDemo} alt="" />
                <div className="dataItems">
                    <div className="item">
                        <div className="top">$1110.1</div>
                        <div className="bottom">总交易量</div>
                    </div>
                    <div className="item">
                        <div className="top">$0.005</div>
                        <div className="bottom">地板价</div>
                    </div>
                    <div className="item">
                        <div className="top">10%</div>
                        <div className="bottom">创作者收益</div>
                    </div>
                    <div className="item">
                        <div className="top">111</div>
                        <div className="bottom">物品</div>
                    </div>
                    <div className="item">
                        <div className="top">111</div>
                        <div className="bottom">已上架</div>
                    </div>
                    <div className="item">
                        <div className="top">111</div>
                        <div className="bottom">持有者</div></div>
                </div>
            </div>
            <div className="contentBox">
                <div className="outLinkBox l-hidden">
                    <div className="linkItem">
                        <img src={outLinkIcon1} alt="" />
                    </div>
                    <div className="linkItem">
                        <img src={outLinkIcon2} alt="" />
                    </div>
                    <div className="linkItem">
                        <img src={outLinkIcon3} alt="" />
                    </div>
                    <div className="linkItem">
                        <img src={outLinkIcon4} alt="" />
                    </div>
                    <div className="linkItem">
                        <img src={outLinkIcon5} alt="" />
                    </div>
                    <div className="linkItem copyItem" onClick={() => { }}>
                        <img src={outLinkIcon6} alt="" />
                        {false && <>
                            <div className='copyLinkBox'>
                                <div className="title">复制链接</div>
                                <div className="outLink">在Facebook上分享</div>
                                <div className="outLink">在Twitter上分享</div>
                            </div>
                        </>}
                    </div>
                    <div className="linkItem">
                        <img src={outLinkIcon7} alt="" />
                    </div>
                </div>
                <div className="logoAvtor l-hidden">
                    <img src={avtorImg} alt="" />
                    <div className="personalBox ">
                        <div className="name">Rat3</div>
                        <div className="address">创作者 <span> 678789....hguio</span></div>
                    </div>

                </div>
                <div className="logoAvtor m-hidden">
                    <img src={avtorImg} alt="" />
                </div>
                <div className="outLinkBox m-hidden">
                    <div className="linkItem">
                        <img src={outLinkIcon1} alt="" />
                    </div>
                    <div className="linkItem">
                        <img src={outLinkIcon2} alt="" />
                    </div>
                    <div className="linkItem">
                        <img src={outLinkIcon3} alt="" />
                    </div>
                    <div className="linkItem">
                        <img src={outLinkIcon4} alt="" />
                    </div>
                    <div className="linkItem">
                        <img src={outLinkIcon5} alt="" />
                    </div>
                    <div className="linkItem copyItem" onClick={() => { }}>
                        <img src={outLinkIcon6} alt="" />
                        {false && <>
                            <div className='copyLinkBox'>
                                <div className="title">复制链接</div>
                                <div className="outLink">在Facebook上分享</div>
                                <div className="outLink">在Twitter上分享</div>
                            </div>
                        </>}
                    </div>
                    <div className="linkItem">
                        <img src={outLinkIcon7} alt="" />
                    </div>
                </div>
                <div className="personalBox m-hidden-block">
                    <div className="name">Rat3</div>
                    <div className="address">创作者 <span> 678789....hguio</span></div>
                    <div className="detail">"Because every person knows what he likes, every person thinks he is an expert on user interfaces.,--Paul Hecke“因为每个人都知道自己喜欢什么，所以每个人都觉得自己是用户界面专家。”</div>
                    <div className="detailBtn">+扩展</div>
                </div>
                <div className="detail l-hidden">"Because every person knows what he likes, every person thinks he is an expert on user interfaces.,--Paul Hecke“因为每个人都知道自己喜欢什么，所以每个人都觉得自己是用户界面专家。”</div>


                <div className="tebBox">
                    <div className={tabActive === 0 ? "tab tabActive" : "tab"} onClick={() => { setTabActive(0) }}>物品</div>
                    <div className={tabActive === 1 ? "tab tabActive" : "tab"} onClick={() => { setTabActive(1) }}>动态</div>
                </div>
                <div className="line"></div>
                {/* 物品容器 */}
                {tabActive === 0 && <div className="container" >
                    <div className="header">
                        <div className="leftBox m-hidden">
                            <div className="filterBtn"><img src={filterOpenIcon} alt="" /></div>
                            <div className="searchBox">
                                <div className="search" onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}>
                                    <img src={Search} alt="" />
                                    <input type="text" placeholder="按名称、属性搜索" />
                                </div>
                            </div>
                        </div>
                        <div className="dropDownBox">
                            <div className="MarketSearchRow">
                                <Dropdown overlay={typeMenu} trigger={['click']} >
                                    <div className="search">
                                        <div className="searchBox">全部</div>
                                        <img className={expand1 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                                    </div>
                                </Dropdown>
                                <Dropdown overlay={typeMenu} trigger={['click']}>
                                    <div className="search">
                                        <div className="searchBox">最新上架</div>
                                        <img className={expand2 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                                    </div>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                    <div className="bigContent">
                        <div className="slider  m-hidden-block" style={{ display: tabActive === 0 ? "none" : "block" }}>
                            <div className="settingPut">
                                <div className="title">已上架</div>
                                <div className="right"><Switch defaultChecked onChange={onChange} /></div>
                            </div>
                            <div className="priceFilter">
                                <div className="title">$价格范围</div>
                                <div className="right"><img src={openRoundIcon} alt="" /></div>
                            </div>
                            {true && <>
                                <div className="topBox">
                                    <div className="button flexCenter">最小值</div>
                                    <div className="word flexCenter">-</div>
                                    <div className="button flexCenter">最大值</div>
                                </div>
                                <div className="bottom flexCenter">
                                    <div className="applyBtn flexCenter">应用</div>
                                </div>
                            </>}
                            <div className="coinBox">
                                <div className="title">货币</div>
                                <div className="right">
                                    <img src={openRoundIcon} alt="" />
                                </div>
                            </div>
                            {true && <>
                                <div className="coin">
                                    <div className="coinTitle"><img src={ETHIcon} alt="" />ETH</div>
                                    <div className="checkBox">
                                        {true ? <img src={selectedIcon} alt="" /> : <div className="radio"></div>}
                                    </div>
                                </div>
                                <div className="coin">
                                    <div className="coinTitle"><img src={ETHIcon} alt="" />WETH</div>
                                    <div className="checkBox">
                                        <div className="radio"></div>
                                    </div>
                                </div>
                            </>}
                        </div>
                        <div className="content">
                            <div className="goodsNumber">1,000个物品</div>
                            <div className="goodsList">
                                {
                                    [1, 2, 3, 4].map((item) => <div className="goodsItem">
                                        <Goods></Goods>
                                    </div>)
                                }

                                <div className="mobile-filter l-hidden">过滤 <img src={FilterBack} alt="" /></div>
                            </div>
                        </div>
                    </div>
                </div>}
                {/* 动态 */}
                {tabActive === 1 && <div className='actionBox'>
                    {<div className="itemBigBox contentBoxL">
                        <div className="titleBox">
                            <div className="titleItem type">类型</div>
                            <div className="titleItem">物品</div>
                            <div className="titleItem">价格</div>
                            <div className="titleItem">从</div>
                            <div className="titleItem">到</div>
                            <div className="titleItem date">日期</div>
                        </div>
                        <div className="itemContentBox">
                            {tableData.length > 0 &&
                                tableData.map((item: any, index: number) => <div key={index} className="itemBox">
                                    <div className="item type">
                                        <div className="top">{operateTtype[item.operateType]}</div>
                                        <div className="bottom">一口价</div>
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
                    </div>}
                </div>}

            </div>
            <SuccessfulModal isShow={false} close={() => { setSuccessfulModal(false) }} ></SuccessfulModal>
            <ReportModal isShow={false} close={() => { setSuccessfulModal(false) }} ></ReportModal>
        </div >
    )
}
