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
  // 控制图标上下
  const [expand1, setExpand1] = useState(true);
  const [expand2, setExpand2] = useState(true);
  const [expand3, setExpand3] = useState(true);
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

  const coinType = (
    <Menu>
      <Menu.Item className='coinMenu'>
        <div className="coinKind">
          <img src={ETHCoinIcon} alt="" /> <div>ETH</div>
        </div>
      </Menu.Item>
      <Menu.Item className='coinMenu'>
        <div className="coinKind">
          <img src={BTCIcon} alt="" /> <div>BTC</div>
        </div>
      </Menu.Item>
      <Menu.Item className='coinMenu'>
        <div className="coinKind">
          <img src={USDTIcon} alt="" /> <div>USDT</div>
        </div>
      </Menu.Item>
    </Menu>
  );
  let [coinTypeIndex, setCoinTypeIndex] = useState(0)




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
          <div className="leftBox"><img src={NFTDemoImg} /></div>
          <div className="rightBox">
            <div className="NFTName">XxxxXx#123 (NFT名称）</div>
            <div className="projectName">项目(系列）名称</div>
          </div>
        </div>
        <div className="saleKind">
          <div className="saleKindTitle">出售方式</div>
          <div className="dropDownBox">
            <div className="MarketSearchRow">
              <Dropdown overlay={typeMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand1, expand1)} >
                <div className="search">
                  <div className="searchBox">一口价</div>
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
                    <div className="searchBox"><img src={ETHCoinIcon} alt="" /><div className="coinName"> ETH</div></div>
                    <img className={expand2 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                  </div>
                </Dropdown>
              </div>
            </div>
            <div className="right">
              <input type="number" placeholder='0.00' />
            </div>
          </div>
        </div>

        <div className="deadTime">
          <div className="deadTimeTitle">过期时间</div>
          <div className="dropDownBox">
            <div className="MarketSearchRow">
              <Dropdown overlay={dayMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand3, expand3)}>
                <div className="search">
                  <div className="searchBox">7天</div>
                  <img className={expand3 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                </div>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="fee">
          <div className="feeTitle">手续费 8%</div>
          <img src={feedesIcon} />
        </div>
        <div className="feeTip">
          费用说明：平台收取5%，创作者收取3%
        </div>


        <div className="ManageModalFooter">
          {false ? <div className="confirmBtn flexCenter">出售</div> : <div className="confirmBtn flexCenter">出售</div>}
        </div>

      </div>

      {/* 步骤 */}
      <div className="StepBox">
        <div className="approveNFT">

        </div>
        <div className="confirmApprove">

        </div>
      </div>
    </Modal>
  )
}
