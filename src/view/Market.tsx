import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { getTradeOrder, getOrderType } from '../API'
import TransactionTips from '../components/TransactionTips'
import { stateType } from '../store/reducer'
import { useSelector, useDispatch } from "react-redux";
import Goods, { NftInfo } from '../components/HotspotCard'
import { createAddMessageAction } from '../store/actions'
import ScreenModal, { ScreenDataType } from '../components/ScreenModal'
import NoData from '../components/NoData'
import { Menu, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next'

import '../assets/style/Market.scss'
import openIcon from '../assets/image/openIconWhite.png'
import filter from '../assets/image/filter.png'


export default function Market(): JSX.Element {
  // 控制图标上下
  const [expand14, setExpand14] = useState(true);
  const [expand15, setExpand15] = useState(true);
  const [tabActive, setTabActive] = useState(1);
  const dispatch = useDispatch();
  let { t } = useTranslation()
  let state = useSelector<stateType, stateType>(state => state);
  const navigate = useNavigate();
  let [showScreenModal, setShowScreenModal] = useState<boolean>(false)
  let [TradeOrder, setTradeOrder] = useState<NftInfo[]>([])
  let [pageNum, setPageNum] = useState<number>(1)
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
      setTradeOrder(res.data)
      // console.log(res,"交易场数据")
    })
  }, [sortIndex, typeIndex, state.token])
  /* 修改筛选条件 重置分页 */
  useEffect(() => {
    setPageNum(1)
  }, [sortIndex, typeIndex])
  /* 加载更多 */
  function LoadMore() {
    // console.log("加载更多")
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
      // console.log(res,"交易场数据")
    })
  }
  
  return (
    <div className="MarketPage">
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
          <>
            <div className="goodsList">
              <Goods></Goods>
              <Goods></Goods>
              <Goods></Goods>
              <Goods></Goods>
            </div>
            <div className="LoadMore pointer flexCenter" onClick={LoadMore}>{t('Load More')}  {'>'}</div>
          </>
        </>}

        {/* 动态 */}
        {
          tabActive === 1 && <div className='activeBox'>
            <div className="MarketSearchRow">
              <Dropdown overlay={typeMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand14, expand14)}>
                <div className="search">
                  <div className="searchBox">{typeMap[typeIndex].key}</div>
                  <img className={expand14 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                </div>
              </Dropdown>
            </div>
            <div className="itemBigBox">
              <div className="titleBox">
                <div className="titleItem type">类型</div>
                <div className="titleItem">物品</div>
                <div className="titleItem">价格</div>
                <div className="titleItem">从</div>
                <div className="titleItem">到</div>
                <div className="titleItem date">日期</div>
              </div>
              <div className="contentBox">
                <div className="itemBox">
                  <div className="item type">
                    <div className="top">上架</div>
                    <div className="bottom">一口价</div>
                  </div>
                  <div className="item">
                    <div className="leftBox">
                      <img src="" alt="" />
                    </div>
                    <div className="right">
                      <div className="top">项目名称 <img src="" alt="" /></div>
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
    </div >
  )
}
