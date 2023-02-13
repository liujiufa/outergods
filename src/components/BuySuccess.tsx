import React from 'react'
import { Modal } from 'antd';
import { AddrHandle } from '../utils/tool'
import '../assets/style/componentStyle/BuySuccess.scss'
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import closeIcon from '../assets/image/closeBlack.png'

interface PropsType {
  isShow: boolean,
  close: Function,
  data: {
    address: string
    projectName: string
    tokenID: string
  }
}
export default function BuySuccess(props: PropsType) {
  console.log(props, "NFT成功");

  const navigate = useNavigate();
  let { t } = useTranslation();

  return (
    <Modal visible={props.isShow} centered closable={false} onCancel={() => { props.close() }} footer={null} width={557} className="SaleNFTModal">
      <div className="ModalHead">
        <div className="title">{t('Congratulations')}</div>
        <div className="subtitle">{t('You successfully purchased the NFT')}</div>
      </div>
      <div className="close" onClick={() => { props.close() }}>
        <img src={closeIcon} alt="" />
      </div>
      <div className="buyInfo">
        <div className="InfoRow">
          <div className="infoItem">
            <div className="label">{t('State')}</div>
            <div className="infoValue">{t('Complete')}</div>
          </div>
          <div className="infoItem">
            <div className="label">卖方地址</div>
            <div className="infoValue">{AddrHandle(props.data.address)}</div>
          </div>
        </div>
        <div className="division"></div>
        <div className="InfoRow">
          <div className="infoItem">
            <div className="label">NFT 合集</div>
            <div className="infoValue">{props.data.projectName}</div>
          </div>
          <div className="infoItem">
            <div className="label">{t('TOKEN ID')}</div>
            <div className="infoValue">{props.data.tokenID.length >= 8 ? AddrHandle(props.data.tokenID, 4, 4) : props.data.tokenID}</div>
          </div>
        </div>
      </div>
      <div className="EnterBtn flexCenter" onClick={() => { navigate('/Personal') }}>{t('Complete')}</div>
    </Modal>
  )
}
