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
import { AddrHandle, HowLongAgo, NumSplic } from '../utils/tool'
import '../assets/style/componentStyle/ActionBox.scss'
import { Contracts } from '../web3'
import Goods, { NftInfo } from '../components/HotspotCard'
import { useTranslation } from 'react-i18next'
import { useViewport } from '../components/viewportContext'
import CollectionScreenModal from '../components/CollectionScreenModal'
import ReceRecord from '../components/ReceRecord'
import NoData from '../components/NoData'
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import authentication from '../assets/image/authentication.svg'
import NotCertified from '../assets/image/NotCertified.svg'
import openIcon from '../assets/image/openIconWhite.png'
import switchIcon from '../assets/image/switchIcon.png'
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
    total: number
}
export default function Personal(props: any): JSX.Element {
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
    const [activeKey, setActiveKey] = useState("");
    let [pageNum, setPageNum] = useState<number>(1)
    let [tableData, setTableData] = useState<any>([])
    let [userLikeList, setUserLikeList] = useState<NftInfo[]>([])
    let operateTtype = [
        "上架",
        "成交",
        "取消",
        "转出",
        "调价",
    ]

    function goSomeone(address: string) {
        if (address) {
            navigate('/Someone?address=' + address)
        }
    }


    return (
        <div id="ActionBox" >
            {
                width >= 768 && <div className="itemContentBigBox">
                    <div className="titleBox">
                        <div className="titleItem type">类型</div>
                        <div className="titleItem">物品</div>
                        <div className="titleItem">价格</div>
                        <div className="titleItem">从</div>
                        <div className="titleItem">到</div>
                        <div className="titleItem date">日期</div>
                    </div>
                    <div className="itemContentBox">
                        {props.tableData.length > 0 && props.tableData.map((item: any, index: number) => <div key={index} className="itemBox">
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
                                <div className="top">{item.uorderPrice && (`$` + NumSplic(item.uorderPrice, 2))}  </div>
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
                        </div>)}
                    </div>
                </div>
            }
            {
                width < 768 && <div className="itemBigBox ">
                    {props.tag === "NFTDetailsL" && <div className="topBox">
                        <div className="actionTitle flexCenter">动态</div>
                        <div className="right">
                            <div className="dropDownBox">
                                <div className="MarketSearchRow">
                                    <Dropdown overlay={props.typeMenu} trigger={['click']} onVisibleChange={() => { }}>
                                        <div className="search">
                                            <div className="searchBox">全部</div>
                                            <img className={props.expand1 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                                        </div>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="switch"><img src={switchIcon} alt="" /></div>
                        </div>
                    </div>}
                    <div className="contentBox">
                        <Space direction="vertical">
                            <Collapse activeKey={activeKey} expandIcon={() => <></>} defaultActiveKey={['1']}>
                                {props.tableData.length > 0 ? props.tableData.map((item: any, index: number) =>
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
                                                        <div className="item">
                                                            <div className="top">{item.uorderPrice && (`$` + NumSplic(item.uorderPrice, 2))}</div>
                                                            <div className="bottom">{item.num} {item.coinName}</div>
                                                        </div>
                                                        <div className='drap-icon' onClick={() => {
                                                            if (activeKey === `${index}`) {
                                                                setActiveKey("")
                                                            } else {
                                                                setActiveKey(`${index}`)
                                                            }
                                                        }} >
                                                            {
                                                                activeKey !== `${index}` ? <DownOutlined /> : <UpOutlined />
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            } key={`${index}`}>
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
                </div>
            }
        </div>
    )
}
