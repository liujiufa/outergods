import React, { useState, useEffect } from 'react'
import { Menu, Dropdown } from 'antd';
import { getProjectByName, createOrder } from '../API'
import { useDebounceFn } from 'ahooks'
import { useWeb3React } from '@web3-react/core'
import { JudgmentNumber } from '../utils/tool'
import { useNavigate } from "react-router-dom";

import '../assets/style/componentStyle/SaleNFTModal.scss'
import '../assets/style/componentStyle/StepSaleNFTModal.scss'
import closeIcon from '../assets/image/closeBlack.png'
import failNFTIcon from '../assets/image/failNFTIcon.png'
import successNFTIcon from '../assets/image/successNFTIcon.png'
import lockedIcon from '../assets/image/lockedIcon.png'
import paddingIcon from '../assets/image/paddingIcon.png'
import openIconBlack from '../assets/image/openIconBlack.png'
import { useDispatch } from 'react-redux'
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next'
import StepSaleNFTModal from './StepSaleNFTModal'
import SaleNFTModal from './SaleNFTModal'
import { Contracts } from '../web3'
import { createAddMessageAction, createSetLodingAction } from '../store/actions'
import BigNumber from 'big.js'
BigNumber.NE = -18
BigNumber.PE = 18

interface PropsType {
  isShow: boolean,
  close: Function,
  changeScreen: Function,
}
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
  const [price, setPrice] = useState('');
  const [bidType, setBidType] = useState(0);
  const [coinName, setCoinName] = useState('');
  const [pastTime, setPastTime] = useState(0);
  const [stepState, setStepState] = useState(true);
  let [approveAddr, setApproveAddr] = useState<boolean>(false)
  const web3React = useWeb3React()
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stepSaleNFTModal, setStepSaleNFTModal] = useState(false);
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

  function saleStepFun1(price: string, bidType: number, coinName: string, pastTime: number) {
    setPrice(price)
    setBidType(bidType)
    setCoinName(coinName)
    setPastTime(pastTime)
    setStepSaleNFTModal(true)
  }
  const { run } = useDebounceFn(changeProjectSearch)
  function changeProjectSearch(e: React.ChangeEvent<HTMLInputElement>) {
    getProjectByName(e.target.value).then(res => {
      setProjectList(res.data)
      // console.log('项目名称搜索结果',res)
    })
  }
  function approveFun() {
    Contracts.example.approveMarket(web3React.account as string, props.data.tokenAddress).then((res: any) => {
      Contracts.example.getapproveMarket(web3React.account as string, props.data.tokenAddress).then((res: any) => {
        // console.log(res)
        setApproveAddr(res)
      })
    })
  }
  // 出售
  function saleStepFun2() {
    if (!price) {
      return dispatch(createAddMessageAction('请输入正确价格'))
    }
    if (new BigNumber(price).lte(0)) {
      return dispatch(createAddMessageAction(t('Please enter the price')))
    }
    if (JudgmentNumber(price)) {
      return dispatch(createAddMessageAction(t('Please enter legal precision')))
    }
    dispatch(createSetLodingAction(true))
    Contracts.example.Sign((web3React.account as string).toLowerCase(), "askdljalksnmzxncajkwhdiaowhdajkhsdjkahsdkjhakjwhjdkahwjkdhajkdhakjsdhjkahsdjkawhdjkahsjmcnbzmxbcjiwahjdah" + props.data.tokenId).then((res: string) => {
      console.log(res);
      createOrder({
        tokenId: props.data.tokenId,
        tokenAddress: props.data.tokenAddress,
        nftName: props.data.nftName,
        projectName: props.data.projectName,
        bidType: bidType,
        coinName: coinName,
        nftUserId: props.data.id,
        num: price,
        pastTime: pastTime,
        encipheredMessage: "askdljalksnmzxncajkwhdiaowhdajkhsdjkahsdkjhakjwhjdkahwjkdhajkdhakjsdhjkahsdjkawhdjkahsjmcnbzmxbcjiwahjdah" + props.data.tokenId,
        encipheredData: res
      }).then((res: any) => {
        // console.log(res,"挂单结果")
        if (res.code === 200) {
          navigate('/Market')
          dispatch(createAddMessageAction(t('Listed')))
        } else {
          navigate(-1)
          dispatch(createAddMessageAction(t('Unlisted')))
        }
      }).finally(() => {
        dispatch(createSetLodingAction(false))
      })
    })

  }

  useEffect(() => {
    if (web3React.account && props.data.tokenAddress) {
      Contracts.example.getapproveMarket(web3React.account, props.data.tokenAddress).then((res: boolean) => {
        setApproveAddr(res)
      })
    }
  }, [web3React.account])
  return (
    <>
      <SaleNFTModal isShow={props.isShow && !stepSaleNFTModal} close={() => { props.close() }} saleFun={saleStepFun1}></SaleNFTModal>
      <Modal visible={stepSaleNFTModal} destroyOnClose={true} centered closable={false} footer={null} width={790} className="StepSaleNFTModal">
        <div className="confirmModalTop">
          <img src={closeIcon} className="closeIcon" alt="" onClick={() => { setStepSaleNFTModal(false) }} />
        </div>
        <div className="goodsTitle">
          出售你的物品
        </div>
        <div className="stepBox" >
          <div className="step" onClick={(e) => { e.stopPropagation(); setStepState(!stepState) }}>
            <div className="title">1.许可NFT</div>
            <div className="coinBox">
              {approveAddr ? <img src={successNFTIcon} alt="" /> : <img src={failNFTIcon} alt="" />}
              <img src={openIconBlack} alt="" />
            </div>
          </div>
          {stepState ? <div className='approveBox'>
            <div className="approveTip">我们需要您许可市场访问您的NFT。这是一个一次性的操作。</div>
            {
              approveAddr ? <div className="approveBtn approveBtned flexCenter">
                <img src={paddingIcon} alt="" /> 等待交易
              </div> : <div className="approveBtn flexCenter" onClick={() => { approveFun() }}>
                <img src={lockedIcon} alt="" /> 许可
              </div>
            }
          </div> : <div className="lineBox"><div className='line'></div></div>}
          <div className="step" onClick={(e) => { e.stopPropagation(); setStepState(!stepState) }}>
            <div className="title">2.确认上架</div>
            <div className="coinBox">
              <img src={failNFTIcon} alt="" />
              <img src={openIconBlack} alt="" />
            </div>
          </div>
          {!stepState && <div className='approveBox'>
            <div className="approveTip">用您的出售信息完成签名请求。</div>
            {true ? <div className="approveBtn flexCenter">
              签名
            </div> : <div className="approveBtn paddingBtn flexCenter">
              <img src={paddingIcon} alt="" /> 等待交易
            </div>}
          </div>}
        </div>
      </Modal >
    </>
  )
}
