import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from "react-router-dom";
import '../assets/style/componentStyle/HotspotCard.scss'
import { userGiveLike, getNFTTheTopProjectInfo } from '../API'
import { NumSplic } from '../utils/tool'
import { Tooltip } from 'antd'
import Img from './Img'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { stateType } from '../store/reducer'
import { useSelector, useDispatch } from "react-redux";
import { useConnectWallet, injected, ChainId } from '../web3'
import { createAddMessageAction, createSetLodingAction } from '../store/actions'

import authentication from '../assets/image/authentication.svg'
import NotCertified from '../assets/image/NotCertified.svg'
import thumbtack from '../assets/image/thumbtack.png'
import BNBIcon from '../assets/image/BNBPrice.png'
import ETHCoinIcon from '../assets/image/ETHCoinIcon.png'
import BTCIcon from '../assets/image/BTC.png'
import USDTIcon from '../assets/image/USDT.png'
import Like from '../assets/image/like.svg'
import NotLike from '../assets/image/Collection.svg'
import defaultCard from '../assets/image/defaultCard.png'
import testNFT from '../assets/image/testNFT.png'
import NftCardImagePng from '../assets/image/nftCardImage.png'
import NFT1Png from '../assets/image/nftGroup/nft1.png'
import moreBtnIcon from '../assets/image/moreBtnIcon.png'
import { decimalNum } from '../utils/decimalNum';


export interface NftItem {
  animation_url: null
  attributes: []
  description: string
  external_link: null
  image: string
  name: string
}
export interface NftInfo {
  name: string,
  nftName: string,
  image: string,
  price: string,
  coinName: string,
  isLike: number,
  tokenId: string,
  giveLikeNum: number,
  floorPrice: number,
  floorPriceDouble: number | null,
  id: number,
  orderId?: number,
  status: number,
  tokenAddress: string,
  projectName: string,
  isAuthentication: number | null,
  normalized_metadata: NftItem
}

export interface propsType {
  NftInfo: NftInfo
  goPath?: Function
}
export default function HotspotCard(props: any) {
  // console.log(props.NftInfo, "交易场");
  const navigate = useNavigate();
  const web3React = useWeb3React()
  let ConnectWallet = useConnectWallet()
  let state = useSelector<stateType, stateType>(state => state);
  let [isLike, setIsLike] = useState<boolean>(!!props.NftInfo?.isLike)
  let [activeMenu, setActiveMenu] = useState<boolean>(false)
  let [activeBuyMenu, setActiveBuyMenu] = useState<boolean>(false)
  let [LikeNum, setLikeNum] = useState<number>(props.NftInfo?.giveLikeNum)
  let [hoverProject, setHoverProject] = useState<any>()
  let { t } = useTranslation();
  const dispatch = useDispatch();

  function LikeFun(e: React.MouseEvent<HTMLElement>) {
    console.log(props.NftInfo.tokenId, props.NftInfo.tokenAddress, "点赞");
    e.stopPropagation()
    if (state.token || web3React.account) {
      userGiveLike(props.NftInfo.tokenId, props.NftInfo.tokenAddress).then((res: any) => {
        console.log(res);
        if (res.code === 200) {
          if (!isLike) {
            setLikeNum(LikeNum + 1)
          } else {
            setLikeNum(LikeNum - 1)
          }
        }
      }).finally(() => {
        // 取消收藏
        setIsLike(!isLike)
        if (props.tag === "collect") {
          props.getCollectFun()
        }
      })
    } else {
      dispatch(createAddMessageAction(t('Please connect your wallet')))
      // ConnectWallet(injected, ChainId.BSC)
    }
  }

  function goProject(e: any) {
    console.log(props.NftInfo);
    e.stopPropagation();
    if (props.tag === "Personal" && props.NftInfo.tokenAddress) {
      navigate('/Launch?tokenAddress=' + props.NftInfo.tokenAddress)
    }
    if (props.tag === "Market" && props.NftInfo.tokenAddress) {
      navigate('/Launch?tokenAddress=' + props.NftInfo.tokenAddress)
    }
    if (props.tag === "Home" && props.NftInfo.tokenAddress) {
      navigate('/Launch?tokenAddress=' + props.NftInfo.tokenAddress)
    }
  }

  function MouseEnterFun(e: any) {
    e.stopPropagation()
    if (props.tag === "Personal") {
      setActiveMenu(true)
    }
    if (props.tag === "Market") {
      setActiveBuyMenu(true)
    }
  }
  // 浮窗信息
  const getProjectInfo = useCallback(() => {
    if (props?.NftInfo?.tokenAddress) {
      getNFTTheTopProjectInfo(props.NftInfo.tokenAddress).then((res: any) => {
        if (res.code === 200) {
          console.log(res.data, '项目信息');
          setHoverProject(res.data)
        }
      })
    }
  }, [props?.NftInfo?.tokenAddress])

  useEffect(() => {
    if (props.NftInfo) {
      setIsLike(!!props.NftInfo.isLike)
    }
  }, [props?.NftInfo?.isLike, web3React.active])

  return (
    // <div className="HotspotCard pointer" onMouseEnter={(e) => { HotspotCardFun(e) }} onMouseLeave={() => { setActiveMenu(false) }} onClick={(e) => { props.goPath(); e.stopPropagation(); }}>
    <div className="HotspotCard pointer" onMouseEnter={(e) => { MouseEnterFun(e) }} onMouseLeave={() => { setActiveMenu(false); setActiveBuyMenu(false) }} onClick={(e) => { props.goPath(); e.stopPropagation(); }}>
      <div className="imgBox">
        {props.target !== "NFTCard" && activeBuyMenu && (props.NftInfo?.userAddress).toLowerCase() !== (web3React.account)?.toLowerCase() && <div className="buyBtn flexCenter" onClick={(e) => { e.stopPropagation(); props.buyBtnFun() }}>{t("Buy")}</div>}
        <Img url={props.NftInfo?.normalized_metadata?.image || props.NftInfo?.metadata?.image}></Img>
      </div>
      <div className="bottonBox">
        <div className="box">
          <Tooltip title={<span style={{ fontWeight: 400, fontSize: "14px", color: "#000000" }}>{props.NftInfo?.normalized_metadata?.name || props.NftInfo?.metadata?.name || "XXXXXXXXX"}</span>} color="#FFF" key="tips">
            <div className="cardName" >{props.NftInfo?.normalized_metadata?.name || props.NftInfo?.metadata?.name || "XXXXXXXXX"}</div>
          </Tooltip>
          <div className="pointer nowrap" onClick={(e) => LikeFun(e)}><img src={isLike ? Like : NotLike} alt="" /></div>
        </div>

        {/* 鼠标滑动（标题） */}
        {/* <div className="cardTokenId home-nft" onClick={(e) => { goProject(e) }}> */}
        <div className="cardTokenId home-nft" onClick={(e) => { goProject(e) }} onMouseEnter={() => { getProjectInfo() }}>
          {props.NftInfo?.name || props.NftInfo?.projectName || "XXXXXXXXX"}
          {props.NftInfo?.isAuthentication === 1 && hoverProject && <div className="hover-show-card">
            <img className="hover-show-card-img" src={hoverProject?.backImgUrl} />
            <div className="hover-show-card-content">
              <div className="hover-show-card-content-top">
                <img src={hoverProject?.img} />
                <div className="hover-show-card-content-nft-name">
                  {hoverProject?.name || "XXXXXXXXX"}
                </div>
              </div>
              {/* 项目信息 */}
              <div className="hover-show-card-content-bottom">
                <div className="hover-show-card-content-item">
                  <div className="hover-show-card-content-amount">
                    {NumSplic(hoverProject?.tradeAmount)}
                  </div>
                  <div className="hover-show-card-content-name">
                    {t("Total Volume")}
                  </div>
                </div>
                <div className="hover-show-card-content-item">
                  <div className="hover-show-card-content-amount">
                    {NumSplic(hoverProject?.floorPrice)}
                  </div>
                  <div className="hover-show-card-content-name">
                    {t("Floor")}
                  </div>
                </div>
                <div className="hover-show-card-content-item">
                  <div className="hover-show-card-content-amount">
                    {hoverProject?.holdNum}
                  </div>
                  <div className="hover-show-card-content-name">
                    {t("Items")}
                  </div>
                </div>
                <div className="hover-show-card-content-item">
                  <div className="hover-show-card-content-amount">
                    {hoverProject?.shelvesNum}
                  </div>
                  <div className="hover-show-card-content-name">
                    {t("Listed")}
                  </div>
                </div>
              </div>
            </div>
          </div>}
        </div>
      </div>
      {
        (!props?.address && activeMenu) ?
          <div className='menuBox'>
            <div className="left" onClick={() => { props.goPath() }}>
              {((props?.NftInfo?.owner_of)?.toLowerCase() === (web3React.account)?.toLowerCase() && props?.NftInfo?.status === 1) ? t("Cancel") : t("Sell")}
            </div>
            <div className="right flexCenter"><img src={moreBtnIcon} alt="" /></div>
          </div> :
          <div className="cardBottomBox">
            {/* 个人中心 */}
            {
              (props.tag === "Personal" || props.tag === "collect") && (props.NftInfo?.status === 1 ?
                <div className="cardPrice">
                  <img src={props.NftInfo?.coinImgUrl} alt="" /> <div className="priceBox"><div className="num">{decimalNum(props.NftInfo?.floorPrice || props.NftInfo?.price || '0')} {props.NftInfo?.coinName} </div> <span>(${NumSplic(props.NftInfo?.uprice, 2) || 0})</span></div>
                </div> :
                <div className="cardPrice">
                  Not sold
                </div>)
            }
            {/* 交易市场 */}
            {
              props.tag === "Market" &&
              <div className="cardPrice">
                <img src={props.NftInfo?.coinImgUrl} alt="" /> <div className="priceBox"><div className="num">{decimalNum(props.NftInfo?.floorPrice || '0')} {props.NftInfo?.coinName} </div> <span>(${decimalNum(props.NftInfo?.uprice || 0)})</span></div>
              </div>
            }
            {/* 首页 */}
            {
              props.tag === "Home" &&
              <div className="cardPrice">
                <img src={props.NftInfo?.coinImgUrl} alt="" /> <div className="priceBox"><div className="num">{decimalNum(props.NftInfo?.floorPriceDouble || '0')} {props.NftInfo?.coinName}</div>  <span>(${decimalNum(props.NftInfo?.uprice || 0)})</span></div>
              </div>
            }
          </div>
      }
    </div >
  )
}
