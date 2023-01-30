import React from 'react'
import '../assets/style/componentStyle/CastingItem.scss'
import 'swiper/css';
// import 'swiper/css/Autoplay';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import {NumSplic} from '../utils/tool'
import { useTranslation } from 'react-i18next'

// import CastingImg from '../assets/image/CastingImg.png'
interface stringList{ 
  cardImageUrl:string
  cardName:string
  description:string
}
export interface CastingInfo{
  image:string
  cardBaseInfo:{
    cardImageUrl:string,
    cardName:string,
    description:string
  }
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
  data:CastingInfo
  descClass?:string
  isModel:boolean
  ModelClass?:string
}
export default function CastingItem(props:PropsType) {
  let { t } = useTranslation();

  // console.log(props.data.stringListMap)
  // let ImgArr:string[]=[]
  // if(props.data.image){
  //   ImgArr = props.data.image.split(',')
  // }
  return (
    
    <div className="CastingItem">
      {/* {console.log('卡牌详情：'+props)} */}
      <div className="nftName">{props.data.cardName}</div>
      
      <div className="cardImg">
        {/* <img src={props.data.cardBaseInfo?.cardImageUrl} alt="" /> */}

        <Swiper
          modules={[Autoplay]}
          spaceBetween={50}
          autoplay={true}
        >
          {
            props.data.stringListMap.list.map((item,index)=><SwiperSlide key={index}>
              {
                props.isModel ? <div className={"Model "+props.ModelClass}>
                <img src={item.cardImageUrl} alt="" />
                <div className="CardInfo">
                  <div className="name">{item.cardName}</div>
                  <div className={"desc "+props.descClass}>{item.description}</div>
                </div>
              </div> :<img src={item.cardImageUrl} alt="" />
              }
              
            </SwiperSlide>)
          }
        </Swiper>
      </div>
      <div className="price">{t('Price')}：{props.data.price} {props.data.coinName}</div>
      <div className="surplus">
        <span>{t("Amount")}：{props.data.totalIssueNum - props.data.alreadyBuyNum}</span>
        <div className="surplusRow">
          <div className="surplusValue" style={{width:props.data.alreadyBuyNum / props.data.totalIssueNum *100+'%'}}></div>
        </div>
        <span>{NumSplic(props.data.alreadyBuyNum / props.data.totalIssueNum *100+'',2)}%</span></div>
    </div>
  )
}
