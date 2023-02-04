/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useEffect, useState } from 'react'
import GoodsCard, { NftInfo } from '../components/HotspotCard'
import SellModal from '../components/SellModal'
import FullScreenCom from '../components/FullScreen'
import NoData from '../components/NoData'
import { getOrderDetail, getNftOrderState, getUserOrder, getOrderByProject, getNftUserInfoDetail, updateUserImage, syncUserNftData } from '../API'
import { useWeb3React } from '@web3-react/core'
import { Menu, Dropdown } from 'antd';
import { stateType } from '../store/reducer'
import copy from 'copy-to-clipboard';
import { HowLongAgo, AddrHandle } from '../utils/tool'
import { useSelector, useDispatch } from "react-redux";
import { createAddMessageAction, createSetLodingAction } from '../store/actions'
import { useSearchParams, useNavigate } from "react-router-dom";
import { Table, Modal } from 'antd';
import { useTranslation } from 'react-i18next'

import chainIcon from '../assets/image/chainIcon.png'
import minCopyIcon from '../assets/image/minCopyIcon.png'
import authentication from '../assets/image/authentication.png'
import NotCertified from '../assets/image/NotCertified.png'
import Collection from '../assets/image/Collection.png'
import see from '../assets/image/see.png'
import Refresh from '../assets/image/refreshWhite.png'
import share from '../assets/image/shareWhite.png'
import set from '../assets/image/setWhite.png'
import openIcon from '../assets/image/openIconWhite.png'
import TableGoodsImg from '../assets/image/TableGoodsImg.png'
import defaultCard from '../assets/image/defaultCard.png'
import '../assets/style/GoodsDetial.scss'
const { Column } = Table;

interface NormalizedMetadataType {
  attributes: []
  image: string
  name: string
  description?: string
}
interface OrderDetailType {
  name: string,
  nftName: string
  image: string
  description: string
  tokenAddress: string
  isAuthentication: number | null
  tokenId: string
  metadata: {
    [key: string]: string;
  },
  normalizedMetadata: NormalizedMetadataType
  browseNum: number
  giveNum: number
  price: number,
  id: number,
  userAddress: string
}

export default function Sell(): JSX.Element {
  // 控制图标上下
  const [expand21, setExpand21] = useState(true);
  const dispatch = useDispatch();
  const web3React = useWeb3React()
  const navigate = useNavigate();
  let state = useSelector<stateType, stateType>(state => state);
  const [params] = useSearchParams();
  let { t } = useTranslation();

  let [OrderDetail, setOrderDetail] = useState<OrderDetailType | undefined>(undefined)
  let [attrOrInfo, setAttrOrInfo] = useState<boolean>(true)
  let [showFullScreen, setShowFullScreen] = useState<boolean>(false)
  let [tableData, setTableData] = useState([])
  /* 卖家的其他商品 */
  let [UserOrder, setUserOrder] = useState<NftInfo[]>([])
  let [DynamicState, setDynamicState] = useState(0)
  let [tokenId, setTokenId] = useState('')
  let [projectId, setProjectId] = useState('')
  let [ProjectOrder, setProjectOrder] = useState([])
  let [showSellModal, setShowSellModal] = useState<boolean>(false)

  let ID = params.get('ID')
  let tokenAddress = params.get('tokenAddress')
  let owner_of = params.get('owner_of')
  console.log(owner_of == web3React.account, (owner_of), (web3React.account));

  /* 获取交易场详情信息 */
  useEffect(() => {
    if (ID && state.token && tokenAddress) {
      getNftUserInfoDetail(tokenAddress, ID).then(res => {
        // console.log(res, "nft详情")
        setTokenId(res.data.tokenId)
        // setTokenId(res.data.tokenId)
        if (res.data.metadata) {
          res.data.metadata = JSON.parse(res.data.metadata)
          let obj: { [key: string]: string; } = {}
          Object.keys(res.data.metadata).filter((item) => item !== 'image').map((item) => {
            if (typeof res.data.metadata[item] === 'string') {
              obj[item] = res.data.metadata[item]
            }
          })
          res.data.metadata = obj
          res.data.normalizedMetadata = JSON.parse(res.data.normalizedMetadata)
        }
        setOrderDetail(res.data)
        console.log(res.data, 'NFT详情');

        if (state.token) {
          getUserOrder(res.data.userAddress).then(res => {
            setUserOrder(res.data)
            // console.log(res,"获取卖家其他商品")
          })
        }
      })
    }
  }, [ID, state.token])
  useEffect(() => {
    if (tokenId && OrderDetail && OrderDetail.tokenAddress) {
      getNftOrderState(tokenId, DynamicStateMap[DynamicState].value, OrderDetail.tokenAddress).then(res => {
        setTableData(res.data)
      })
    }
  }, [tokenId, OrderDetail, DynamicState])
  useEffect(() => {
    if (projectId && state.token) {
      getOrderByProject(projectId).then(res => {
        setProjectOrder(res.data)
        // console.log(res,"获取系列相关商品")
      })
    }
  }, [projectId, state.token])

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
  const DynamicStateMenu = (
    <Menu onClick={() => handleDropDown(setExpand21, expand21)}>
      {
        DynamicStateMap.map((item, index) => <Menu.Item key={index} onClick={() => { setDynamicState(index) }}>
          {item.key}
        </Menu.Item>)
      }
    </Menu>
  );
  const setMenu = (
    <Menu>
      <Menu.Item key="1" onClick={setHead}>
        {t('Use as avatar')}
      </Menu.Item>
      <Menu.Item key="2" onClick={FullScreen}>
        {t('Full screen display')}
      </Menu.Item>
      <Menu.Item key="3" >
        {t('Report')}
      </Menu.Item>
    </Menu>
  );
  // 下拉图标旋转
  const handleDropDown = (fun: any, value: boolean) => {
    fun(!value);
  }
  function copyUserAddr() {
    if (web3React.account) {
      copy(web3React.account as string)
      dispatch(createAddMessageAction(t('Copied')))
    } else {
      dispatch(createAddMessageAction(t('Please connect your wallet')))
    }
  }
  function setHead() {
    updateUserImage(OrderDetail?.tokenId as string).then(res => {
      dispatch(createAddMessageAction(t('Set successfully')))
    })
  }
  function FullScreen() {
    setShowFullScreen(true)
  }
  function goProject() {
    if (OrderDetail) {
      if (!OrderDetail.isAuthentication) {
        return dispatch(createAddMessageAction(t('Not certified')))
      }
      navigate('/project?projectName=' + OrderDetail.name)
    }
  }
  function CopyLink() {
    copy(window.location.href)
    dispatch(createAddMessageAction(t('Copy successful')))
  }
  function syncUserNftDataFun() {
    dispatch(createSetLodingAction(true))
    syncUserNftData(web3React.account as string).then(() => { }, () => {
      dispatch(createSetLodingAction(false))
      dispatch(createAddMessageAction(t('Sync failed')))
    })
  }
  function goSomeone(address: string) {
    if (address) {
      navigate('/Someone?address=' + address)
    }
  }
  function goProjectFun(projectName: string, isAuthentication: number | null) {
    if (!isAuthentication) {
      dispatch(createAddMessageAction(t('Not certified')))
    }
    if (projectName && isAuthentication) {
      navigate('/project?projectName=' + projectName)
    }
  }
  return (
    <>
      <div className="GoodsDetial">
        <div className="DetialImg DetialImg1 flexCenter">
          <div className="GoodsImg">
            {
              OrderDetail && <img
                id="nftImg"
                src={OrderDetail.normalizedMetadata.image || defaultCard}
                onError={(e: any) => {
                  // 替换的图片
                  e.target.src = defaultCard;
                  // 控制不要一直触发错误
                  e.onError = null;
                }}
                alt="" />
            }
          </div>
        </div>
        <div className="GoodsInfo">
          <div className="infoRow">
            <div className="rowLeft" onClick={goProject}>
              <span className="projectName pointer">{OrderDetail && OrderDetail?.name}</span>
              {
                OrderDetail && OrderDetail.isAuthentication ? <img src={authentication} alt="" /> : <img src={NotCertified} alt="" />
              }
            </div>
            {/* <div className="rowRight pointer">
              <img src={Collection} alt="" />
              <div className="colorA5">{OrderDetail && OrderDetail.browseNum}</div>
              <img src={see} alt="" />
              <div className="colorA5">{OrderDetail && OrderDetail.giveNum}</div>
            </div> */}
          </div>
          <div className="infoRow">
            <div className="rowLeft"><span className="nftName">{OrderDetail && OrderDetail.normalizedMetadata.name}</span></div>
            {/* 分享组 */}
            <div className="shareGroup">
              <div className="item flexCenter pointer">
                <img src={Refresh} alt="" onClick={syncUserNftDataFun} />
              </div>
              <div className="item flexCenter pointer" onClick={CopyLink}>
                <img src={share} alt="" />
              </div>
              <Dropdown overlay={setMenu} trigger={['click']} >
                <div className="item flexCenter pointer">
                  <img src={set} alt="" />
                </div>
              </Dropdown>
            </div>
          </div>
          <div className="hold">{t('hold address')}
            {/* {OrderDetail && AddrHandle(OrderDetail.userAddress as string) } */}
            <div className="userAddress flexCenter pointer" onClick={() => goSomeone(owner_of as string)}>
              <img src={chainIcon} alt="" />
              <span>{OrderDetail && AddrHandle(owner_of as string)}</span>
              {/* <img className="copyIcon" onClick={copyUserAddr} src={minCopyIcon} alt="" /> */}
            </div>
          </div>
          <div className="DetialImg DetialImg2 flexCenter">
            <div className="GoodsImg">
              {
                OrderDetail && <img
                  id="nftImg"
                  src={OrderDetail.normalizedMetadata.image || defaultCard}
                  onError={(e: any) => {
                    // 替换的图片
                    e.target.src = defaultCard;
                    // 控制不要一直触发错误
                    e.onError = null;
                  }}
                  alt="" />
              }
            </div>
          </div>
          {
            (web3React.account)?.toLowerCase() !== (owner_of)?.toLowerCase && <div className="buyRow">
              <div className="buyPrice">
                {/* <img src={thumbtack} alt="" /> */}
                <div className="division"></div>
                <div className="Price">
                  <div className="tokenNum">-</div>
                  <div className="dollar">({t('Not listed')})</div>
                </div>
              </div>
              <div className="BuyBtn NoBuyBtn flexCenter">{t('Buy')}</div>
            </div>
          }
          {/* 描述 */}

          <div className="describe">
            {t('description')}：{
              OrderDetail && OrderDetail.normalizedMetadata?.description
            }
          </div>
          {/* 出售按钮 */}
          {
            (web3React.account)?.toLowerCase() === (owner_of)?.toLowerCase() && <div className="sellBtn pointer flexCenter" onClick={() => { setShowSellModal(true) }}>{t('Sale')}</div>
          }
          {/* 属性 信息 */}
          <div className="attribute">
            <div className={attrOrInfo ? "item activeItem pointer flexCenter" : "item pointer flexCenter"} onClick={() => { setAttrOrInfo(true) }}>{t('Attributes')}</div>
            <div className={attrOrInfo ? "item flexCenter pointer" : "item activeItem pointer flexCenter"} onClick={() => { setAttrOrInfo(false) }}>{t('Info')}</div>
          </div>
          {/* 属性行 */}
          {
            attrOrInfo ? <>{
              OrderDetail && OrderDetail.metadata && Object.keys(OrderDetail.metadata).map(item => {
                return <div className="attrRow" key={item}>
                  <div>{item}</div>
                  <div className="attrValue">{OrderDetail && OrderDetail.metadata[item]}</div>
                </div>
              })
            }</> :
              <>
                {
                  OrderDetail && <div className="attrRow">
                    <div>{t('CONTRACT')}</div>
                    <a href={'https://bscscan.com/address/' + OrderDetail.tokenAddress} target="_blank" rel="noreferrer">
                      <div className="attrValue fontNwhite">{AddrHandle(OrderDetail.tokenAddress, 10, 6)}</div>
                    </a>
                  </div>
                }
                <div className="attrRow">
                  <div>{t('TOKEN ID')}</div>
                  <div className="attrValue">{OrderDetail && (OrderDetail.tokenId.length > 16 ? AddrHandle(OrderDetail.tokenId, 10, 6) : OrderDetail.tokenId)}</div>
                </div>
                <div className="attrRow">
                  <div>{t('BLOCKCHAIN')}</div>
                  <div className="attrValue">BNB Chain</div>
                </div>
              </>
          }
        </div>
        <div className="dynamicOrTable">
          <div className="tab">
            <div className="item activeItem flexCenter">{t('Activities')}</div>
          </div>
          <Dropdown overlay={DynamicStateMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand21, expand21)}>
            <div className="search">
              {DynamicStateMap[DynamicState].key}
              <img className={expand21 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
            </div>
          </Dropdown>
        </div>
        {/* 表格 start*/}
        <div className="TableBox">
          <Table dataSource={tableData} pagination={false} rowKey="id" scroll={{ x: 'max-content' }}>
            <Column
              title={t('Type')}
              render={item => (
                <>
                  <div className="typeMain">Listing</div>
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
                      <div className="protName pointer" onClick={() => { goProjectFun(item.projectName, item.isAuthentication) }}>{item.projectName} {item.isAuthentication === 1 ? <img src={authentication} alt="" /> : <img src={NotCertified} alt="" />}</div>
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
                    <div className="Uprice">${item.uorderPrice}</div>
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
                  {item.formAddress}
                </div>
              )}
            />
            <Column
              align="center"
              title={t('To')}
              render={item => (
                <div className="color33 pointer" onClick={() => { goSomeone(item.toAddress) }}>
                  {item.toAddress ? item.toAddress : "-"}
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
        </div>
        {/* 表格 end*/}
        {
          OrderDetail && <div className="other">{t('View Collection')}</div>
        }
        {
          ProjectOrder.length > 0 ? <>
            <div className="otherRow">
              {
                ProjectOrder.map((item, index) => <GoodsCard key={index} NftInfo={item}></GoodsCard>)
              }
            </div>
            <div className="LoadMore flexCenter">{t('View Collection')}  {'>'}</div>
          </> : <NoData></NoData>
        }
        {
          OrderDetail && <SellModal isShow={showSellModal} close={() => { setShowSellModal(false) }} data={{ nftName: OrderDetail!.normalizedMetadata.name, projectName: OrderDetail!.name, image: OrderDetail!.normalizedMetadata.image, id: OrderDetail!.id, tokenId: OrderDetail!.tokenId, tokenAddress: OrderDetail!.tokenAddress }} ></SellModal>
        }
        {
          OrderDetail && showFullScreen && <FullScreenCom close={() => { setShowFullScreen(false) }} image={OrderDetail.image as string}></FullScreenCom>
        }
      </div>
    </>
  )
}
