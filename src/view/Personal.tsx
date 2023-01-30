import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";
import { Table, Pagination } from 'antd';
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

import CollectionScreenModal from '../components/CollectionScreenModal'
import ReceRecord from '../components/ReceRecord'
import NoData from '../components/NoData'
import LaunchLogo from '../assets/image/LaunchLogo.png'
import write from '../assets/image/writeWhite.png'
import chainIcon from '../assets/image/ETHIcon.png'
import copyIcon from '../assets/image/copyIconWhite.png'
import shareIcon from '../assets/image/shareIcon.png'
import minSet from '../assets/image/minSet.png'
import refreshWhite from '../assets/image/refreshWhite.png'
import openIcon from '../assets/image/openIconWhite.png'
import filter from '../assets/image/filter.png'
import TableGoodsImg from '../assets/image/TableGoodsImg.png'
import authentication from '../assets/image/authentication.png'
import NotCertified from '../assets/image/NotCertified.png'
import minCopyIcon from '../assets/image/copyIconWhite.png'
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
// let operateTtype =[
//     '挂单',
//     '出售',
//     '取消订单',
//     '转出',
//     '改价格',
//   ]
export default function Personal(): JSX.Element {
    // 控制图标上下
    const [expand16, setExpand16] = useState(true);
    const [expand17, setExpand17] = useState(true);
    const [expand18, setExpand18] = useState(true);
    const [expand19, setExpand19] = useState(true);
    const [params] = useSearchParams();
    const web3React = useWeb3React()
    const dispatch = useDispatch();
    let { t } = useTranslation();

    let state = useSelector<stateType, stateType>(state => state);
    let [userInfo, setUserInfo] = useState<userInfoType | any>(null)
    let [userNft, setUsetNft] = useState<NftInfo[]>([])
    let [userCurrentNft, setUserCurrentNft] = useState<NftCurrentType>()
    const navigate = useNavigate();
    let [tabIndex, setTabIndex] = useState<number>(0)
    let [isDynamic, setIsDynamic] = useState<boolean>(false)
    let [showScreenModal, setShowScreenModal] = useState<boolean>(false)
    let [showReceRecord, setShowReceRecord] = useState<boolean>(false)
    let [nftState, setNftstate] = useState(0)
    let [nftSort, setNftSort] = useState(0)
    let [DynamicState, setDynamicState] = useState(1)
    let [DynamicType, setDynamicType] = useState(0)
    let [pageNum, setPageNum] = useState<number>(1)
    // let [currencyType,setCurrencyType] = useState(0)
    let [tableData, setTableData] = useState([])
    let [AwardList, setAwardList] = useState<AwardType[]>([])
    let [userLikeList, setUserLikeList] = useState<NftInfo[]>([])
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
            "chain": "bsc",
            "cursor": fig,
            "pageSize": 10
        }).then((res) => {
            console.log(res.data, '下一页');
            setUserCurrentNft(res.data)
            dispatch(createSetLodingAction(false))
        })
        // dispatch(createAddMessageAction(t('No more')))
    }
    /* 同步 */
    function syncUserNftDataFun() {
        dispatch(createSetLodingAction(true))
        setPageNum(1)
        syncUserNftData(web3React.account as string).then(res => {
            console.log(res, '同步');
            getNftUserInfo({
                userAddress: web3React.account as string,
                pageSize: 10,
                currentPage: 1,
                bidType: -1,
                status: CollectionStateMap[nftState].value,
                type: -1,
                projectName: '',
                sortType: CollectionSortMap[nftSort].value
            }).then(res => {
                setUsetNft(res.data)
                // console.log(res,'用户所拥有的nft')
                dispatch(createAddMessageAction(t('Sync complete')))
            }, () => {
                dispatch(createAddMessageAction(t('Sync complete')))
            }).finally(() => {
                dispatch(createSetLodingAction(false))

            })
        }, () => {
            dispatch(createSetLodingAction(false))
            dispatch(createAddMessageAction(t('Sync failed')))
        })
    }
    /* 收藏 start */
    let CollectionStateMap = [
        {
            key: t('All'),
            value: -1
        },
        {
            key: t('For sale'),
            value: 1
        },
        {
            key: t('Not listed'),
            value: 0
        }
    ];
    let currencyMap = [
        {
            key: 'BNB',
            value: 0
        },
        {
            key: 'USDT',
            value: 1
        },
    ]
    let CollectionSortMap = [
        {
            key: t('newest'),
            value: 1
        },
        {
            key: t('value'),
            value: 3
        }
    ]
    const CollectionStateMenu = (
        <Menu onClick={() => handleDropDown(setExpand16, expand16)}>
            {
                CollectionStateMap.map((item, index) => <Menu.Item key={index} onClick={() => { setNftstate(index) }}>
                    {item.key}
                </Menu.Item>)
            }
        </Menu>
    );
    const CollectionScreenMenu = (
        <Menu onClick={() => handleDropDown(setExpand17, expand17)}>
            {
                CollectionSortMap.map((item, index) => <Menu.Item key={index} onClick={() => { setNftSort(index) }}>
                    {item.key}
                </Menu.Item>)
            }
        </Menu>
    );
    /* 收藏 end */
    /* 动态 start */
    let DynamicStateMap = [
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
    let DynamicTypeMap = [
        {
            key: t('NFT'),
            value: 2
        },
        {
            key: t('Blind Box'),
            value: 1
        }
    ]
    const DynamicStateMenu = (
        <Menu onClick={() => handleDropDown(setExpand18, expand18)}>
            {
                DynamicStateMap.map((item, index) => <Menu.Item key={index} onClick={() => { setDynamicState(index) }}>
                    {item.key}
                </Menu.Item>)
            }
        </Menu>
    );
    const DynamicTypeMenu = (
        <Menu onClick={() => handleDropDown(setExpand19, expand19)}>
            {
                DynamicTypeMap.map((item, index) => <Menu.Item key={index} onClick={() => { setDynamicType(index) }}>
                    {item.key}
                </Menu.Item>)
            }
        </Menu>
    );
    /* 动态 end */

    function multiFilter(array: [], filters: any) {
        const filterKeys = Object.keys(filters)
        // filters all elements passing the criteria
        return array.filter((item) => {
            // dynamically validate all filter criteria
            return filterKeys.every(key => {
                //ignore when the filter is empty Anne
                if (!filters[key].length) return true
                return !!~filters[key].indexOf(item[key])
            })
        })
    }
    function filterByName2(aim: NftInfo[], name: string, status: number) {
        return aim.filter(item => item.name == name || item.status == status)
    }

    useEffect(() => {
        if (web3React.account) {
            getNfts(
                {
                    "address": web3React.account,
                    "chain": "bsc",
                    "cursor": "",
                    "pageSize": 10
                }
            ).then((res) => {
                console.log(res.data, '优化同步');
                // let Arr = res.data.result.filter((item: any) => !item.normalized_metadata)
                // console.log(JSON.parse(res.data.result[0].metadata), '处理', Arr);
                // setUsetNft(res.data.result)
                setUserCurrentNft(res.data)
            })
        }
    }, [web3React.account, state.token])

    const onShowSizeChange = (current: number, pageSize: number) => {
        console.log(current, pageSize);
    };

    function changeIsDynamic(value: boolean) {
        //获取用户所有的nft
        if (!value) {

        } else {
            //获取动态

        }
        setIsDynamic(value)
    }
    function invitation() {
        if (!web3React.account) {
            return dispatch(createAddMessageAction(t('Please connect your wallet')))
        } else {
            copy(window.location.origin + window.location.pathname + '?address=' + web3React.account)
            dispatch(createAddMessageAction(t('Copied')))
        }
    }
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
            return navigate(`/Sell?ID=${goods.token_id}&&tokenAddress=${goods.token_address}&&owner_of=${goods.owner_of}`)
        }
        /* 挂卖中去商品详情页改价，撤单 */
        if (goods.status === 1) {
            return navigate('/Goods?orderId=' + goods.orderId)
        }
        // console.log('卡牌状态异常')
    }
    function copyUserAddr() {
        if (web3React.account) {
            copy(web3React.account as string)
            dispatch(createAddMessageAction(t('Copied')))
        } else {
            dispatch(createAddMessageAction(t('Please connect your wallet')))
        }
    }
    function drawFun(id: number, amount: number) {
        if (amount <= 0) {
            dispatch(createAddMessageAction(t('Not enough balance')))
        }
        drawAward(id).then((res: any) => {
            // console.log(res,"领取加密")
            if (res.code === 500) {
                dispatch(createAddMessageAction(res.msg))
            }
            Contracts.example.getMarketAward(web3React.account as string, res.data).then((res: any) => {
                // console.log(res,"领取结果")
            })
        })
    }
    function goSomeone(address: string) {
        if (address) {
            navigate('/Someone?address=' + address)
        }
    }
    function goProject(projectName: string, isAuthentication: number | null) {
        if (!isAuthentication) {
            dispatch(createAddMessageAction(t('Not certified')))
        }
        if (projectName && isAuthentication) {
            navigate('/project?projectName=' + projectName)
        }
    }
    return (
        <div>
            <div className="userInfo">
                <div className="userHeader">
                    <img id="headImg" src={userInfo?.headImg || LaunchLogo} alt="" />
                </div>
                <div className="Info">
                    <div className="userName"><div title={userInfo?.userName || t('Username')}>{userInfo?.userName || t('Username')}</div><img className="pointer" src={write} alt="" onClick={() => { navigate('/UserInfo') }} /></div>
                    <div className="userAddress flexCenter pointer" onClick={copyUserAddr} >
                        <img src={chainIcon} alt="" />
                        <span>{web3React.account ? AddrHandle(web3React.account, 5, 4) : t('User address')}</span>
                        <img className="copyIcon" src={copyIcon} alt="" />
                    </div>
                    {/* {getFullYear(userInfo?.createTime)}年{getMonth(userInfo?.createTime)}月加入 / {userInfo?.brief || '简短的自我介绍'} */}
                    {
                        userInfo && <div className="introduce">{t('Join in April 2022 / short self-introduction', { FullMonth: getMonth(userInfo?.createTime), FullYear: getFullYear(userInfo?.createTime) })}{userInfo?.brief || t('short self-introduction')}</div>
                    }

                </div>
                {/* <div className="flex1"></div> */}
                <div className="btnGroupRow">
                    <div className="share pointer flexCenter" onClick={share} ><img src={shareIcon} alt="" />{t('Share')}</div>
                    <div className="share pointer flexCenter" onClick={() => { navigate('/UserInfo') }}><img src={minSet} alt="" />{t('Settings')}</div>
                    <div className="set pointer flexCenter" onClick={syncUserNftDataFun}><img src={refreshWhite} alt="" style={{ width: '20px', height: '20px' }} />{t('Refresh')}</div>
                </div>
            </div>
            {/* <Pagination showSizeChanger defaultCurrent={1} total={50} onChange={onShowSizeChange} /> */}

            <div className="tabs">
                <div className={tabIndex === 0 ? "item pointer activeItem" : "pointer item"} onClick={() => { setTabIndex(0) }}>{t('Collection')}</div>
                <div className={tabIndex === 1 ? "item pointer activeItem" : "pointer item"} onClick={() => { setTabIndex(1) }}>{t('Favorites')}</div>
                <div className={tabIndex === 2 ? "item pointer activeItem" : "pointer item"} onClick={() => { setTabIndex(2) }}>{t('Rewards')}</div>
            </div>

            {/* 收藏 start */}
            {
                tabIndex === 0 && <div className="searchRow">
                    <div className="tab">
                        <div className={isDynamic ? 'item pointer flexCenter' : 'item activeItem pointer flexCenter'} onClick={() => { changeIsDynamic(false) }} >{t('Items')}</div>
                        <div className={isDynamic ? 'item pointer activeItem flexCenter' : 'item pointer flexCenter'} onClick={() => { changeIsDynamic(true) }}>{t('Activities')}</div>
                    </div>
                    <div className="searchedge">
                        {
                            !isDynamic && <>
                                <Dropdown overlay={CollectionStateMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand16, expand16)}>
                                    <div className="search">
                                        <div className="searchBox">{CollectionStateMap[nftState].key}</div>
                                        <img className={expand16 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                                    </div>
                                </Dropdown>
                                <Dropdown overlay={CollectionScreenMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand17, expand17)}>
                                    <div className="search">
                                        <div className="searchBox">{CollectionSortMap[nftSort].key}</div>
                                        <img className={expand17 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                                    </div>
                                </Dropdown>
                                <div className="filter pointer" onClick={() => { setShowScreenModal(true) }}>
                                    <img src={filter} alt="" />
                                    {t('Filter')}
                                </div>
                            </>
                        }
                        {
                            isDynamic && <>
                                <Dropdown overlay={DynamicStateMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand18, expand18)}>
                                    <div className="search">
                                        <div className="searchBox">{DynamicStateMap[DynamicState].key}</div>
                                        <img className={expand18 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                                    </div>
                                </Dropdown>
                                <Dropdown overlay={DynamicTypeMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand19, expand19)}>
                                    <div className="search">
                                        {DynamicTypeMap[DynamicType].key}
                                        <img className={expand19 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                                    </div>
                                </Dropdown>

                            </>

                        }
                    </div>
                </div>
            }
            {
                tabIndex === 0 && !isDynamic && <>
                    {
                        userCurrentNft ? <>
                            {/* <div className="goodsList">{userCurrentNft.result.map((item, index) => <Goods key={index} NftInfo={item} goPath={() => { goPath(item) }}></Goods>)}</div> */}
                            <div className="goodsList">{userCurrentNft.result.map((item, index) => <Goods key={index} NftInfo={item} goPath={() => { goPath(item) }}></Goods>)}</div>
                            <div className="LoadMore flexCenter" onClick={() => LoadMore(userCurrentNft!.cursor)}>{t('Load More')}  {'>'}</div>
                        </> : <NoData />
                    }
                </>
            }

            {/* 动态 start */}
            {
                tabIndex === 0 && isDynamic && <div className="TableBox">
                    {
                        tableData.length > 0 ?
                            <>
                                <Table dataSource={tableData} pagination={false} rowKey="id" scroll={{ x: 'max-content' }}>
                                    <Column
                                        title={t('Type')}
                                        render={item => (
                                            <>
                                                <div className="typeMain">{operateTtype[item.operateType]}</div>
                                                <div className="typeSub">as fixed price</div>
                                            </>
                                        )}
                                    />
                                    <Column
                                        align="center"
                                        title={t('Items')}
                                        render={item => (
                                            <>
                                                <div className="goodInfo">
                                                    <img src={TableGoodsImg} alt="" />
                                                    <div>
                                                        <div className="protName pointer" onClick={() => { goProject(item.projectName, item.isAuthentication) }}>{item.projectName} {item.isAuthentication === 1 ? <img src={authentication} alt="" /> : <img src={NotCertified} alt="" />}</div>

                                                        <div className="nft">{item.nftName}</div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    />
                                    <Column
                                        align="center"
                                        title={t('Price')}
                                        render={item => (
                                            <>
                                                <div className="goodPrice">
                                                    <div className="Uprice">{item.uorderPrice}</div>
                                                    <div className="bnbprice">{item.num} {item.coinName}</div>
                                                </div>
                                            </>
                                        )}
                                    />
                                    <Column
                                        align="center"
                                        title={t('From')}
                                        render={item => (
                                            <div className="color33 pointer" onClick={() => { goSomeone(item.formAddress) }}>
                                                {
                                                    item.formAddress ? AddrHandle(item.formAddress, 6, 4) : '-'
                                                }
                                            </div>
                                        )}
                                    />
                                    <Column
                                        align="center"
                                        title={t('To')}
                                        render={item => (
                                            <div className="color33 pointer" onClick={() => { goSomeone(item.toAddress) }}>
                                                {
                                                    item.toAddress ? AddrHandle(item.toAddress, 6, 4) : '-'

                                                }
                                            </div>
                                        )}
                                    />
                                    <Column
                                        align="right"
                                        title={t('Time')}
                                        render={item => (
                                            <div className="color33">
                                                {HowLongAgo(item.createTime)}
                                            </div>
                                        )}
                                    />
                                </Table>
                            </> :
                            <NoData></NoData>
                    }

                </div>
            }


            {/* 喜爱 start */}
            {
                tabIndex === 1 && <>
                    {userLikeList.length > 0 ?
                        <div className="goodsList">{userLikeList.map((item, index) => <Goods key={index} NftInfo={{ ...item, isLike: 1 }}></Goods>)}</div>
                        :
                        <NoData></NoData>
                    }
                </>
            }
            {/* 喜爱 end */}


            {/* 奖励 start */}
            {
                tabIndex === 2 && <div className="searchRow">
                    <div className="tab">
                        <div className='item activeItem flexCenter'>{t('Fees')}</div>
                    </div>
                </div>
            }
            {
                tabIndex === 2 && <div className="rewardInfo">
                    <div className="PleaseForward">
                        {t('Please share your refferal link:')}
                    </div>
                    <div className="copyLink">
                        {window.location.origin + '?address=' + AddrHandle(web3React.account as string)}
                        <img src={minCopyIcon} onClick={invitation} alt="" />
                    </div>
                    <div className="ruleLabel">
                        {t('Reward rules')}：
                    </div>
                    <div className="ruleSub">
                        {t('invited')}
                    </div>
                    <div className="explain">{t('invitedRules')}</div>
                    <div className="rewardLabel">{t('Rewards:')}</div>
                    {
                        AwardList.map((item, index) => <>
                            <div className="rewardToken">{item.coinName}：</div>
                            <div className="rewardRow" key={index}>
                                {/* <div className="rewardToken">{item.coinName}：</div> */}
                                <div className="Cumulative" onClick={() => { setShowReceRecord(true) }}>
                                    <div className="label">{t('The cumulative rewards')}：</div>
                                    <div className="value underline">{item.totalAmountString}</div>
                                </div>
                                <div className="Cumulative">
                                    <div className="label">{t('Unclaimed')}：</div>
                                    <div className="value">{item.amountString}</div>
                                </div>
                                <div className="receiveBtn flexCenter" onClick={() => { drawFun(item.id, item.amount) }}>{t('Claim')}</div>
                            </div>
                        </>)
                    }
                </div>
            }
            {/* 奖励 end */}

            <ReceRecord isShow={showReceRecord} close={() => { setShowReceRecord(false) }}></ReceRecord>
            {/* 筛选弹窗 */}
            <CollectionScreenModal isShow={showScreenModal} close={() => { setShowScreenModal(false) }} changeScreen={changeScreen} ></CollectionScreenModal>
        </div >
    )
}
