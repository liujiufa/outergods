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
import { Menu, Dropdown, Tooltip } from 'antd';
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
    console.log(props.tableData, "动态");
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
        t("List"),
        t("Sale"),
        t("Cancel"),
        t("transfer"),
        t("Change"),
    ]

    function goSomeone(address: string) {
        if (address) {
            navigate('/Someone?address=' + address)
        }
    }

    function goPath(goods: any) {
        return navigate(`/NFTDetails?tokenId=${goods.tokenId}&&tokenAddress=${goods.tokenAddress}`)
    }

    return (
        <div id="ActionBox" >
            {
                width >= 768 && <div className="itemContentBigBox">
                    {props.tag === "NFTDetailsL" && <div className="topBox">
                        <div className="actionTitle flexCenter">{t("Activities")}</div>
                        <div className="right">
                            {/* <div className="dropDownBox">
                                <div className="MarketSearchRow">
                                    <Dropdown overlay={props.typeMenu} trigger={['click']} onVisibleChange={() => { }}>
                                        <div className="search">
                                            <div className="searchBox">{t("All")}</div>
                                            <img className={props.expand1 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                                        </div>
                                    </Dropdown>
                                </div>
                            </div> */}
                            <div className="switch"><img src={switchIcon} alt="" /></div>
                        </div>
                    </div>}
                    <div className={props.tag === "NFTDetailsL" ? "titleActive" : "titleBox"}>
                        <div className="titleItem type">{t("Type")}</div>
                        <div className="titleItem">{t("Items")}</div>
                        <div className="titleItem">{t("Price")}</div>
                        <div className="titleItem">{t("From")}</div>
                        <div className="titleItem">{t("To")}</div>
                        <div className="titleItem date">{t("Time")}</div>
                    </div>
                    <div className="itemContentBox">
                        {props.tableData.length > 0 ? props.tableData.map((item: any, index: number) => <div key={index} className="itemBox">
                            <div className="item type">
                                <div className="top">{operateTtype[item.operateType]}</div>
                                <div className="bottom">{t("as fixed price")}</div>
                            </div>

                            <div className="item projectName">
                                <div className="leftBox">
                                    <img src={item.projectLogo} alt="" />
                                </div>
                                <div className="right">

                                    <Tooltip title={<span style={{ fontWeight: 400, fontSize: "14px", color: "#000000" }}>{item.projectName}</span>} color="#FFF" key="tips">
                                        <div className="top autoTop" onClick={() => { navigate('/Launch?tokenAddress=' + item?.tokenAddress) }}>{item.isAuthentication === 1 ? <img src={authentication} alt="" /> : <img src={NotCertified} alt="" />}{item.projectName} </div>
                                    </Tooltip>
                                    {/* <div className="top autoTop" onClick={() => { navigate('/Launch?tokenAddress=' + item?.tokenAddress) }}>{item.projectName} {item.isAuthentication === 1 ? <img src={authentication} alt="" /> : <img src={NotCertified} alt="" />}</div> */}
                                    <div className="bottom" onClick={() => { goPath(item) }}>{item.nftName}</div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="top ">{item.num} {item.coinName}</div>
                                <div className="bottom">{item.uprice && (`$` + NumSplic(item.uprice, 4))}  </div>
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
                        </div>) : <NoData />}
                    </div>
                </div>
            }
            {
                width < 768 && <div className="itemBigBox ">
                    {props.tag === "NFTDetailsL" && <div className="topBox">
                        <div className="actionTitle flexCenter">{t("Activities")}</div>
                        <div className="right">
                            {/* <div className="dropDownBox">
                                <div className="MarketSearchRow">
                                    <Dropdown overlay={props.typeMenu} trigger={['click']} onVisibleChange={() => { }}>
                                        <div className="search">
                                            <div className="searchBox">{t("All")}</div>
                                            <img className={props.expand1 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                                        </div>
                                    </Dropdown>
                                </div>
                            </div> */}
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
                                                        <div className="bottom">{t("as fixed price")}</div>
                                                    </div>
                                                    <div className='group'>
                                                        <div className="item projectName">
                                                            <div className="leftBox">
                                                                <img src={item.projectLogo} alt="" />
                                                            </div>
                                                            <div className="right">
                                                                <Tooltip title={<span style={{ fontWeight: 400, fontSize: "14px", color: "#000000" }}>{item.projectName}</span>} color="#FFF" key="tips">
                                                                    <div className="top autoTop" onClick={() => { navigate('/Launch?tokenAddress=' + item?.tokenAddress) }}>{item.isAuthentication === 1 ? <img src={authentication} alt="" /> : <img src={NotCertified} alt="" />}{item.projectName} </div>
                                                                </Tooltip>

                                                                <div className="bottom" onClick={() => { goPath(item) }}>{item.nftName}</div>
                                                            </div>
                                                        </div>
                                                        <div className="item">
                                                            <div className="top">{item.num} {item.coinName}</div>
                                                            <div className=" bottom">{item.uprice && (`$` + NumSplic(item.uprice, 4))}</div>
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
                                                    <div className="type">{t("From")}</div>
                                                </div>
                                                <div className="item">
                                                    <div className="text" onClick={() => { goSomeone(item.toAddress) }}>
                                                        {
                                                            item.toAddress ? AddrHandle(item.toAddress, 6, 4) : '-'
                                                        }
                                                    </div>
                                                    <div className="type">{t("To")}</div>

                                                </div>
                                                <div className="item date">
                                                    <div className="text type-date">
                                                        {HowLongAgo(item.createTime)}
                                                    </div>
                                                    <div className="type">{t("Time")}</div>
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
