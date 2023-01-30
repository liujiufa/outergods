import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import '../assets/style/componentStyle/HotspotCard.scss'
import { userGiveLike } from '../API'
import { NumSplic } from '../utils/tool'
import Img from './Img'
import { useTranslation } from 'react-i18next'
// import HotspotCardImg from '../assets/image/HotspotCardImg.png'
import authentication from '../assets/image/authentication.png'
import NotCertified from '../assets/image/NotCertified.png'
import thumbtack from '../assets/image/thumbtack.png'
import BNBIcon from '../assets/image/BNBPrice.png'
import NotLike from '../assets/image/like.png'
import Like from '../assets/image/Collection.png'
import defaultCard from '../assets/image/defaultCard.png'
import testNFT from '../assets/image/testNFT.png'
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
  let [isLike, setIsLike] = useState<boolean>(true)
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
  function goProject() {
    if (props.NftInfo && props.NftInfo.name && props.NftInfo.isAuthentication) {
      navigate('/project?projectName=' + props.NftInfo.name)
    }
  }
  function goDetial() {

  }
  return (
    /* onClick={()=>{navigate('/Goods')}} */
    <div className="HotspotCard pointer">
      <div className="imgBox" >
        {false && <div className="buyBtn flexCenter">购买</div>}
        <Img url={testNFT}></Img>
      </div>
      <div className="bottonBox">
        <div className="cardName" onClick={goProject}>XXXXXXXXX</div>
        <div className="cardTokenId">Mystery Box</div>
        <div className="box">
          <div className="cardPrice">
            <img src={BNBIcon} alt="" /> 0.01 BNB <span>($0.45)</span>
          </div>
          <div className="Collection pointer nowrap" onClick={LikeFun}><img src={isLike ? Like : NotLike} alt="" /> {LikeNum}</div>
        </div>
      </div>
    </div>
  )
}
