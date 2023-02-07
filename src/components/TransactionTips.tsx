import React, { useEffect, useState } from 'react'
import '../assets/style/componentStyle/TransactionTips.scss'
import Marquee from 'react-fast-marquee';
import { useNavigate } from "react-router-dom";
import { getHomeBannerTrade } from '../API'
import { HowLongAgo, AddrHandle } from '../utils/tool'
import { useTranslation } from 'react-i18next'

import logo from '../assets/image/NFTLogo.png'
import sale from '../assets/image/sale.png'
import transfer from '../assets/image/transfer.png'
import createOrder from '../assets/image/createOrder.png'
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
export default function TransactionTips() {
  const navigate = useNavigate();
  let [dynamicInfo, setSynamicInfo] = useState<dynamic | null>(null)
  let { t } = useTranslation();

  useEffect(() => {
    getHomeBannerTrade().then((res: any) => {
      if (res.data.length !== 0) {
        setSynamicInfo(res.data[0])
        // console.log(res, "最近动态")
      }
    })
    let Time = setInterval(() => {
      getHomeBannerTrade().then((res: any) => {
        if (res.data.length !== 0) {
          setSynamicInfo(res.data[0])
          // console.log(res,"最近动态")
        }
      })
    }, 3000)
    return () => {
      clearInterval(Time)
    }
  }, [])
  function goDetial() {
    if (dynamicInfo?.operateType === 0) {
      navigate('/Goods?orderId=' + dynamicInfo.orderId)
    } else {
      navigate('/Sell?ID=' + dynamicInfo?.id)
    }
  }
  function goSomeone(address: string) {
    navigate('/Someone?address=' + address)
  }
  function TipsText() {
    // /* 挂单 */
    // if (dynamicInfo && dynamicInfo.operateType === 0) {
    //   return (<div className="TipsText">
    //     <Marquee speed={100} pauseOnHover gradient={false}>
    //       <span className="color33 pointer" onClick={goDetial}>{dynamicInfo?.nftName || 'unnamed'}</span>
    //       <span className="colorBlue">Listed</span>
    //       <img src={createOrder} alt="" />
    //       <span className="colorA5">for {dynamicInfo?.num} {dynamicInfo?.coinName}</span>
    //       <span className="color33 pointer" onClick={() => { goSomeone(dynamicInfo?.formAddress as string) }}>{AddrHandle(dynamicInfo?.formAddress)}</span>
    //       <span className="colorA5">to</span>
    //       <span className="color33">Marketplace</span>
    //       {/* {t('Listed for 0.01BNB to Marketplace', {
    //         coinNum: dynamicInfo?.num, coinName: dynamicInfo?.coinName, Icon: <img src={createOrder} alt="" />,
    //         formAddress: <span className="color33" onClick={() => { goSomeone(dynamicInfo?.formAddress as string) }}>{AddrHandle(dynamicInfo?.formAddress)}</span>
    //       })} */}
    //       <span className="colorA5">{HowLongAgo(dynamicInfo?.createTime as number)}</span>
    //     </Marquee>
    //   </div>)
    // }
    /* 出售 */
    if (dynamicInfo && dynamicInfo.operateType === 1) {
      return (<div className="TipsText">
        <Marquee speed={100} pauseOnHover gradient={false}>
          <span className="color33 pointer" onClick={goDetial}>{dynamicInfo?.nftName || 'unnamed'}</span>
          <span className="colorRed">出售</span>
          <img src={sale} alt="" />
          <span className="colorA5">from</span>
          <span className="color33 pointer" onClick={() => { goSomeone(dynamicInfo?.formAddress as string) }}>{AddrHandle(dynamicInfo?.formAddress)}</span>
          <span className="colorA5">to</span>
          <span className="color33 pointer" onClick={() => { goSomeone(dynamicInfo?.toAddress as string) }}>{AddrHandle(dynamicInfo?.toAddress)}</span>
          <span className="colorA5">for {dynamicInfo?.num} {dynamicInfo?.coinName}</span>
          {/* {t('Sold from oxf9...810B to 0x32...b92f for 0.01BNB', {
            coinNum: dynamicInfo?.num, coinName: dynamicInfo?.coinName, Icon: <img src={sale} alt="" />,
            formAddress: <span className="color33" onClick={() => { goSomeone(dynamicInfo?.formAddress as string) }}>{AddrHandle(dynamicInfo?.formAddress)}</span>,
            toAddress: <span className="color33" onClick={() => { goSomeone(dynamicInfo?.toAddress as string) }}>{AddrHandle(dynamicInfo?.toAddress)}</span>
          })} */}
          <span className="colorA5">{HowLongAgo(dynamicInfo?.createTime as number)}</span>
        </Marquee>
      </div>)
    }
    /* 转出 */
    // if (dynamicInfo && dynamicInfo.operateType === 3) {
    //   return (<div className="TipsText">
    //     <Marquee speed={100} pauseOnHover gradient={false}>
    //       <span className="color33 pointer" onClick={goDetial}>{dynamicInfo?.nftName || 'unnamed'}</span>
    //       <span className="colorGreen">Transferred</span>
    //       <img src={transfer} alt="" />
    //       <span className="colorA5">from</span>
    //       <span className="color33 pointer" onClick={() => { goSomeone(dynamicInfo?.formAddress as string) }}>{AddrHandle(dynamicInfo?.formAddress)}</span>
    //       <span className="colorA5">to</span>
    //       <span className="color33 pointer" onClick={() => { goSomeone(dynamicInfo?.toAddress as string) }}>{AddrHandle(dynamicInfo?.toAddress)}</span>
    //       <span className="colorA5">for {dynamicInfo?.num} {dynamicInfo?.coinName}</span>
    //       {/* {t('transfer', {
    //         coinNum: dynamicInfo?.num, coinName: dynamicInfo?.coinName, Icon: <img src={transfer} alt="" />,
    //         formAddress: <span className="color33" onClick={() => { goSomeone(dynamicInfo?.formAddress as string) }}>{AddrHandle(dynamicInfo?.formAddress)}</span>,
    //         toAddress: <span className="color33" onClick={() => { goSomeone(dynamicInfo?.toAddress as string) }}>{AddrHandle(dynamicInfo?.toAddress)}</span>
    //       })} */}
    //       <span className="colorA5">{HowLongAgo(dynamicInfo?.createTime as number)}</span>

    //     </Marquee>
    //   </div>)
    // }
  }
  return (
    dynamicInfo ? <div className="TransactionTips">
      <div className="TipsInfo">
        <div className="headImg">
          <img src={dynamicInfo?.projectLogo || logo} onError={(e: any) => {
            // 替换的图片
            e.target.src = logo;
            // 控制不要一直触发错误
            e.onError = null;
          }} alt="" />
        </div>
        {/* <Marquee loopData={loopData} /> */}
        {TipsText()}
      </div>
      {/* <div className="dynamic flexCenter">{t('Activities')}</div> */}
    </div>
      :
      <div className="TransactionTipsLabel">

      </div>
  )
}
