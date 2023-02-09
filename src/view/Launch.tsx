import React, { Fragment, useEffect, useState } from 'react'
import '../assets/style/Launch.scss'
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPlatformBaseDetail, getNftProjectDetail, getTradeOrder, getTradeOrderState } from '../API'
import { stateType } from '../store/reducer'
import { Collapse, Dropdown, Menu, Space, Switch } from 'antd'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration' // import plugin
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next'
import Goods, { NftInfo } from '../components/HotspotCard'
import { HowLongAgo, AddrHandle } from '../utils/tool'
import { createAddMessageAction, createSetLodingAction } from '../store/actions'
import NoData from '../components/NoData'
import SuccessfulModal from '../components/SuccessfulModal'
import ReportModal from '../components/ReportModal'
import bannerDemo from '../assets/image/bannerDemo.png'
import avtorImg from '../assets/image/4.png'
import authentication from '../assets/image/authentication.svg'
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
import NotCertified from '../assets/image/NotCertified.svg'
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useWeb3React } from '@web3-react/core';
import { decimalNum } from '../utils/decimalNum';
import { useViewport } from '../components/viewportContext'

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
    floorPriceDouble: number
    tradeNum: number
    createFee: number
    tradeAmount: number
    description: string
    isAuthentication: number | null
}

interface dynamic {
    nftName: string,
    num: number,
    operateType: number
    formAddress: string
    toAddress: string
    createTime: number
    orderId: number
    id: number
    coinName: string
    projectLogo: string
}
export default function Launch(): JSX.Element {
    const [params] = useSearchParams();
    const dispatch = useDispatch();
    const web3React = useWeb3React()
    const { width } = useViewport()
    let state = useSelector<stateType, stateType>(state => state);
    let [startTime, setstartTime] = useState<number>(0)
    let [tabActive, setTabActive] = useState<number>(0)
    let [expand1, setExpand1] = useState<boolean>(false)
    let [expand2, setExpand2] = useState<boolean>(false)
    let [isShare, setIsShare] = useState<boolean>(false)
    let [successfulModal, setSuccessfulModal] = useState<boolean>(false)
    let [LaunchDetial, setLaunchDetial] = useState<detialType | null>(null)
    let [ProjectDetail, setProjectDetail] = useState<any | null>(null)
    let [nftList, setNftList] = useState<any[]>([])
    let [total, setTotal] = useState("--")

    let [ProjectOrder, setProjectOrder] = useState<NftInfo[]>([])
    const [activeKey, setActiveKey] = useState("");
    const [cursor, setCursor] = useState("");

    const listData = [1, 2, 3, 4, 5]
    let [dynamicInfo, setSynamicInfo] = useState<dynamic[]>([])

    let [tableData, setTableData] = useState([])
    let { t } = useTranslation()
    let tokenAddress = params.get('tokenAddress')
    console.log("tokenAddress", tokenAddress)
    let operateTtype = [
        "上架",
        "成交",
        "取消",
        "转出",
        "调价",
    ]
    function goSomeone(address: string) {
        navigate('/Someone?address=' + address)
    }
    dayjs.extend(duration)
    useEffect(() => {
        if (state.token && tokenAddress) {
            dispatch(createSetLodingAction(true))
            getNftProjectDetail({
                "tokenAddress": tokenAddress,
                "pageSize": 10,
                "cursor": "",
            }).then(res => {
                console.log(res.data, "项目详情")
                setProjectDetail(res.data)
                setNftList(res.data?.nftData?.result || [])
                setTotal((res.data?.nftData?.total || "") + "")
                setCursor(res.data?.nftData?.cursor || "");
                dispatch(createSetLodingAction(false))
                getTradeOrderState(tokenAddress as string).then(res => {
                    console.log(res, "项目NFT动态")
                    setTableData(res.data)
                })
            })
        }
    }, [state.token, tokenAddress])

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

    function goPath(goods: any) {
        /* 状态正常去挂卖 */
        if (goods.status === 0) {
            return navigate(`/NFTDetails?tokenId=${goods.token_id}&&tokenAddress=${goods.token_address}&&owner_of=${goods.owner_of}&&NFTDetailType=0`)
        }
        /* 挂卖中去商品详情页改价 */
        if (goods.status === 1) {
            return navigate(`/NFTDetails?tokenId=${goods.token_id}&&tokenAddress=${goods.token_address}&&owner_of=${goods.owner_of}&&NFTDetailType=1`)
        }
    }
    function LoadMore(fig: string) {
        if (!fig) return dispatch(createAddMessageAction(t('No more')))
        dispatch(createSetLodingAction(true))
        getNftProjectDetail({
            "tokenAddress": tokenAddress,
            "pageSize": 10,
            "cursor": fig,
        }).then(res => {
            dispatch(createSetLodingAction(false))
            setProjectDetail(ProjectDetail)
            setTotal((res.data?.nftData?.total || "") + "")
            const list = nftList.concat(res.data?.nftData?.result || [])
            console.log("list", list)
            let nftL: any = []
            nftL = list.reduce((prev, item) => {
                console.log("item?.token_address?.toLocaleLowerCase()", item?.token_address?.toLocaleLowerCase())
                if (!prev.some((option: any) => (option?.token_address?.toLocaleLowerCase() === item?.token_address?.toLocaleLowerCase()) && (Number(option?.token_id) === Number(item?.token_id)))) {
                    prev.push(item)
                }
                console.log("prev", prev)
                return prev
            }, [])
            console.log("nftL.concat([])", nftL.concat([]))
            setNftList(nftL.concat([]))
            setCursor(res.data?.nftData?.cursor || "")
        })
    }

    console.log("nftList", nftList)

    const navigate = useNavigate();
    return (
        <div id="launch" className="ProjectDetail">
            <div className="banner">
                <img src={ProjectDetail?.backImgUrl} alt="" />
                {width > 768 && <div className="dataItems">
                    <div className="item">
                        <div className="top">${decimalNum(ProjectDetail?.tradeAmount, 4) || "0"}</div>
                        <div className="bottom">总交易量</div>
                    </div>
                    <div className="item">
                        <div className="top">${decimalNum(ProjectDetail?.floorPrice, 4) || "0"}</div>
                        <div className="bottom">地板价</div>
                    </div>
                    <div className="item">
                        <div className="top">{ProjectDetail?.createFee || "0"}%</div>
                        <div className="bottom">创作者收益</div>
                    </div>
                    <div className="item">
                        <div className="top">{ProjectDetail?.thingNum || "0"}</div>
                        <div className="bottom">物品</div>
                    </div>
                    <div className="item">
                        <div className="top">{ProjectDetail?.shelvesNum || "0"}</div>
                        <div className="bottom">已上架</div>
                    </div>
                    {/* <div className="item">
                        <div className="top">{ProjectDetail?.holdNum || "0"}</div>
                        <div className="bottom">持有者</div></div> */}
                </div>}
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
                    <div className="linkItem copyItem" onClick={() => {
                        setIsShare(!isShare)
                    }}>
                        <img src={outLinkIcon6} alt="" />
                        {isShare && <>
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
                <div className='outLinkBigBox'>
                    <div className="outLinkBox outLinkBoxM l-hidden">
                        <div className="linkItem">
                            <div className="top">${decimalNum(ProjectDetail?.tradeAmount, 4) || "0"}</div>
                            <div className="bottom">总交易量</div>
                        </div>
                        <div className="linkItem">
                            <div className="top">${decimalNum(ProjectDetail?.floorPrice, 4) || "0"}</div>
                            <div className="bottom">地板价</div>
                        </div>
                        <div className="linkItem">
                            <div className="top">{ProjectDetail?.createFee || "0"}%</div>
                            <div className="bottom">创作者收益</div>
                        </div>
                        <div className="linkItem">
                            <div className="top">{ProjectDetail?.thingNum || "0"}</div>
                            <div className="bottom">物品</div>
                        </div>
                        <div className="linkItem">
                            <div className="top">{ProjectDetail?.shelvesNum || "0"}</div>
                            <div className="bottom">已上架</div>
                        </div>
                        {/* 
                    <div className="linkItem copyItem">
                        <div className="top">{ProjectDetail?.holdNum || "0"}</div>
                        <div className="bottom">持有者</div>
                    </div> 
                    */}
                    </div>
                </div>
                <div className="logoAvtor l-hidden">
                    <img className='logo-avtor-img' src={ProjectDetail?.img} alt="" />
                    <div className="personalBox ">
                        <div className="name">{ProjectDetail?.name}</div>
                        <div className="address">创作者<span> {ProjectDetail?.createAddress}</span></div>
                    </div>
                </div>
                <div className="logoAvtor logo-avtor-img m-hidden">
                    <img src={ProjectDetail?.img} alt="" />
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
                    <div className="name">{ProjectDetail?.name}</div>
                    <div className="address">创作者 <span> {ProjectDetail?.createAddress}</span></div>
                    <div className="detail">{t('Project Description')}：{ProjectDetail?.description}</div>
                    <div className="detailBtn">+扩展</div>
                </div>
                <div className="detail l-hidden">{t('Project Description')}：{ProjectDetail?.description}</div>


                <div className="tabBox">
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
                        <div className={`slider m-hidden-block ${Number(tabActive) === 1 ? "isHidden" : ""}`}>
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
                            <div className="goodsNumber">{decimalNum(total, 0, ",")}个物品</div>
                            <div className="goodsList">
                                <div className="content">
                                    {nftList.length ? <>
                                        <div className="goodsList">{nftList.map((item: any, index: number) =>
                                            <div className="goodsItem"><Goods key={index} NftInfo={item} goPath={() => { goPath(item) }} tag={
                                                item?.owner_of?.toLocaleLowerCase() === web3React?.account?.toLocaleLowerCase() ?
                                                    "Personal" : ""}></Goods></div>
                                        )}</div>
                                        {!!cursor && <div className="LoadMore flexCenter" onClick={() => {
                                            console.log("cursor", cursor)
                                            LoadMore(cursor)
                                        }}>{t('Load More')}  {'>'}</div>}
                                    </> : <NoData />}
                                </div>

                                {/* <div className="content">
                                    {userCurrentNft ? <>
                                        <div className="goodsList">{userCurrentNft.result.map((item, index) => <Goods key={index} NftInfo={item} goPath={() => { goPath(item) }} tag="Personal"></Goods>)}</div>
                                        <div className="LoadMore flexCenter" onClick={() => { LoadMore(userCurrentNft!!.cursor) }}>{t('Load More')}  {'>'}</div>
                                    </> : <NoData />}
                                </div> */}
                                <div className="mobile-filter l-hidden">过滤 <img src={FilterBack} alt="" /></div>
                            </div>
                        </div>
                    </div>
                </div>}
                {/* 动态 */}
                {tabActive === 1 && <div className='activeBox'>
                    <div className="itemBigBox contentBoxL">
                        <div className="titleBox">
                            <div className="titleItem type">类型</div>
                            <div className="titleItem">物品</div>
                            <div className="titleItem">价格</div>
                            <div className="titleItem">从</div>
                            <div className="titleItem">到</div>
                            <div className="titleItem date">日期</div>
                        </div>
                        <div className="itemContentBox">
                            {tableData &&
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
                    </div>
                    <div className="itemBigBox contentBoxM">
                        <div className="contentBox">
                            <Fragment>
                                <Space direction="vertical">
                                    <Collapse activeKey={activeKey} expandIcon={() => <></>}>
                                        {
                                            tableData.map((item: any, idx: any) =>
                                                <Fragment>
                                                    <Collapse.Panel header={
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
                                                                <div className="item price">
                                                                    <div className="top">{item.uorderPrice}</div>
                                                                    <div className="bottom">{item.num} {item.coinName}</div>
                                                                </div>
                                                                <div className='drap-icon' onClick={() => {
                                                                    if (activeKey === (idx + "")) {
                                                                        setActiveKey("")
                                                                        console.log("activeKey", "null")
                                                                    } else {
                                                                        setActiveKey(idx + "")
                                                                        console.log("activeKey", (idx + ""))
                                                                    }
                                                                }} >
                                                                    {
                                                                        activeKey !== (idx + "") ? <DownOutlined /> : <UpOutlined />
                                                                    }
                                                                </div>
                                                            </div>

                                                        </div>
                                                    } key={idx + ""}>
                                                        <div className="group">
                                                            <div className="item">
                                                                <div className="text" onClick={() => { goSomeone(item.formAddress) }}>
                                                                    {
                                                                        item.formAddress ? AddrHandle(item.formAddress, 6, 4) : '-'
                                                                    }
                                                                </div>
                                                                <div className="type" onClick={() => { goSomeone(item.toAddress) }}>从</div>
                                                            </div>
                                                            <div className="item">
                                                                <div className="text">
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
                                                    <div className="separate" style={{ display: (listData.length === (idx + 1)) ? "none" : "block" }}></div>
                                                </Fragment>
                                            )
                                        }
                                    </Collapse>
                                </Space>
                            </Fragment>
                        </div>
                    </div>
                </div>
                }

            </div>
            <SuccessfulModal isShow={false} close={() => { setSuccessfulModal(false) }} ></SuccessfulModal>
            <ReportModal isShow={false} close={() => { setSuccessfulModal(false) }} ></ReportModal>
        </div >
    )
}
