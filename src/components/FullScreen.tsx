import React from 'react'
import defaultCard from '../assets/image/defaultCard.png'
import '../assets/style/componentStyle/FullScreen.scss'
import { useTranslation } from 'react-i18next'

interface propsType{
    image:string
    close:Function
}
export default function FullScreen(props:propsType) {
  let { t } = useTranslation();

  return (
    <div className="FullScreenBg flexCenter" onClick={()=>{props.close()}}>
        <img 
        src={props.image || defaultCard} 
        onError={(e:any) => {
          // 替换的图片
          e.target.src = defaultCard;
          // 控制不要一直触发错误
          e.onError = null;
        }}
        alt="" />
        <div>{t('Click anywhere to close')}</div>
    </div>
  )
}
