import React from 'react'
import { Modal } from 'antd';
import { useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next'

import '../assets/style/componentStyle/CastingSuccess.scss'
import closeIcon from '../assets/image/closeIconWhite.png'

interface PropsType{
    isShow:boolean,
    image:string
    close:Function
}
export default function CastingSuccess(props: PropsType) {
    const navigate = useNavigate();
  let { t } = useTranslation();

  return (
    <Modal visible={props.isShow} centered closable={false} onCancel={()=>{props.close()}} footer={null} width={557}>
        <div className="close" onClick={()=>{props.close()}}>
          <img src={closeIcon} alt="" />
        </div>
        <div className="ModalTop">{t('Congratulations, the Minting is successful！')}</div>
        <div className="CastingImg flexCenter">
            <img src={props.image} alt="" />
        </div>
        <div className="sse">{t('Please check in Profile')}</div>
        <div className="Enter flexCenter" onClick={()=>{navigate('/Personal')}}>{t('Confirm')}</div>
    </Modal>
  )
}
