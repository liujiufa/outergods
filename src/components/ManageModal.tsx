import React, { useState } from 'react'
import { Menu, Dropdown } from 'antd';
import { getProjectByName } from '../API'
import { useDebounceFn } from 'ahooks'
import '../assets/style/componentStyle/ManageModal.scss'
import closeIcon from '../assets/image/closeBlack.png'
import openIcon from '../assets/image/openIconWhite.png'
import ETHCoinIcon from '../assets/image/ETHCoinIcon.png'
import BTCIcon from '../assets/image/BTC.png'
import USDTIcon from '../assets/image/USDT.png'
import projectImg from '../assets/image/projectImg.png'
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next'
import { createAddMessageAction, createSetLodingAction } from '../store/actions'
import { useSelector, useDispatch } from "react-redux";
import { updateOrderPrice } from '../API'
import { useWeb3React } from '@web3-react/core'
import { useNavigate } from "react-router-dom";
import { stateType } from '../store/reducer'
import { JudgmentNumber } from '../utils/tool'
import { Contracts } from '../web3'
import BigNumber from 'big.js'
BigNumber.NE = -40
BigNumber.PE = 40
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
  console.log(props);

  // 控制图标上下
  const [expand1, setExpand1] = useState(true);
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


  const web3React = useWeb3React()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { t } = useTranslation();

  let state = useSelector<stateType, stateType>(state => state);
  let [price, setPrice] = useState('')
  function changePrice() {
    if (new BigNumber(price).lte(0)) {
      return dispatch(createAddMessageAction(t('Please enter the price')))
    }
    if (JudgmentNumber(price)) {
      return dispatch(createAddMessageAction(t('Please enter legal precision')))
    }
    dispatch(createSetLodingAction(true))
    Contracts.example.Sign(web3React.account as string, "askdljalksnmzxncajkwhdiaowhdajkhsdjkahsdkjhakjwhjdkahwjkdhajkdhakjsdhjkahsdjkawhdjkahsjmcnbzmxbcjiwahjdah" + props.tokenId).then((res: string) => {
      updateOrderPrice({
        id: props.orderId,
        price: price,
        encipheredMessage: "askdljalksnmzxncajkwhdiaowhdajkhsdjkahsdkjhakjwhjdkahwjkdhajkdhakjsdhjkahsdjkawhdjkahsjmcnbzmxbcjiwahjdah" + props.tokenId,
        encipheredData: res
      }).then(res => {
        // console.log(res)
        navigate(-1)
        dispatch(createAddMessageAction(t('Modification succeeded')))
      }).catch(() => {
        dispatch(createAddMessageAction(t('Modification succeeded')))
      })
    }).finally(() => {
      dispatch(createSetLodingAction(false))
    })
  }
  function inputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPrice(e.target.value)
  }

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

  let tokenMap = [
    {
      key: 'USDT',
      icon: USDTIcon,
      value: 'USDT'
    },
    // {
    //   key: 'ETH',
    //   icon: ETHCoinIcon,
    //   value: 'ETH'
    // },
    // {
    //   key: 'BTC',
    //   icon: BTCIcon,
    //   value: 'BTC'
    // }
  ]
  let [tokenIndex, setTokenIndex] = useState(0)
  const coinType = (
    <Menu onClick={() => handleDropDown(setExpand1, expand1)}>
      {
        tokenMap.map((item, index) => <Menu.Item key={index} onClick={() => { setTokenIndex(index) }} className="coinMenu">
          <div className="coinKind">
            <img src={item.icon} alt="" /> <div>{item.key}</div>
          </div>
        </Menu.Item>)
      }
    </Menu>
  );

  return (
    <Modal visible={props.isShow} destroyOnClose={true} centered closable={false} footer={null} width={566} className="ManageModal">
      <div className="confirmModalTop">
        <div className="title">调整价格</div>
        <img src={closeIcon} alt="" onClick={() => props.close()} />
      </div>
      <div className="middleBox">
        <div className="priceTitle">价格</div>
        <div className="dropDownBox">
          <div className="left">
            <div className="MarketSearchRow">
              <Dropdown overlay={coinType} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand1, expand1)}>
                <div className="search">
                  <div className="searchBox"><img src={tokenMap[tokenIndex].icon} alt="" /><div className="coinName">{tokenMap[tokenIndex].key}</div></div>
                  <img className={expand1 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                </div>
              </Dropdown>
            </div>
          </div>
          <div className="right">
            <input type="number" onChange={inputChange} placeholder='0.00' />
          </div>
        </div>
      </div>
      <div className="Service">{t('Fees 8%')}</div>
      <div className="bottomTip">{t('Fees: 5% for platforms and 3% for creators')}</div>
      <div className="ManageModalFooter">
        <div className="enterBtn flexCenter" onClick={changePrice}>更新</div>
      </div>
    </Modal>
  )
}
