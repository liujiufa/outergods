import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { getTradeOrder, getOrderType } from '../API'
import TransactionTips from '../components/TransactionTips'
import { stateType } from '../store/reducer'
import { useSelector, useDispatch } from "react-redux";
import Goods, { NftInfo } from '../components/HotspotCard'
import { createAddMessageAction } from '../store/actions'
import ScreenModal, { ScreenDataType } from '../components/ScreenModal'
import ConfirmModal from '../components/ConfirmModal'
import NoData from '../components/NoData'
import { Menu, Dropdown, Collapse, Space } from 'antd';
import { useTranslation } from 'react-i18next'
import { getTradeOrderState } from '../API'
import { HowLongAgo, AddrHandle } from '../utils/tool'

import '../assets/style/Market.scss'
import openIcon from '../assets/image/openIconWhite.png'
import filter from '../assets/image/filter.png'
import demoTestImg from '../assets/image/demoTestImg.png'
import authentication from '../assets/image/authentication.png'
import NotCertified from '../assets/image/NotCertified.png'


import ConfirmBuyNFTModal from '../components/ConfirmBuyNFTModal'
import { DownOutlined, UpOutlined } from '@ant-design/icons';
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

export default function Market(): JSX.Element {
  // 控制图标上下
  const [expand14, setExpand14] = useState(true);
  const [expand15, setExpand15] = useState(true);
  const [tabActive, setTabActive] = useState(0);
  const [activeKey, setActiveKey] = useState("");

  let [dynamicInfo, setSynamicInfo] = useState<dynamic[]>([])
  const dispatch = useDispatch();
  let { t } = useTranslation()
  let state = useSelector<stateType, stateType>(state => state);
  const navigate = useNavigate();

  const listData = [1, 2, 3, 4, 5]

  let [showScreenModal, setShowScreenModal] = useState<boolean>(false)
  let [buyNFTModal, setBuyNFTModal] = useState<boolean>(false)
  let [TradeOrder, setTradeOrder] = useState<NftInfo[]>([])
  let [currentTradeOrder, setCurrentTradeOrder] = useState<NftInfo>()
  let [pageNum, setPageNum] = useState<number>(1)
  let operateTtype = [
    "挂单",
    "出售",
    "转出"
  ]
  // 下拉图标旋转
  const handleDropDown = (fun: any, value: boolean) => {
    fun(!value);
  }

  /* 修改筛选条件 */
  function changeScreen(ScreenData: getOrderType, typeIndex?: number, sortIndex?: number) {
    // console.log(ScreenData)
    typeIndex !== undefined && setTypeIndex(typeIndex)
    sortIndex !== undefined && setSortIndex(sortIndex)
    setPageNum(1)
    getTradeOrder(ScreenData).then(res => {
      setTradeOrder(res.data)
      // console.log(res,"搜索后的交易场数据")
    })
  }
  let typeMap = [
    {
      key: t('All'),
      value: -1
    },
    {
      key: t('Fixed Price'),
      value: 0
    }
  ]
  let [typeIndex, setTypeIndex] = useState(0)
  const typeMenu = (
    <Menu onClick={() => handleDropDown(setExpand14, expand14)}>
      {
        typeMap.map((item, index) => <Menu.Item key={index} onClick={() => { setTypeIndex(index) }}>
          {item.key}
        </Menu.Item>)
      }
    </Menu>
  );
  let sortMap = [
    {
      key: t('Newest'),
      value: 1
    },
    {
      key: t('Price: High to Low'),
      value: 2
    },
    {
      key: t('Price: Low to High'),
      value: 3
    }
  ]
  let [sortIndex, setSortIndex] = useState(0)
  const sortMenu = (
    <Menu onClick={() => handleDropDown(setExpand15, expand15)}>
      {
        sortMap.map((item, index) => <Menu.Item key={index} onClick={() => { setSortIndex(index) }}>
          {item.key}
        </Menu.Item>)
      }
    </Menu>
  );
  /* 筛选条件改变重新加载第一页数据 */
  useEffect(() => {
    getTradeOrder({
      bidType: typeMap[typeIndex].value,
      type: -1,
      projectName: '',
      minPrice: 0,
      maxPrice: 0,
      sortType: sortMap[sortIndex].value,
      currentPage: 1,
      pageSize: 10
    }).then(res => {
      res.data.map((item: any, index: number) => {
        item.metadata = JSON.parse(item.metadata)
      })
      console.log(res.data, "交易场数据")
      setTradeOrder(res.data)
    })
  }, [sortIndex, typeIndex, state.token])
  /* 修改筛选条件 重置分页 */
  useEffect(() => {
    setPageNum(1)
  }, [sortIndex, typeIndex])

  const buyBtnFun = (item: any) => {
    console.log(item, "购买");
    setBuyNFTModal(true)
    setCurrentTradeOrder(item)
  }

  function LoadMore() {
    let page = pageNum + 1
    setPageNum(page)
    getTradeOrder({
      bidType: typeMap[typeIndex].value,
      type: -1,
      projectName: '',
      minPrice: 0,
      maxPrice: 0,
      sortType: sortMap[sortIndex].value,
      currentPage: page,
      pageSize: 10
    }).then(res => {
      if (res.data.length === 0) {
        return dispatch(createAddMessageAction(t('No more')))
      } else {
        setTradeOrder([...TradeOrder, ...res.data])
      }
    })
  }

  /* 判断跳转到出售页面还是正在出售页面 */
  function goPath(goods: any) {
    /* 状态正常去挂卖 */
    return navigate(`/NFTDetails?ID=${goods.tokenId}&&tokenAddress=${goods.tokenAddress}&&owner_of=${goods.userAddress}&&NFTDetailType=1`)
  }
  function goSomeone(address: string) {
    navigate('/Someone?address=' + address)
  }

  useEffect(() => {
    getTradeOrderState('Market').then(res => {
      console.log(res.data, "最近动态")
      if (res.data.length !== 0) {
        setSynamicInfo(res.data)
      }
    })
    let Time = setInterval(() => {
      getTradeOrderState('Market').then(res => {
        if (res.data.length !== 0) {
          setSynamicInfo(res.data)
          // console.log(res,"最近动态")
        }
      })
    }, 3000)
    return () => {
      clearInterval(Time)
    }
  }, [])

  return (
    <div id="market" className="MarketPage">
      {/* <TransactionTips></TransactionTips> */}
      <div className="contentBox">
        <div className="tabBox">
          <div className="tabContent" >
            <div className={tabActive === 0 ? "tabItem flexCenter tabItemActive" : "tabItem flexCenter "} onClick={() => { setTabActive(0) }}>NFT</div>
            <div className={tabActive === 1 ? "tabItem flexCenter  tabItemActive" : "tabItem flexCenter "} onClick={() => { setTabActive(1) }}>动态</div>
          </div>
        </div>

        {/* 0NFT */}
        {tabActive === 0 && <>
          <div className="MarketSearchRow">
            <Dropdown overlay={typeMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand14, expand14)}>
              <div className="search">
                <div className="searchBox">{typeMap[typeIndex].key}</div>
                <img className={expand14 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
              </div>
            </Dropdown>
            <Dropdown overlay={sortMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand15, expand15)}>
              <div className="search">
                <div className="searchBox">{sortMap[sortIndex].key}</div>
                <img className={expand15 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
              </div>
            </Dropdown>
            <div className="filter pointer" onClick={() => { setShowScreenModal(true) }}>
              <img src={filter} alt="" />
              {t('Filter')}
            </div>
          </div>
          {
            TradeOrder.length > 0 ?
              <>
                <div className="goodsList">
                  {TradeOrder.map((item, index) => 
                                <div className="usernft">
                  <Goods key={index} NftInfo={item} buyBtnFun={() => { buyBtnFun(item) }} tag="Market" goPath={() => { goPath(item) }}></Goods>
                  </div>
                  )}
                </div>
                <div className="LoadMore pointer flexCenter" onClick={LoadMore}>{t('Load More')}  {'>'}</div>
              </> :
              <NoData />
          }
        </>}

        {/* 动态 */}
        {
          tabActive === 1 && <div className='activeBox'>
            <div className="MarketSearchRow" style={{ padding: 0 }}>
              <Dropdown overlay={typeMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand14, expand14)}>
                <div className="search">
                  <div className="searchBox">{typeMap[typeIndex].key}</div>
                  <img className={expand14 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                </div>
              </Dropdown>
            </div>
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
                {dynamicInfo &&
                  dynamicInfo.map((item: any, index: number) => <div key={index} className="itemBox">
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
                        dynamicInfo.length > 0 && dynamicInfo.map((item: any, idx: number) =>
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
                            <div className="separate" style={{ display: listData.length === (idx + 1) ? "none" : "block" }}></div>
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



        {/*  旧 */}
        {/* {
          TradeOrder.length > 0 ?
            <>
              <div className="goodsList">
                {TradeOrder.map((item, index) => <Goods key={index} NftInfo={item} goPath={() => { navigate('/Goods?type=Market&orderId=' + item.orderId) }}></Goods>)}
              </div>
              <div className="LoadMore pointer flexCenter" onClick={LoadMore}>{t('Load More')}  {'>'}</div>
            </> :
            <NoData />
        } */}

      </div>
      <ScreenModal isShow={showScreenModal} close={() => { setShowScreenModal(false) }} changeScreen={changeScreen} ></ScreenModal>
      {currentTradeOrder && <ConfirmBuyNFTModal NFTInfo={currentTradeOrder} isShow={buyNFTModal} close={() => { setBuyNFTModal(false) }} changeScreen={changeScreen} ></ConfirmBuyNFTModal>}
    </div >
  )
}
