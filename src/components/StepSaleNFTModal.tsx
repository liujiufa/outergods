import React, { useState, useEffect } from 'react'
import { Menu, Dropdown } from 'antd';
import { getProjectByName } from '../API'
import { useDebounceFn } from 'ahooks'
import '../assets/style/componentStyle/StepSaleNFTModal.scss'
import closeIcon from '../assets/image/closeBlack.png'
import NFTDemoImg from '../assets/image/4.png'
import openLeftIcon from '../assets/image/openLeftIcon.png'
import openIcon from '../assets/image/openIconWhite.png'
import openIconBlack from '../assets/image/openIconBlack.png'

import ETHCoinIcon from '../assets/image/ETHCoinIcon.png'
import BTCIcon from '../assets/image/BTC.png'
import USDTIcon from '../assets/image/USDT.png'
import projectImg from '../assets/image/projectImg.png'
import feedesIcon from '../assets/image/feedesIcon.png'
import failNFTIcon from '../assets/image/failNFTIcon.png'
import successNFTIcon from '../assets/image/successNFTIcon.png'
import lockedIcon from '../assets/image/lockedIcon.png'
import paddingIcon from '../assets/image/paddingIcon.png'
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { Contracts } from '../web3'

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
  const [stepState, setStepState] = useState(true);
  let [approveAddr, setApproveAddr] = useState<boolean>(false)
  let [ProjectList, setProjectList] = useState<ProjectType[]>([])
  const web3React = useWeb3React()

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
  const { run } = useDebounceFn(changeProjectSearch)
  function changeProjectSearch(e: React.ChangeEvent<HTMLInputElement>) {
    getProjectByName(e.target.value).then(res => {
      setProjectList(res.data)
      // console.log('项目名称搜索结果',res)
    })
  }

  useEffect(() => {
    if (props.data.tokenId && web3React.account) {
      Contracts.example.getapproveMarket(web3React.account, props.data.tokenAddress).then((res: boolean) => {
        setApproveAddr(res)
      })
    }
  }, [props.data.tokenId, web3React.account])

  return (
    <Modal visible={props.isShow} destroyOnClose={true} centered closable={false} footer={null} width={790} className="StepSaleNFTModal">
      <div className="confirmModalTop">
        <img src={closeIcon} className="closeIcon" alt="" onClick={() => props.close()} />
      </div>
      <div className="goodsTitle">
        出售你的物品
      </div>
      <div className="stepBox" onClick={() => { setStepState(!stepState) }}>
        <div className="step">
          <div className="title">1.许可NFT</div>
          <div className="coinBox">
            <img src={successNFTIcon} alt="" />
            <img src={openIconBlack} alt="" />
          </div>
        </div>
        {stepState ? <div className='approveBox'>
          <div className="approveTip">我们需要您许可市场访问您的NFT。这是一个一次性的操作。</div>
          {
            approveAddr ? <div className="approveBtn flexCenter" onClick={() => { }}>
              <img src={lockedIcon} alt="" /> 许可
            </div> : <div className="approveBtn flexCenter" onClick={() => { }}>
              <img src={lockedIcon} alt="" /> 许可
            </div>
          }
        </div> : <div className="lineBox"><div className='line'></div></div>}
        <div className="step">
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
  )
}
