import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import '../assets/style/componentStyle/HotspotCard.scss'
import { userGiveLike } from '../API'
import { NumSplic } from '../utils/tool'
import Img from './Img'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'

// import HotspotCardImg from '../assets/image/HotspotCardImg.png'
import authentication from '../assets/image/authentication.png'
import NotCertified from '../assets/image/NotCertified.png'
import thumbtack from '../assets/image/thumbtack.png'
import BNBIcon from '../assets/image/BNBPrice.png'
import NotLike from '../assets/image/like.png'
import Like from '../assets/image/Collection.png'
import defaultCard from '../assets/image/defaultCard.png'
import testNFT from '../assets/image/testNFT.png'
import NftCardImagePng from '../assets/image/nftCardImage.png'
import NFT1Png from '../assets/image/nftGroup/nft1.png'
import moreBtnIcon from '../assets/image/moreBtnIcon.png'


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
  isAuthentication: number | null,
  normalized_metadata: NftItem
}

export interface propsType {
  NftInfo: NftInfo
  goPath?: Function
}
/* 少地板价 */
export default function HotspotCard(props: any) {
  const navigate = useNavigate();
  const web3React = useWeb3React()
  let [isLike, setIsLike] = useState<boolean>(true)
  let [activeMenu, setActiveMenu] = useState<boolean>(false)
  let [activeBuyMenu, setActiveBuyMenu] = useState<boolean>(false)
  let [LikeNum, setLikeNum] = useState<number>(0)
  let { t } = useTranslation();

  function LikeFun(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
    userGiveLike(props.NftInfo.tokenId, props.NftInfo.tokenAddress).then(res => {
      if (!isLike) {
        setLikeNum(LikeNum + 1)
      } else {
        setLikeNum(LikeNum - 1)
      }
      setIsLike(!isLike)
      // console.log(res,'点赞')
    })
  }

  function goProject(e: any) {
    e.stopPropagation();
    console.log("12");
    if (props.NftInfo && props.NftInfo.name) {
      navigate('/Launch?projectName=' + props.NftInfo.name)
    }
  }

  function HotspotCardFun(e: any) {
    // e.stopPropagation()
    if (props.tag === "Personal") {
      setActiveMenu(true)
    }
  }

  function BuyNFTFun(e: any) {
    e.stopPropagation()
    if (props.tag === "Market") {
      setActiveBuyMenu(true)
    }
  }

  const list = [{
    title: "总交易量",
    amount: "1110.1",
    isMoney: true
  },
  {
    title: "地板价",
    amount: "0.005",
    isMoney: true
  },
  {
    title: "项目",
    amount: "111"
  },
  {
    title: "已上架",
    amount: "111"
  },
  {
    title: "持有者",
    amount: "111"
  }]
  return (
    <div className="HotspotCard pointer" onMouseEnter={(e) => { HotspotCardFun(e) }} onMouseLeave={() => { setActiveMenu(false) }} onClick={(e) => { props.goPath(); e.stopPropagation(); }}>
      <div className="imgBox" style={{ borderRadius: "20px 20px 45px 0px" }} onMouseEnter={(e) => { BuyNFTFun(e) }} onMouseLeave={() => { setActiveBuyMenu(false) }}>
        {/* {activeBuyMenu && <div className="buyBtn flexCenter">购买</div>} */}
        {activeBuyMenu && (props.NftInfo?.userAddress).toLowerCase() !== (web3React.account)?.toLowerCase() && <div className="buyBtn flexCenter" onClick={(e) => { e.stopPropagation(); props.buyBtnFun() }}>购买</div>}
        <Img url={props.NftInfo?.normalized_metadata?.image || props.NftInfo?.metadata?.image}></Img>
      </div>
      <div className="bottonBox">
        <div className="box">
          <div className="cardName" >{props.NftInfo?.normalized_metadata?.name || props.NftInfo?.metadata?.name || "XXXXXXXXX"}</div>
          <div className="Collection pointer nowrap" onClick={LikeFun}><img src={isLike ? Like : NotLike} alt="" /> {LikeNum}</div>
        </div>

        {/* <div className="cardTokenId home-nft" onClick={(e) => { goProject(e) }}> */}
        <div className="cardTokenId home-nft" onClick={(e) => { goProject(e) }}>
          {props.NftInfo?.name || props.NftInfo?.projectName || "XXXXXXXXX"}
          <div className="hover-show-card">
            <img className="hover-show-card-img" src={NftCardImagePng} />
            <div className="hover-show-card-content">
              <div className="hover-show-card-content-top">
                <img src={NFT1Png} />
                <div className="hover-show-card-content-nft-name">
                  {props.NftInfo?.name || "XXXXXXXXX"}
                </div>
              </div>
              {/* 项目信息 */}
              <div className="hover-show-card-content-bottom">
                {
                  list.map((item) => <div className="hover-show-card-content-item">
                    <div className="hover-show-card-content-amount">
                      {`${!!item?.isMoney ? "$" : ""}${item.amount}`}
                    </div>
                    <div className="hover-show-card-content-name">
                      {item.title}
                    </div>
                  </div>)
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        activeMenu ? <div className='menuBox'>
          <div className="left" onClick={() => { props.goPath() }}>{((props?.NftInfo?.owner_of).toLowerCase() === (web3React.account)?.toLowerCase() && props?.NftInfo?.status === 1) ? "取消出售" : "出售"}</div>
          <div className="right flexCenter"><img src={moreBtnIcon} alt="" /></div>
        </div> : <div className="cardBottomBox">
          {
            props.NftInfo?.status === 1 ?
              <div className="cardPrice">
                <img src={BNBIcon} alt="" /> {props.NftInfo?.floorPrice || props.NftInfo?.price || '0'} {props.NftInfo?.coinName} <span>({props.NftInfo?.uprice || 0})</span>
              </div> :
              <div className="cardPrice">
                Not sold
              </div>
          }
        </div>
      }
    </div >
  )
}
