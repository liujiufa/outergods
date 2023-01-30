import React, { useEffect, useState } from 'react'
import TransactionTips from '../components/TransactionTips'
import ScreenModal from '../components/ScreenModal'
import { getNftProjectDetail, getOrderType, getOrderByProject, getTradeOrderState, getTradeOrder } from '../API'
import { useSearchParams , useNavigate} from "react-router-dom";
import {createAddMessageAction} from '../store/actions'
import { Menu, Dropdown } from 'antd';
import { HowLongAgo } from '../utils/tool'
import { stateType } from '../store/reducer'
import { useSelector, useDispatch } from "react-redux";
import Goods, { NftInfo } from '../components/HotspotCard'
import { Table, Tag, Space,ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next'
import NoData from '../components/NoData'

import '../assets/style/Launch.scss'
import '../assets/style/Project.scss'
import ProjectBanner from '../assets/image/LaunchBanner.png'
import LaunchLogo from '../assets/image/LaunchLogo.png'
import authentication from '../assets/image/authentication.png'
import NotCertified from '../assets/image/NotCertified.png'
import ProjectContact1 from '../assets/image/ProjectName1.png'
import ProjectContact2 from '../assets/image/ProjectName2.png'
import ProjectContact3 from '../assets/image/ProjectName3.png'
import ProjectContact4 from '../assets/image/ProjectName4.png'
import ProjectContact5 from '../assets/image/ProjectName5.png'
import ProjectContact6 from '../assets/image/ProjectName6.png'
import ProjectContact7 from '../assets/image/ProjectName7.png'
import TableGoodsImg from '../assets/image/TableGoodsImg.png'
import openIcon from '../assets/image/openIconWhite.png'
import filter from '../assets/image/filter.png'
const { Column } = Table;
interface ProjectDetailType {
  playerNum: number
  rackingNum: number
  name: 'string',
  img: string
  backImgUrl: string
  twitterUrl?:string
  telegraphGroupUrl?:string
  webUrl?:string
  floorPrice: number
  tradeNum: number
  tradeAmount: number
  description: string
  isAuthentication: number | null
}
export default function Project(): JSX.Element {
   // 控制图标上下
const [expand20, setExpand20] = useState(true); 
  let { t } = useTranslation()
  const dispatch = useDispatch();
  let state = useSelector<stateType, stateType>(state => state);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  let [showScreenModal, setShowScreenModal] = useState<boolean>(false)
  let [Tabs, setTabs] = useState<boolean>(true)
  let [ProjectDetail, setProjectDetail] = useState<ProjectDetailType | null>(null)
  let [ProjectOrder, setProjectOrder] = useState<NftInfo[]>([])
  let [tableData, setTableData] = useState([])
  let projectName = params.get('projectName')
  useEffect(() => {
    if (state.token && projectName) {
      getNftProjectDetail(projectName).then(res => {
        // console.log(res,"项目详情")
        setProjectDetail(res.data)
        getTradeOrder({
          bidType: -1,
          type: -1,
          projectName: res.data.name,
          minPrice: 0,
          maxPrice: 0,
          sortType: sortMap[sortIndex].value,
          currentPage: 1,
          pageSize: 10
        }).then(res => {
          setProjectOrder(res.data)
          // console.log(res, "交易场数据")
        })
        getTradeOrderState(res.data.name).then(res => {
          setTableData(res.data)
          // console.log(res, "项目NFT动态")
        })
      })
    }
  }, [state.token, projectName])
  // 下拉图标旋转
  const handleDropDown=(fun:any,value:boolean)=>{
    fun(!value);
  }
  /* 修改筛选条件 */
  function changeScreen(ScreenData: getOrderType) {
    // console.log(ScreenData)
    getTradeOrder(ScreenData).then(res => {
      setProjectOrder(res.data)
      // console.log(res, "搜索后的交易场数据")
    })
  }
  let sortMap = [
    {
      key: t('Newest'),
      value: 1
    },
    {
      key: t('Price: High to Low'),
      value: 2
    },
    {
      key: t('Price: Low to High'),
      value: 3
    }
  ]
  let [sortIndex, setSortIndex] = useState(0)
  const sortMenu = (
    <Menu onClick={()=>handleDropDown(setExpand20,expand20)}>
      {
        sortMap.map((item, index) => <Menu.Item key={index} onClick={() => { setSortIndex(index) }}>
          {item.key}
        </Menu.Item>)
      }
    </Menu>
  );
  function goDetial(orderId:number){
    navigate('/Goods?orderId='+orderId)
  }
  function goSomeone(address:string){
    if(address){
      navigate('/Someone?address='+address)
    }
  }
  function goProject(projectName:string,isAuthentication:number | null){
    if(!isAuthentication){
      dispatch(createAddMessageAction(t('Not certified')))
    }
    if(projectName && isAuthentication){
      navigate('/project?projectName='+ projectName)
    }
  }
  return (
    <div className="Launch">
      <div className="banner">
        <img src={ProjectDetail?.backImgUrl} alt="" />
        <div className="LaunchLogo">
          <img src={ProjectDetail?.img} alt="" />
        </div>
      </div>
      <div className="projectNameLaunch">
        {ProjectDetail?.name}
        {
          ProjectDetail?.isAuthentication ? <img src={authentication} alt="" /> : <img src={NotCertified} alt="" />
        }

      </div>
      <div className="Contact">
        {/* <img src={ProjectContact1} alt="" /> */}
        {
                    ProjectDetail?.webUrl && <a href={ProjectDetail.webUrl} target="_blank" rel="noreferrer">
                        <img src={ProjectContact7} alt="" />
                    </a>
                }
                {
                    ProjectDetail?.twitterUrl && <a href={ProjectDetail.twitterUrl} target="_blank" rel="noreferrer">
                        <img src={ProjectContact2} alt="" />
                    </a>
                }
                
                {/* <img src={ProjectContact3} alt="" /> */}
                {/* <img src={ProjectContact4} alt="" /> */}
                {/* <img src={ProjectContact5} alt="" /> */}
                {
                    ProjectDetail?.telegraphGroupUrl && <a href={ProjectDetail.telegraphGroupUrl} target="_blank" rel="noreferrer">
                        <img src={ProjectContact6} alt="" />
                    </a>
                }
      </div>
      <div className="LaunchInfo">
        <div className="column">
          <div className="label">{t('Traded')}</div>
          <div className="value">{ProjectDetail?.tradeNum}</div>
        </div>
        <div className="column">
          <div className="label">{t('Players')}</div>
          <div className="value">{ProjectDetail?.playerNum}</div>
        </div>
        <div className="column">
          <div className="label">{t('Listed')}</div>
          <div className="value">{ProjectDetail?.rackingNum}</div>
        </div>
        <div className="column">
          <div className="label">{t('VOL.(BNB)')}</div>
          <div className="value">{ProjectDetail?.tradeAmount}</div>
        </div>
        <div className="column">
          <div className="label">{t('Floor(BNB)')}</div>
          <div className="value">{ProjectDetail?.floorPrice}</div>
        </div>
      </div>
      {/* 说明 */}
      <div className="explain">
      {t('Project Description')}：{ProjectDetail?.description}
      </div>
      <TransactionTips></TransactionTips>
      <div className="searchRow">
        <div className="tab">
          <div className={Tabs ? "item activeItem flexCenter" : "item flexCenter"} onClick={() => { setTabs(true) }}>{t('Items')}</div>
          <div className={Tabs ? "item flexCenter" : "item activeItem flexCenter"} onClick={() => { setTabs(false) }}>{t('Activities')}</div>
        </div>
        <div className="searchedge">
          <div className="leftBox Box">
            <Dropdown overlay={sortMenu} trigger={['click']} onVisibleChange={()=>handleDropDown(setExpand20,expand20)}>
              <div className="search">
                <div className="searchBox">{sortMap[sortIndex].key}</div>
                <img  className={expand20?'rotetaOpen':'rotetaClose'} src={openIcon} alt="" />
              </div>
            </Dropdown>
          </div>
          <div className="rightBox Box">
            <div className="filter" onClick={() => { setShowScreenModal(true) }}>
              <img src={filter} alt="" />
              {t('Filter')}
            </div>
          </div>
        </div>
      </div>
      {Tabs && <div className="goodsList">
        {
          ProjectOrder.map((item, index) => <Goods key={index} NftInfo={item} goPath={()=>{goDetial(item.orderId as number)}}></Goods>)
        }
      </div>}
      {/* 表格 start*/}
      {
        !Tabs && <div className="TableBox">
                <ConfigProvider renderEmpty={()=><NoData/>}>
          <Table dataSource={tableData} pagination={false} rowKey="id" scroll={{ x: 'max-content' }}>
            <Column
              title={t('Type')}
              render={item => (
                <>
                  <div className="typeMain">{t('Listing')}</div>
                  <div className="typeSub">{t('as fixed price')}</div>
                </>
              )}
            />
            <Column
              align="center"
              title={t('Items')}
              render={item => (
                <>
                  <div className="goodInfo">
                    <img src={TableGoodsImg} alt="" />
                    <div>
                      <div className="protName pointer" onClick={()=>{goProject(item.projectName,item.isAuthentication)}}>{item.projectName} 
                      {item.isAuthentication === 1 ? <img src={authentication} alt="" /> : <img src={NotCertified} alt="" />}
                      </div>
                      <div className="nft">{item.nftName}</div>
                    </div>
                  </div>
                </>
              )}
            />
            <Column
              align="center"
              title={t('Price')}
              render={item => (
                <>
                  <div className="goodPrice">
                    <div className="Uprice">{item.uorderPrice}</div>
                    <div className="bnbprice">{item.num} {item.coinName}</div>
                  </div>
                </>
              )}
            />
            <Column
              align="center"
              title={t('From')}
              render={item => (
                <div className="color33 pointer" onClick={()=>{goSomeone(item.formAddress)}}>
                  {item.formAddress}
                </div>
              )}
            />
            <Column
              align="center"
              title={t('To')}
              render={item => (
                <div className="color33 pointer" onClick={()=>{goSomeone(item.toAddress)}}>
                  {item.toAddress ? item.toAddress : "-"}
                </div>
              )}
            />
            <Column
              align="right"
              title={t('Time')}
              render={item => (
                <div className="color33">
                  {HowLongAgo(item.createTime)}
                </div>
              )}
            />
          </Table>
          </ConfigProvider>
        </div>
      }

      {/* 表格 end*/}
      <ScreenModal isShow={showScreenModal} close={() => { setShowScreenModal(false) }} changeScreen={changeScreen} ></ScreenModal>
    </div>
  )
}
