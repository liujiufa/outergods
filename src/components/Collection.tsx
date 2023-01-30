import React from 'react'
import {toThousands , NumSplic} from '../utils/tool'
import '../assets/style/componentStyle/Collection.scss'
// import cardImg from '../assets/image/cardImg.png'
// import priceIcon from '../assets/image/priceIcon.png'
import DemoxIcon from '../assets/image/DemoxIcon.png'
import BNBIcon from '../assets/image/BNBIconWhite.png'


let TokenICON :{[key : string]: string}={
  DEMON:DemoxIcon,
  BNB:BNBIcon
}
interface CollectionInfo{
  index:number
  goPath:Function
  data:{
    projectName:string,
    blown:number,
    nftName:string,
    newPrice:number,
    image:string
    coinName:string
  }
}
export default function Collection(props:CollectionInfo) {
  return (
    <div className="CollectionCard pointer" onClick={()=>{props.goPath()}}>
      
        <span className="cardNo">{props.index+1}</span>
        <div className="cardImg">
            <img src={props.data.image || 'a.png'} alt="" />
        </div>
        <div className="cardInfo flex1">
            <div className="projectName">{props.data.projectName}</div>
            <div className="nftName">{props.data.nftName}</div>
        </div>
        <div className="PriceInfo">
            <div className="AppRate">{props.data.blown > 0 && '+'}{NumSplic(props.data.blown+'',2)}%</div>
            <div className="Price"><img src={TokenICON[props.data.coinName]} alt="" /> {toThousands(props.data.newPrice+'')}</div>
        </div>
    </div>
  )
}
