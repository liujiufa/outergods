import React, { useState, useEffect } from 'react'

import '../assets/style/componentStyle/CastingItemMR.scss'
import 'swiper/css';
// import 'swiper/css/Autoplay';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import { useSelector, useDispatch } from "react-redux";
import { createAddMessageAction, createSetLodingAction } from '../store/actions'
import {NumSplic} from '../utils/tool'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { Contracts } from '../web3'
import { contractAddress } from '../config'

import CastingItemBg from '../assets/image/CastingItemBg.png'
import test from '../assets/image/test.png'
import BigNumber from 'big.js'
BigNumber.NE = -40
BigNumber.PE = 40
interface stringList{
  cardImageUrl:string
  cardName:string
  description:string
}
interface BuyInfo {
  issueIntroduce: string
  payTokenAddress: string
  cardSystem: string
  projectReferral: string
}
export interface CastingInfo{
  image:string
  cardName:string
  cardType:number
  price:number
  totalIssueNum:number
  alreadyBuyNum:number
  id:number
  coinName:string
  payTokenAddress:string
  stringListMap:{
    list:stringList []
  }
}
interface PropsType{
  data:CastingInfo,
  approveFun:Function
  castingFun:Function
  approveNum:string
}
function threeText(text:string){
  return <div className="TextMain">
      <div className="Text1">{text}</div>
      <div className="Text2">{text}</div>
      <div className="Text3">{text}</div>
  </div>
}
export default function CastingItem(props:PropsType) {
  let { t } = useTranslation();
  function isApprove(price: number, coinName: string) {
    return new BigNumber(props.approveNum).gte(price) || coinName === 'BNB'
}
  return (
    
    <div className="CastingItem">
      {/* {console.log('卡牌详情：'+props)} */}
      {/* <div className="nftName">{props.data.cardName}</div> */}
      <div className="nftName">{props.data.price}</div>
      <div className="cardImg">
        {/* <img src={CastingImg} alt="" /> */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={50}
          autoplay={true}
        >
          {
            props.data.stringListMap.list.map((item,index)=><SwiperSlide key={index}>
              <div className="Model">
                <img src={item.cardImageUrl} alt="" />
                {/* <img src={test} alt="" /> */}
                {/* <div className="CardInfo">
                  <div className="name">{item.cardName}</div>
                  <div className="desc">{item.description}</div>
                </div> */}
              </div>
            </SwiperSlide>)
          }
        </Swiper>
      </div>
      {
        threeText(t('Price')+': '+props.data.price +' '+ props.data.coinName)
      }
      {/* <div className="price">{t('Price')}：{props.data.price} {props.data.coinName}</div> */}
      <div className="surplus">
        <span>{threeText(t("Amount")+': '+(props.data.totalIssueNum - props.data.alreadyBuyNum))}</span>
        <div className="surplusRow">
          <div className="surplusValue" style={{width:props.data.alreadyBuyNum / props.data.totalIssueNum *100+'%'}}></div>
        </div>
        <span>{threeText(NumSplic(props.data.alreadyBuyNum / props.data.totalIssueNum *100+'',2)+'%')}</span></div>
        {
         isApprove(props.data.price , props.data.coinName) ? 
         <div className={props.data.totalIssueNum > props.data.alreadyBuyNum ? 'CastingBtn flexCenter' : 'CastingBtn invalid flexCenter'} onClick={()=>props.castingFun(props.data.price,props.data.coinName,props.data.cardType,props.data.totalIssueNum > props.data.alreadyBuyNum)}>{threeText(t('Mint'))}</div> 
         : 
         <div className="CastingBtn flexCenter" onClick={()=>props.approveFun()}>{threeText(t('Authorize'))}</div>
        }
    </div>
  )
}
