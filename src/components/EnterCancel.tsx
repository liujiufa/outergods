import React from 'react'
import { Modal } from 'antd';
import {cancelOrder} from '../API'
import {Contracts} from '../web3'
import {useWeb3React} from '@web3-react/core'
import {createAddMessageAction,createSetLodingAction} from '../store/actions'
import {useSelector,useDispatch} from "react-redux";
import '../assets/style/componentStyle/EnterCancel.scss'
import closeIcon from '../assets/image/closeIconWhite.png'
import { useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next'


interface PropsType{
    isShow:boolean,
    close:Function,
    tokenId:string,
    orderId:number
}
export default function EnterCancel(props: PropsType) {
    const web3React = useWeb3React()
    const navigate = useNavigate();
    const dispatch = useDispatch();
  let { t } = useTranslation();

    function closeOrder(){
        dispatch(createSetLodingAction(true))
        Contracts.example.Sign(web3React.account as string,"askdljalksnmzxncajkwhdiaowhdajkhsdjkahsdkjhakjwhjdkahwjkdhajkdhakjsdhjkahsdjkawhdjkahsjmcnbzmxbcjiwahjdah"+props.tokenId).then((res:string)=>{
            cancelOrder({
                id:props.orderId,
                encipheredMessage:"askdljalksnmzxncajkwhdiaowhdajkhsdjkahsdkjhakjwhjdkahwjkdhajkdhakjsdhjkahsdjkawhdjkahsjmcnbzmxbcjiwahjdah"+props.tokenId,
                encipheredData:res
            }).then(res=>{
                // console.log('取消成功')
                navigate(-1)
            })
        }).finally(()=>{
            dispatch(createSetLodingAction(false))
        })
    }
  return (
    <Modal visible={props.isShow} centered closable={false} footer={null} width={557}>
        <div className="EnterCancel">
        <div className="close" onClick={()=>{props.close()}}>
                <img src={closeIcon} alt="" />
            </div>
            <div className="title">{t('Cancel')}</div>
            <div className="cancelTipes">{t('cancellation')}</div>
            <div className="enterBtn flexCenter" onClick={closeOrder}>{t('Confirm')}</div>
        </div>
    </Modal>
  )
}
