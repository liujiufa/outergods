import React, { useState, useEffect } from 'react'
import { Menu, Dropdown } from 'antd';
import { getProjectByName } from '../API'
import { useDebounceFn } from 'ahooks'
import { useSelector, useDispatch } from "react-redux";
import { createAddMessageAction, createSetLodingAction } from '../store/actions'
import { buyNftOrder } from '../API'
import { AddrHandle } from '../utils/tool'
import { useNavigate } from "react-router-dom";
import '../assets/style/componentStyle/InitAccount.scss'
import closeIcon from '../assets/image/closeBlack.png'
import initImg from '../assets/image/initImg.png'
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import { Contracts } from '../web3'
import { contractAddress } from '../config'
import BigNumber from 'big.js'
import BuySuccess from './BuySuccess'
import { Navigate } from 'react-router-dom';
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
  const web3React = useWeb3React()
  const navigate = useNavigate()
  let { t } = useTranslation();
  return (
    <>
      <Modal visible={props.isShow} destroyOnClose={true} centered closable={false} footer={null} width={741} className="initAccount">
        <div className="confirmModalTop">
          <div className="title">欢迎来到Habitat NFT</div>
          <img src={closeIcon} alt="" onClick={() => props.close()} />
        </div>
        <div className="contentBox">
          <img src={initImg} alt="" />
          <div className="tip">
            连接您的钱包并使用Habitat NFT，即表示您同意我们的 <span>服务条款</span>和<span>隐私政策</span> 。
          </div>
          <div className="btnBox">
            <div className="cancel flexCenter">取消</div>
            <div className="accrept flexCenter">接受</div>
          </div>
        </div>
      </Modal >
    </>
  )
}
