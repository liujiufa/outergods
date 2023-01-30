import React,{useState} from 'react'
import { Modal } from 'antd';
import {updateOrderPrice} from '../API'
import {useWeb3React} from '@web3-react/core'
import { useNavigate} from "react-router-dom";
import {Contracts} from '../web3'
import {useSelector,useDispatch} from "react-redux";
import '../assets/style/componentStyle/ChangePrice.scss'
import {stateType} from '../store/reducer'
import {JudgmentNumber} from '../utils/tool'
import {createAddMessageAction,createSetLodingAction} from '../store/actions'
import { useTranslation } from 'react-i18next'

import closeIcon from '../assets/image/closeIconWhite.png'
import BigNumber from 'big.js'
BigNumber.NE = -40
BigNumber.PE = 40

interface PropsType{
    isShow:boolean,
    orderId:number
    tokenId:string
    coinName:string
    close:Function
}
export default function CastingSuccess(props: PropsType) {
  const web3React = useWeb3React()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { t } = useTranslation();

  let state = useSelector<stateType,stateType>(state => state);
    let [price,setPrice] = useState('')
    function changePrice(){
      if(new BigNumber(price).lte(0)){
        return dispatch(createAddMessageAction(t('Please enter the price')))
      }
      if(JudgmentNumber(price)){
        return dispatch(createAddMessageAction(t('Please enter legal precision')))
      }
      dispatch(createSetLodingAction(true))
      Contracts.example.Sign(web3React.account as string,"askdljalksnmzxncajkwhdiaowhdajkhsdjkahsdkjhakjwhjdkahwjkdhajkdhakjsdhjkahsdjkawhdjkahsjmcnbzmxbcjiwahjdah"+props.tokenId).then((res:string)=>{
        updateOrderPrice({
          id:props.orderId,
          price:price,
          encipheredMessage:"askdljalksnmzxncajkwhdiaowhdajkhsdjkahsdkjhakjwhjdkahwjkdhajkdhakjsdhjkahsdjkawhdjkahsjmcnbzmxbcjiwahjdah"+props.tokenId,
          encipheredData:res
        }).then(res=>{
          // console.log(res)
          navigate(-1)
          dispatch(createAddMessageAction(t('Modification succeeded')))
        }).catch(()=>{
          dispatch(createAddMessageAction(t('Modification succeeded')))
        })
      }).finally(()=>{
        dispatch(createSetLodingAction(false))
      })
      }
    function inputChange(e:React.ChangeEvent<HTMLInputElement>){
      setPrice(e.target.value)
    }
  return (
    <Modal visible={props.isShow} centered closable={false} footer={null} width={557}>
        <div className="changePriceMain">
            <div className="close" onClick={()=>{props.close()}}>
                <img src={closeIcon} alt="" />
            </div>
            <div className="Title">{t('Change Price')}{props.coinName}</div>
            <div className="PriceLabel">{t('Price')}</div>
            <div className="pricePut">
                <input type="number" onChange={inputChange}  placeholder='0.00'/>
            </div>
            {/* <div className="exchange">0 BNB≈$ 0</div> */}
            <div className="Service">{t('Fees 8%')}</div>
            <div className="ServiceExplain">{t('Fees: 5% for platforms and 3% for creators')}</div>
            <div className="update flexCenter" onClick={changePrice}>{t('Update')}</div>
        </div>
    </Modal>
  )
}
