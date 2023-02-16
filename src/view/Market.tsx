import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom";
import { getTradeOrder, getOrderType } from '../API'
import TransactionTips from '../components/TransactionTips'
import { stateType } from '../store/reducer'
import { useSelector, useDispatch } from "react-redux";
import Goods, { NftInfo } from '../components/HotspotCard'
import { createAddMessageAction } from '../store/actions'
import ScreenModal, { ScreenDataType } from '../components/ScreenModal'
import ConfirmModal from '../components/ConfirmModal'
import ActioinBox from '../components/ActionBox'
import NoData from '../components/NoData'
import ActionBox from '../components/ActionBox'
import { Menu, Dropdown, Collapse, Space } from 'antd';
import { useTranslation } from 'react-i18next'
import { getTradeOrderState } from '../API'
import { HowLongAgo, AddrHandle } from '../utils/tool'

import '../assets/style/Market.scss'
import openIcon from '../assets/image/openIconWhite.png'
import filter from '../assets/image/filter.png'
import demoTestImg from '../assets/image/demoTestImg.png'
import authentication from '../assets/image/authentication.svg'
import NotCertified from '../assets/image/NotCertified.svg'


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
  const [params] = useSearchParams();
  let id = params.get("id")
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
    "上架",
    "成交",
    "取消",
    "转出",
    "调价",
  ]
  // 下拉图标旋转
  const handleDropDown = (fun: any, value: boolean) => {
    fun(!value);
  }

  /* 修改筛选条件 */
  function changeScreen(ScreenData: getOrderType, typeIndex?: number, sortIndex?: number) {
    typeIndex !== undefined && setTypeIndex(typeIndex)
    sortIndex !== undefined && setSortIndex(sortIndex)
    setPageNum(1)
    getTradeOrder(ScreenData).then(res => {
      setTradeOrder(res.data)
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
  }, [sortIndex, typeIndex, state.token, buyNFTModal, tabActive])
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
    return navigate(`/NFTDetails?tokenId=${goods.tokenId}&&tokenAddress=${goods.tokenAddress}`)
  }

  function goSomeone(address: string) {
    navigate('/Someone?address=' + address)
  }
  useEffect(() => {
    setTabActive(Number(id))
  }, [])

  useEffect(() => {
    getTradeOrderState('Market').then(res => {
      console.log(res.data, "最近动态")
      if (res.data.length !== 0) {
        setSynamicInfo(res.data)
      }
    })
  }, [tabActive])

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
                      <Goods key={index} NftInfo={{ ...item, floorPrice: item.price }} buyBtnFun={() => { buyBtnFun(item) }} tag="Market" goPath={() => { goPath(item) }}></Goods>
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
            {
              dynamicInfo.length > 0 && <ActionBox tableData={dynamicInfo}></ActionBox>
            }
          </div>
        }
      </div>
      <ScreenModal isShow={showScreenModal} close={() => { setShowScreenModal(false) }} changeScreen={changeScreen} ></ScreenModal>
      {currentTradeOrder && <ConfirmBuyNFTModal projectName={currentTradeOrder?.name} NFTInfo={currentTradeOrder} isShow={buyNFTModal} close={() => { setBuyNFTModal(false) }} changeScreen={changeScreen} ></ConfirmBuyNFTModal>}
    </div >
  )
}
