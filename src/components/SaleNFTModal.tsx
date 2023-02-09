import React, { useState } from 'react'
import { Menu, Dropdown } from 'antd';
import { getProjectByName } from '../API'
import { useDebounceFn } from 'ahooks'
import '../assets/style/componentStyle/SaleNFTModal.scss'
import closeIcon from '../assets/image/closeBlack.png'
import NFTDemoImg from '../assets/image/4.png'
import openLeftIcon from '../assets/image/openLeftIcon.png'
import openIcon from '../assets/image/openIconWhite.png'

import ETHCoinIcon from '../assets/image/ETHCoinIcon.png'
import BTCIcon from '../assets/image/BTC.png'
import USDTIcon from '../assets/image/USDT.png'
import projectImg from '../assets/image/projectImg.png'
import feedesIcon from '../assets/image/feedesIcon.png'
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next'

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
  console.log(props.saleData, "dfdf");

  // 控制图标上下
  const [expand1, setExpand1] = useState(true);
  const [expand2, setExpand2] = useState(true);
  const [expand3, setExpand3] = useState(true);
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
  // 下拉图标旋转
  const handleDropDown = (fun: any, value: boolean) => {
    fun(!value);
  }
  function changeScreenInfo(e: React.ChangeEvent<HTMLInputElement> | string) {
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

  let [price, setPrice] = useState<string>('')
  function ChangeNum(e: React.ChangeEvent<HTMLInputElement>) {
    setPrice(e.target.value)
  }

  let typeMap = [
    {
      key: t('Fixed Price'),
      value: 0
    }
  ]
  let [typeIndex, setTypeIndex] = useState(0)
  const typeMenu = (
    <Menu onClick={() => handleDropDown(setExpand2, expand2)}>
      {
        typeMap.map((item, index) => <Menu.Item key={index} onClick={() => { setTypeIndex(index) }}>
          {item.key}
        </Menu.Item>)
      }
    </Menu>
  );
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
    <Menu onClick={() => handleDropDown(setExpand2, expand2)}>
      {
        tokenMap.map((item, index) => <Menu.Item key={index} onClick={() => { setTokenIndex(index) }} className="coinMenu">
          <div className="coinKind">
            <img src={item.icon} alt="" /> <div>{item.key}</div>
          </div>
        </Menu.Item>)
      }
    </Menu>
  );
  let dayMap = [
    {
      key: t('7 Days'),
      value: 7
    },
    {
      key: "14天",
      value: 14
    },
    {
      key: "30天",
      value: 30
    },
    {
      key: "60天",
      value: 60
    },
    {
      key: "90天",
      value: 90
    }
  ]
  let [dayIndex, setDayIndex] = useState(0)
  const dayMenu = (
    <Menu onClick={() => handleDropDown(setExpand3, expand3)}>
      {
        dayMap.map((item, index) => <Menu.Item key={index} onClick={() => { setDayIndex(index) }}>
          {item.key}
        </Menu.Item>)
      }
    </Menu>
  );

  const { run } = useDebounceFn(changeProjectSearch)
  function changeProjectSearch(e: React.ChangeEvent<HTMLInputElement>) {
    getProjectByName(e.target.value).then(res => {
      setProjectList(res.data)
      // console.log('项目名称搜索结果',res)
    })
  }

  return (
    <Modal visible={props.isShow} destroyOnClose={true} centered closable={false} footer={null} width={832} className="SaleNFTModal">
      <div className="confirmModalTop">
        <img src={openLeftIcon} className="openLeftIcon" alt="" />
        <img src={closeIcon} className="closeIcon" alt="" onClick={() => props.close()} />
      </div>
      {/* NFT基本信息 */}
      <div className="NFTInfoBox">
        <div className="NFTInfo">
          <div className="leftBox"><img src={props.saleData.image} /></div>
          <div className="rightBox">
            <div className="NFTName">{props.saleData.nftName}</div>
            <div className="projectName">{props.saleData.projectName}</div>
          </div>
        </div>
        <div className="saleKind">
          <div className="saleKindTitle">出售方式</div>
          <div className="dropDownBox">
            <div className="MarketSearchRow">
              <Dropdown overlay={typeMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand1, expand1)} >
                <div className="search">
                  <div className="searchBox">{typeMap[typeIndex].key}</div>
                  <img className={expand1 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="price">
          <div className="priceTitle">价格</div>
          <div className="dropDownBox">
            <div className="left">
              <div className="MarketSearchRow">
                <Dropdown overlay={coinType} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand2, expand2)}>
                  <div className="search">
                    <div className="searchBox"><img src={tokenMap[tokenIndex].icon} alt="" /><div className="coinName">{tokenMap[tokenIndex].key}</div></div>
                    <img className={expand2 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                  </div>
                </Dropdown>
              </div>
            </div>
            <div className="right">
              <input type="number" value={price} onChange={ChangeNum} placeholder='0.00' />
            </div>
          </div>
        </div>

        <div className="deadTime">
          <div className="deadTimeTitle">过期时间</div>
          <div className="dropDownBox">
            <div className="MarketSearchRow">
              <Dropdown overlay={dayMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand3, expand3)}>
                <div className="search">
                  <div className="searchBox">{dayMap[dayIndex].key}</div>
                  <img className={expand3 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                </div>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="fee">
          <div className="feeTitle">{t('Fees 8%')}</div>
          <img src={feedesIcon} />
        </div>
        <div className="feeTip">
          {t('Fees: 5% for platforms and 3% for creators')}
        </div>
        <div className="ManageModalFooter">
          {true ? <div className="confirmBtn flexCenter" onClick={() => { props.saleFun(price, typeMap[typeIndex].value, tokenMap[tokenIndex].value, dayMap[dayIndex].value) }}>出售</div> : <div className="confirmBtn flexCenter">出售</div>}
        </div>
      </div>

      {/* 步骤 */}
      <div className="StepBox">
        <div className="approveNFT">

        </div>
        <div className="confirmApprove">

        </div>
      </div>
      {/* <StepSaleNFTModal isShow={stepSaleNFTModal} close={() => { setStepSaleNFTModal(false) }} ></StepSaleNFTModal> */}
    </Modal>
  )
}
