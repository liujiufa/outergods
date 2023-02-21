import React, { useState } from 'react'
import { Menu, Dropdown } from 'antd';
import { getProjectByName } from '../API'
import { useDebounceFn } from 'ahooks'
import '../assets/style/componentStyle/ManageModal.scss'
import { Modal } from 'antd';
import { cancelOrder } from '../API'
import { Contracts } from '../web3'
import { useWeb3React } from '@web3-react/core'
import { createAddMessageAction, createSetLodingAction } from '../store/actions'
import { useSelector, useDispatch } from "react-redux";
import closeIcon from '../assets/image/closeBlack.png'
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'

interface PropsType {
  isShow: boolean,
  close: Function,
  tokenId: string,
  orderId: number
}
export default function ScreenModal(props: any) {
  const web3React = useWeb3React()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { t } = useTranslation();
  function closeOrder() {
    dispatch(createSetLodingAction(true))
    Contracts.example.Sign(web3React.account as string, "askdljalksnmzxncajkwhdiaowhdajkhsdjkahsdkjhakjwhjdkahwjkdhajkdhakjsdhjkahsdjkawhdjkahsjmcnbzmxbcjiwahjdah" + props.tokenId).then((res: string) => {
      cancelOrder({
        id: props.orderId,
        encipheredMessage: "askdljalksnmzxncajkwhdiaowhdajkhsdjkahsdkjhakjwhjdkahwjkdhajkdhakjsdhjkahsdjkawhdjkahsjmcnbzmxbcjiwahjdah" + props.tokenId,
        encipheredData: res
      }).then(res => {
        // console.log('取消成功')
        // navigate(-1)
        props.close()
        dispatch(createSetLodingAction(false))
      })
    }).catch((res: any) => {
      if (res.code === 4001) {
        dispatch(createSetLodingAction(false))
      }
    })
  }

  return (
    <Modal visible={props.isShow} destroyOnClose={true} centered closable={false} footer={null} width={566} className="ManageModal">
      <div className="confirmModalTop">
        <div className="title">{t("Cancel")}</div>
        <img src={closeIcon} alt="" onClick={() => props.close()} />
      </div>
      <div className="saleTip">{t("Confirm to cancel the sale?")}</div>

      <div className="ManageModalFooter">
        <div className="enterBtn flexCenter" onClick={closeOrder}>{t("Confirm")}</div>
      </div>
    </Modal>
  )
}
