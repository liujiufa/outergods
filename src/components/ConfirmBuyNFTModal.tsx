import React, { useState, useEffect } from 'react'
import { Menu, Dropdown } from 'antd';
import { getProjectByName } from '../API'
import { useDebounceFn } from 'ahooks'
import { useSelector, useDispatch } from "react-redux";
import { createAddMessageAction, createSetLodingAction } from '../store/actions'
import { buyNftOrder } from '../API'
import { AddrHandle } from '../utils/tool'
import '../assets/style/componentStyle/ManageModal.scss'
import closeIcon from '../assets/image/closeBlack.png'
import openIcon from '../assets/image/openIconWhite.png'
import feedesIcon from '../assets/image/feedesIcon.png'
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { Contracts } from '../web3'
import { contractAddress } from '../config'
import defaultCard from '../assets/image/defaultCard.png'
import BigNumber from 'big.js'
import BuySuccess from '../components/BuySuccess'
BigNumber.NE = -40
BigNumber.PE = 40
export interface ScreenDataType {
  bidType: number,
  type: number,
  projectName: string,
  minPrice: number,
  maxPrice: number,
  sortType: number,
  currentPage: number,
  pageSize: number
}
interface ProjectType {
  name: string,
  img: string
}
export default function ScreenModal(props: any) {
  console.log(props.NFTInfo, "NFT详情购买");
  const web3React = useWeb3React()
  const dispatch = useDispatch();
  let [showBuySuccess, setShowBuySuccess] = useState<boolean>(false)
  let [approveNum, setApproveNum] = useState<string>('0')
  let [ProjectList, setProjectList] = useState<ProjectType[]>([])
  let [ScreenInfo, setScreenInfo] = useState({
    min: 0,
    max: 0,
    projectName: '',
    bidType: 0,
    type: 0,
    minPrice: 0,
    maxPrice: 0,
    sortType: 0,
    currentPage: 1,
    pageSize: 10
  })
  let { t } = useTranslation();
  // 下拉图标旋转
  const handleDropDown = (fun: any, value: boolean) => {
    fun(!value);
  }
  function changeScreenInfo(e: React.ChangeEvent<HTMLInputElement> | string) {
    // console.log(e)
    if (typeof e === 'string') {
      setScreenInfo({
        ...ScreenInfo,
        projectName: e
      })
    } else {
      let name = e.target.getAttribute('name')
      setScreenInfo({
        ...ScreenInfo,
        [name as string]: e.target.value
      })
    }
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
  let IsSuitMap = [
    {
      key: t('All'),
      value: 0
    },
    {
      key: t('Bundle'),
      value: 1
    },
    {
      key: t('Single Item'),
      value: 2
    }
  ]
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

  let goodTypeMap = [
    {
      key: t('All'),
      value: -1
    },
    {
      key: 'NFT',
      value: 2
    },
    {
      key: t('Blind Box'),
      value: 1
    }
  ]
  const { run } = useDebounceFn(changeProjectSearch)
  function changeProjectSearch(e: React.ChangeEvent<HTMLInputElement>) {

    getProjectByName(e.target.value).then(res => {
      setProjectList(res.data)
      // console.log('项目名称搜索结果',res)
    })
  }

  async function buyOrder() {
    console.log("_______deede________");
    if (props.NFTInfo) {
      let Balance
      if (props.NFTInfo.coinName !== 'BNB') {
        /* 判断授权 */
        if (new BigNumber(approveNum).lt(props.NFTInfo.priceString as string)) {
          return dispatch(createAddMessageAction(t('Please authorize')))
        }
        Balance = await Contracts.example.TOKENbalanceOf(web3React.account as string, props.NFTInfo?.payTokenAddress as string)
        Balance = new BigNumber(Balance).div(10 ** 18).toString()
      }
      if (props.NFTInfo.coinName === 'BNB') {
        Balance = await Contracts.example.getBalance(web3React.account as string)
        Balance = new BigNumber(Balance).div(10 ** 18).toString()
      }
      // console.log(Balance,"余额")
      //判断余额不足
      if (new BigNumber(Balance as string).lt(props.NFTInfo.priceString as string)) {
        return dispatch(createAddMessageAction(t('Not enough balance')))
      }
      dispatch(createSetLodingAction(true))
      buyNftOrder(props.NFTInfo.orderId as number).then(res => {
        console.log(res, "购买加密信息")
        if (props.NFTInfo) {
          let price = props.NFTInfo.coinName === 'BNB' ? props.NFTInfo.priceString : 0
          Contracts.example.makeOrder(web3React.account as string, res.data, price as string).then(() => {
            props.close()
            setShowBuySuccess(true)
            // return dispatch(createAddMessageAction(t('Purchase successful')))
          }).finally(() => {
            dispatch(createSetLodingAction(false))
          })
        }
      }, () => {
        dispatch(createSetLodingAction(false))
      })
    }
  }

  function isApprove() {
    if (props.NFTInfo) {
      return new BigNumber(approveNum).gte(props.NFTInfo.priceString as string) || props.NFTInfo.coinName === 'BNB'
    } else {
      return false
    }
  }
  function approve() {
    if (web3React.account) {
      console.log(props.NFTInfo?.payTokenAddress);
      Contracts.example.TOKENapprove(web3React.account as string, contractAddress.Market, props.NFTInfo?.payTokenAddress as string).then((res: any) => {
        Contracts.example.TOKENallowance(web3React.account as string, contractAddress.Market, props.NFTInfo?.payTokenAddress as string).then((res: string) => {
          setApproveNum(new BigNumber(res).div(10 ** 18).toString())
        })
      })
    }
  }

  /* 获取授权额度 */
  useEffect(() => {
    console.log(props.NFTInfo, '-------');
    if (web3React.account && props.NFTInfo?.payTokenAddress) {
      if (props.NFTInfo?.coinName !== "BNB") {
        Contracts.example.TOKENallowance(web3React.account, contractAddress.Market, props?.NFTInfo?.payTokenAddress as string).then((res: string) => {
          setApproveNum(new BigNumber(res).div(10 ** 18).toString())
        })
      }
    }
  }, [web3React.account, props.isShow, approveNum])

  return (
    <>
      <Modal visible={props.isShow} destroyOnClose={true} centered closable={false} footer={null} width={670} className="ManageModal">
        <div className="confirmModalTop">
          <div className="title">确认购买</div>
          <img src={closeIcon} alt="" onClick={() => props.close()} />
        </div>
        <div className="NFTInfo">
          <div className="NFTLeft"><img src={props?.NFTInfo?.metadata?.image || props?.NFTDetail?.normalizedMetadata?.image || defaultCard} alt="" /></div>
          <div className="NFTRight">
            <div className="NFTTitle">{props?.NFTInfo?.metadata?.name}</div>
            <div className="projectTitle">{props?.NFTInfo?.projectName}</div>
          </div>
        </div>
        <div className="address item">
          <div className="title">合约地址</div>
          <div className="value">{AddrHandle(props?.NFTInfo?.tokenAddress)}</div>
        </div>
        <div className="coinID item">
          <div className="title">代币ID</div>
          <div className="value">{props?.NFTInfo?.tokenId}</div>
        </div>
        <div className="clain item">
          <div className="title">链</div>
          <div className="value">BSC</div>
        </div>
        <div className="reward item">
          <div className="title">创作者收益<img src={feedesIcon} alt="" /></div>
          <div className="value">10%</div>
        </div>

        <div className="ManageModalFooter">
          {isApprove() ? <div className="enterBtn flexCenter" onClick={buyOrder}>{t('Buy')}</div> : <div className="enterBtn flexCenter" onClick={() => { approve() }}>{t('Authorize')}</div>}
        </div>
      </Modal >
      {props.NFTInfo && <BuySuccess data={{
        address: props?.NFTInfo?.tokenAddress,
        projectName: props?.NFTInfo?.projectName,
        tokenID: props?.NFTInfo?.tokenId
      }} isShow={showBuySuccess} close={() => { setShowBuySuccess(false) }}></BuySuccess>}
    </>
  )
}
