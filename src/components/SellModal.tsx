import React, { useEffect, useState } from 'react'
import { Modal, Menu, Dropdown } from 'antd';
import { useWeb3React } from '@web3-react/core'
import { createOrder } from '../API'
import { contractAddress } from '../config'
import { JudgmentNumber } from '../utils/tool'
import { Contracts } from '../web3'
import { useNavigate } from "react-router-dom";
import '../assets/style/componentStyle/SellModal.scss'
import { useSelector, useDispatch } from "react-redux";
import { createAddMessageAction, createSetLodingAction } from '../store/actions'
import { useTranslation } from 'react-i18next'

import openIcon from '../assets/image/openIconWhite.png'
import closeIcon from '../assets/image/closeIconWhite.png'
import BigNumber from 'big.js'
BigNumber.NE = -18
BigNumber.PE = 18
interface PropsType {
  data: {
    nftName: string
    projectName: string
    image: string
    id: number,
    tokenId: string
    tokenAddress: string
  }
  isShow: boolean,
  close: Function
}
export default function SellModal(props: PropsType) {
  // 控制图标上下
  const [expand10, setExpand10] = useState(true);
  const [expand11, setExpand11] = useState(true);
  const [expand12, setExpand12] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const web3React = useWeb3React()
  let [approveAddr, setApproveAddr] = useState<boolean>(false)
  let { t } = useTranslation();

  useEffect(() => {
    if (web3React.account) {
      Contracts.example.getapproveMarket(web3React.account, props.data.tokenAddress).then((res: boolean) => {
        setApproveAddr(res)
        // console.log(res,"721授权的地址")
      })
    }
  }, [web3React.account])
  let typeMap = [
    {
      key: t('Fixed Price'),
      value: 0
    }
  ]
  let [typeIndex, setTypeIndex] = useState(0)
  const typeMenu = (
    <Menu onClick={() => handleDropDown(setExpand10, expand10)}>
      {
        typeMap.map((item, index) => <Menu.Item key={index} onClick={() => { setTypeIndex(index) }}>
          {item.key}
        </Menu.Item>)
      }
    </Menu>
  );
  let tokenMap = [
    {
      key: 'DEMON',
      value: 'DEMON'
    },
    {
      key: 'BNB',
      value: 'BNB'
    }
    // {
    //   key:'USDT',
    //   value:'USDT'
    // },

  ]
  let [tokenIndex, setTokenIndex] = useState(0)
  const tokenMenu = (
    <Menu onClick={() => handleDropDown(setExpand11, expand11)}>
      {
        tokenMap.map((item, index) => <Menu.Item key={index} onClick={() => { setTokenIndex(index) }}>
          {item.key}
        </Menu.Item>)
      }
    </Menu>
  );
  let dayMap = [
    {
      key: t('1 Day'),
      value: 1
    },
    {
      key: t('3 Days'),
      value: 3
    },
    {
      key: t('7 Days'),
      value: 7
    },
    {
      key: t('1 month'),
      value: 30
    },
    {
      key: t('3 months'),
      value: 90
    },
    {
      key: t('6 months'),
      value: 180
    }
  ]
  let [dayIndex, setDayIndex] = useState(0)
  const dayMenu = (
    <Menu onClick={() => handleDropDown(setExpand12, expand12)}>
      {
        dayMap.map((item, index) => <Menu.Item key={index} onClick={() => { setDayIndex(index) }}>
          {item.key}
        </Menu.Item>)
      }
    </Menu>
  );
  // 下拉图标旋转
  const handleDropDown = (fun: any, value: boolean) => {
    fun(!value);
  }
  function SellFun() {
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
        bidType: typeMap[typeIndex].value,
        coinName: tokenMap[tokenIndex].value,
        nftUserId: props.data.id,
        num: price,
        pastTime: dayMap[dayIndex].value,
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
      // let r = res.slice(0, 66)
      // let s = '0x' + res.slice(66, 130)
      // let v = '0x' + res.slice(130, 132)
      // console.log("原始rlp编码验证：",Contracts.example.web3.eth.accounts.recover('Hello Dapp',res ))
      // console.log(res)
    })

  }
  let [price, setPrice] = useState<string>('')
  function ChangeNum(e: React.ChangeEvent<HTMLInputElement>) {
    setPrice(e.target.value)
  }
  function Sign() {
    // Contracts.example.Sign(web3React.account as string).then((res:string)=>{
    //   // let r = res.slice(0, 66)
    //   // let s = '0x' + res.slice(66, 130)
    //   // let v = '0x' + res.slice(130, 132)
    //   console.log("原始rlp编码验证：",Contracts.example.web3.eth.accounts.recover('Hello Dapp',res ))
    //   console.log(res)
    // })
  }
  /* 出售前把nft授权给交易场 */
  function approveFun() {
    console.log(props.data.tokenAddress, "授权交易场address");
    Contracts.example.approveMarket(web3React.account as string, props.data.tokenAddress).then((res: any) => {
      Contracts.example.getapproveMarket(web3React.account as string, props.data.tokenAddress).then((res: any) => {
        // console.log(res)
        setApproveAddr(res)
      })
    })
  }
  return (
    <Modal className='ModelBox' visible={props.isShow} centered closable={false} footer={null} width={557}>
      <div className="close" onClick={() => { props.close() }}>
        <img src={closeIcon} alt="" />
      </div>
      <div className="ProInfo">
        <div className="proImg">
          <img src={props.data.image} alt="" />
        </div>
        <div className="info">
          <div className="proname">{props.data.projectName}</div>
          <div className="nftname">{props.data.nftName}</div>
        </div>
      </div>
      <div className="Label">{t('Type')}</div>
      <div className="inputRow">
        <Dropdown overlay={typeMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand10, expand10)}>
          <div className="ScreenDropDown">
            {typeMap[typeIndex].key}
            <img className={expand10 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
          </div>
        </Dropdown>
      </div>
      <div className="Label">{t('Price')}</div>
      <div className="inputRow">
        <Dropdown overlay={tokenMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand11, expand11)}>
          <div className="ScreenDropDown">
            {tokenMap[tokenIndex].key}
            <img className={expand11 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
          </div>
        </Dropdown>
        <div className="put">
          <input type="number" value={price} onChange={ChangeNum} placeholder={t('Amount')} />
        </div>
      </div>
      <div className="Label">{t('Expiration time')}</div>
      <div className="inputRow">
        <Dropdown overlay={dayMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand12, expand12)}>
          <div className="ScreenDropDown">
            {dayMap[dayIndex].key}
            <img className={expand12 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
          </div>
        </Dropdown>
      </div>
      <div className="font14">{t('Fees 8%')}</div>
      <div className="font12">{t('Fees: 5% for platforms and 3% for creators')}</div>
      {
        approveAddr ? <div className="sellBtnModal flexCenter" onClick={SellFun}>{t('Sale')}</div> : <div className="sellBtnModal flexCenter" onClick={approveFun}>{t('Authorize')}</div>
      }
      {/* <div className="sellBtnModal flexCenter" onClick={Sign}>签名</div> */}
    </Modal>
  )
}
