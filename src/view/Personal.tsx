import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";
import { Table, Pagination, Collapse, Space } from 'antd';
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
import CollectionScreenModal from '../components/CollectionScreenModal'
import ReceRecord from '../components/ReceRecord'
import NoData from '../components/NoData'
import LaunchLogo from '../assets/image/LaunchLogo.png'
import write from '../assets/image/writeWhite.png'
import chainIcon from '../assets/image/ETHIcon.png'
import copyIcon from '../assets/image/copyIcon.png'
import shareIcon from '../assets/image/shareIcon.png'
import minSet from '../assets/image/minSet.png'
import twitterIcon from '../assets/image/twitterIcon.png'
import facebookIcon from '../assets/image/facebookIcon.png'
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
import authentication from '../assets/image/authentication.png'

const { Column } = Table;

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
    let [userCurrentNft, setUserCurrentNft] = useState<NftCurrentType>()
    const navigate = useNavigate();
    let [tabIndex, setTabIndex] = useState<number>(0)
    let [showScreenModal, setShowScreenModal] = useState<boolean>(false)
    let [showReceRecord, setShowReceRecord] = useState<boolean>(false)
    let [shareActive, setShareActive] = useState<boolean>(false)
    let [nftState, setNftstate] = useState(0)
    let [nftSort, setNftSort] = useState(0)
    const [activeKey, setActiveKey] = useState("");
    let [pageNum, setPageNum] = useState<number>(1)
    let type = params.get('type')
    let operateTtype = [
        t('Listing'),
        t('Sale'),
        t('Cancel an order'),
        t('Send'),
        t('No more'),
    ]
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
            setUsetNft(res.data)
            // console.log(res,'用户所拥有的nft')
        })
    }
    function LoadMore(fig: string) {
        console.log("加载更多", fig)
        dispatch(createSetLodingAction(true))
        getNfts({
            "address": web3React.account,
            "chain": "bsc%20testnet",
            "cursor": fig,
            "pageSize": 10
        }).then((res) => {
            console.log(res.data, '下一页');
            setUserCurrentNft(res.data)
            dispatch(createSetLodingAction(false))
        })
        // dispatch(createAddMessageAction(t('No more')))
    }

    function multiFilter(array: [], filters: any) {
        const filterKeys = Object.keys(filters)
        return array.filter((item) => {
            return filterKeys.every(key => {
                if (!filters[key].length) return true
                return !!~filters[key].indexOf(item[key])
            })
        })
    }

    function filterByName2(aim: NftInfo[], name: string, status: number) {
        return aim.filter(item => item.name == name || item.status == status)
    }

    useEffect(() => {
        if (web3React.account && state.token) {
            getNfts(
                {
                    "address": web3React.account,
                    "chain": "bsc%20testnet",
                    "cursor": "",
                    "pageSize": 10
                }
            ).then((res) => {
                console.log(res.data.result, '优化同步');
                // let Arr = res.data.result.filter((item: any) => !item.normalized_metadata)
                // console.log(JSON.parse(res.data.result[0].metadata), '处理', Arr);
                // setUsetNft(res.data.result)
                setUserCurrentNft(res.data)
            })
        }
    }, [web3React.account, state.token])

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
            return navigate(`/NFTDetails?ID=${goods.token_id}&&tokenAddress=${goods.token_address}&&owner_of=${goods.owner_of}&&NFTDetailType=0`)
        }
        /* 挂卖中去商品详情页改价 */
        if (goods.status === 1) {
            return navigate(`/NFTDetails?ID=${goods.token_id}&&tokenAddress=${goods.token_address}&&owner_of=${goods.owner_of}&&NFTDetailType=1`)
        }
    }
    function copyUserAddr() {
        if (web3React.account) {
            copy(web3React.account as string)
            dispatch(createAddMessageAction(t('Copied')))
        } else {
            dispatch(createAddMessageAction(t('Please connect your wallet')))
        }
    }
    function shareActiveFun() {
        setShareActive(!shareActive)
    }

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
                                <div className="level flexCenter">VIP0</div>
                            </div>
                            <div className="userAddress flexCenter pointer" onClick={copyUserAddr} >
                                <span>{web3React.account ? AddrHandle(web3React.account, 5, 4) : t('User address')}</span>
                                <img className="copyIcon" src={copyIcon} alt="" />
                            </div>
                            <div className="media-group">
                                <div className="outlinkBox">
                                    <div className="linkItem"><img src={twitterIcon} alt="" /></div>
                                    <div className="linkItem"><img src={facebookIcon} alt="" /></div>
                                </div>
                                <div className="btnGroupRow l-hidden">
                                    <div className="share pointer flexCenter shareBox" onClick={() => { shareActiveFun() }}>
                                        <img src={shareIcon} alt="" />{t('Share')}
                                        {shareActive &&
                                            <>
                                                <div className='copyLinkBox'>
                                                    <div className="title">复制链接</div>
                                                    <div className="outLink">在Facebook上分享</div>
                                                    <div className="outLink">在Twitter上分享</div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                    <div className="share pointer flexCenter" onClick={() => { navigate('/UserInfo') }}>
                                        <img src={minSet} alt="" />{t('Settings')}
                                    </div>
                                </div>
                            </div>
                            <div className="introduce">{t('Join in April 2022 / short self-introduction', { FullMonth: getMonth(userInfo?.createTime), FullYear: getFullYear(userInfo?.createTime) })}{userInfo?.brief || t('short self-introduction')}</div>
                        </div>
                        <div className="btnGroupRow m-hidden">
                            <div className="share pointer flexCenter shareBox" onClick={() => { shareActiveFun() }} >
                                <img src={shareIcon} alt="" />{t('Share')}
                                {shareActive && <>
                                    <div className='copyLinkBox'>
                                        <div className="title">复制链接</div>
                                        <div className="outLink">在Facebook上分享</div>
                                        <div className="outLink">在Twitter上分享</div>
                                    </div>
                                </>}
                            </div>
                            <div className="share pointer flexCenter" onClick={() => { navigate('/UserInfo') }}>
                                <img src={minSet} alt="" />{t('Settings')}
                            </div>
                        </div>

                    </div>

                    <div className="tebBox">
                        <div className={tabActive === 0 ? "tab tabActive" : "tab"} onClick={() => { setTabActive(0) }}>物品</div>
                        <div className={tabActive === 1 ? "tab tabActive" : "tab"} onClick={() => { setTabActive(1) }}>收藏</div>
                        <div className={tabActive === 2 ? "tab tabActive" : "tab"} onClick={() => { setTabActive(2) }}>动态</div>
                    </div>
                    <div className="line"></div>

                    <div className="tabContentBox">
                        {/* 0:物品 */}
                        {tabActive === 0 && <>
                            <div className="bigContent m-bigContent">
                                <div className="slider">
                                    <div className="stateBox">
                                        <div className="stateTitle m-hidden-block">状态</div>
                                        <div className='m-hidden-block'>
                                            <div className="stateItem flexCenter activeState"><img src={stateItem1} alt="" /> 全部（122） </div>
                                            <div className="stateItem flexCenter"><img src={stateItem2} alt="" /> 出售中（12）</div>
                                            <div className="stateItem flexCenter"><img src={stateItem3} alt="" /> 未上架的（12） </div>
                                            <div className="stateItem flexCenter"><img src={stateItem4} alt="" /> 已隐藏（12） </div>
                                        </div>
                                        {/* 
                                        <div className='nft-type l-hidden'>
                                            <div className="stateItem flexCenter activeState"><img src={stateItem1} alt="" /> 全部（122） </div>
                                            <div className="stateItem flexCenter"><img src={stateItem2} alt="" /> 出售中（12）</div>
                                            <div className="stateItem flexCenter"><img src={stateItem3} alt="" /> 未上架的（12） </div>
                                            <div className="stateItem flexCenter"><img src={stateItem4} alt="" /> 已隐藏（12） </div>
                                        </div>
                                         */}
                                    </div>
                                    <div className="seriesBox">
                                        <div className="seriesTitle m-hidden">
                                            系列
                                        </div>
                                        <div className="seriesSearch">
                                            <div className="searchBox">
                                                <div className="search" onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}>
                                                    <img src={Search} alt="" />
                                                    <input type="text" placeholder="集合名称" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="seriesBox">
                                            <div className="seriesItem">
                                                <div className="seriesLeft">
                                                    <div className="imgBox">
                                                        <img src={demoTestImg} alt="" />
                                                    </div>
                                                    <div className="infoBox">
                                                        <div className="seriesTitle">集合名称</div>
                                                        <div className="seriesPries">0.01ETH</div>
                                                    </div>
                                                </div>
                                                <div className="seriesRight">
                                                    <div className="number">2</div>
                                                    <img src={viewIcon} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="content">
                                    {userCurrentNft ? <>
                                        <div className="goodsList">{userCurrentNft.result.map((item, index) => <Goods key={index} NftInfo={item} goPath={() => { goPath(item) }} tag="Personal"></Goods>)}</div>
                                        <div className="LoadMore flexCenter" onClick={() => { LoadMore(userCurrentNft!!.cursor) }}>{t('Load More')}  {'>'}</div>
                                    </> : <NoData />}
                                </div>
                            </div>
                        </>}
                        {/* 1：收藏 */}
                        {tabActive === 1 && <>
                            <div className="bigContent">
                                <div className="content">
                                    <div className="goodsList">
                                        <Goods></Goods>
                                        <Goods></Goods>
                                        <Goods></Goods>
                                        <Goods></Goods>
                                        <Goods></Goods>
                                    </div>
                                </div>
                            </div>
                        </>}
                        {/* 2：动态 */}
                        {tabActive === 2 && <>
                            <div className="bigContent m-bigContent actionContent">
                                <div className="slider m-hidden-block actionSlider">
                                    <div className="typeTitle">类别</div>
                                    <div className="typeBox">
                                        <div className="flexCenter kindTitle activeType"> <img src={typeItem1} alt="" /> 全部类型</div>
                                        <div className="flexCenter putType"> <img src={typeItem2} alt="" /> 上架</div>
                                        <div className="flexCenter cancelType"> <img src={typeItem3} alt="" /> 取消</div>
                                        <div className="flexCenter successfulType"> <img src={typeItem4} alt="" /> 成交</div>
                                        <div className="flexCenter managepriceType"> <img src={typeItem5} alt="" /> 调价</div>
                                    </div>
                                </div>
                                {/* <div className="content m-hidden">
                                    <div className="goodsList">
                                        <Goods></Goods>
                                        <Goods></Goods>
                                        <Goods></Goods>
                                        <Goods></Goods>
                                    </div>
                                </div> */}

                                {width >= 768 && <div className="itemContentBigBox">
                                    <div className="titleBox">
                                        <div className="titleItem type">类型</div>
                                        <div className="titleItem">物品</div>
                                        <div className="titleItem">价格</div>
                                        <div className="titleItem">从</div>
                                        <div className="titleItem">到</div>
                                        <div className="titleItem date">日期</div>
                                    </div>
                                    <div className="itemContentBox">
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
                                    </div>
                                </div>}

                                {width < 768 && <div className="itemBigBox ">
                                    <div className="contentBox">
                                        <Space direction="vertical">
                                            <Collapse activeKey={activeKey} expandIcon={() => <></>} defaultActiveKey={['1']}>
                                                <Collapse.Panel header={
                                                    <div className="itemBox">
                                                        <div className="item type">
                                                            <div className="top">上架</div>
                                                            <div className="bottom">一口价</div>
                                                        </div>
                                                        <div className='group'>
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
                                                            <div className='drap-icon' onClick={() => {
                                                                if (activeKey === "1") {
                                                                    setActiveKey("")
                                                                } else {
                                                                    setActiveKey("1")
                                                                }
                                                            }} >
                                                                {
                                                                    activeKey !== "1" ? <DownOutlined /> : <UpOutlined />
                                                                }
                                                            </div>
                                                        </div>

                                                    </div>
                                                } key="1">
                                                    <div className="group">
                                                        <div className="item">
                                                            <div className="text">
                                                                Ox2423...sdw7
                                                            </div>
                                                            <div className="type">从</div>
                                                        </div>
                                                        <div className="item">
                                                            <div className="text">
                                                                Ox2423...12FF
                                                            </div>
                                                            <div className="type">到</div>

                                                        </div>
                                                        <div className="item date">
                                                            <div className="text type-date">
                                                                5分钟前
                                                            </div>
                                                            <div className="type">日期</div>
                                                        </div>
                                                    </div>
                                                </Collapse.Panel>
                                            </Collapse>
                                        </Space>
                                    </div>
                                </div>}
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
