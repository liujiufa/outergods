
import React,{useEffect,useState} from 'react'
import {syncUserNftData} from '../API'
import GoodsCard,{NftInfo} from '../components/HotspotCard'
import EnterCancel from '../components/EnterCancel'
import FullScreen from '../components/FullScreen'
import ChangePrice from '../components/ChangePrice'
import BuySuccess from '../components/BuySuccess';
import {getOrderDetail , getNftOrderState , getUserOrder ,getOrderByProject ,getNftUserInfoDetail , updateOrderPrice , cancelOrder,buyNftOrder} from '../API'
import {useWeb3React} from '@web3-react/core'
import {createAddMessageAction,createSetLodingAction} from '../store/actions'
import { Menu, Dropdown } from 'antd';
import {stateType} from '../store/reducer'
import { HowLongAgo,NumSplic,AddrHandle} from '../utils/tool'
import {useSelector,useDispatch} from "react-redux";
import {useSearchParams , useNavigate} from "react-router-dom";
import {Contracts} from '../web3'
import { Table,ConfigProvider } from 'antd';
import NoData from '../components/NoData'

import {contractAddress} from '../config'
import { useTranslation } from 'react-i18next'

import copy from 'copy-to-clipboard'; 
import GoodsDetials from '../assets/image/GoodsDetials.png'
import authentication from '../assets/image/authentication.png'
import NotCertified from '../assets/image/NotCertified.png'
import Collection from '../assets/image/Collection.png'
import see from '../assets/image/see.png'
import Refresh from '../assets/image/refreshWhite.png'
import share from '../assets/image/shareWhite.png'
import set from '../assets/image/setWhite.png'
import thumbtack from '../assets/image/thumbtack.png'
import openIcon from '../assets/image/openIconWhite.png'
import TableGoodsImg from '../assets/image/TableGoodsImg.png'
import share2 from '../assets/image/shareWhite2.png'
import defaultCard from '../assets/image/defaultCard.png'
import chainIcon from '../assets/image/chainIcon.png'
import Logo from '../assets/image/NFTLogo.png'
import minCopyIcon from '../assets/image/copyIconWhite.png'
import '../assets/style/GoodsDetial.scss'
import BigNumber from 'big.js'
BigNumber.NE = -40
BigNumber.PE = 40
  const { Column } = Table;

interface OrderDetailType{
  nnftUser:{
    projectName:string,
    nftName:string
    image:string
    description:string
    tokenAddress:string
    tokenId:string
    isAuthentication:number | null
    metadata: {
      [key: string]: string;
    }
  },
  browseNum?:number
  giveNum?:number
  id?:number,
  projectDesc?:string,
  price?:number,
  priceString?:string,
  userAddress?:string
  payTokenAddress?:string
  isAuthentication:number | null
  uorderPrice?:number
  coinName?:string
}
// let operateTtype =[
//   '挂单',
//   '出售',
//   '取消订单',
//   '转出',
//   '改价格',
// ]
export default function Goods(): JSX.Element {
   // 控制图标上下
const [expand13, setExpand13] = useState(true); 
  const web3React = useWeb3React()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { t } = useTranslation()

    let state = useSelector<stateType,stateType>(state => state);
  const [params] = useSearchParams();
  let [OrderDetail,setOrderDetail] = useState<OrderDetailType |null>(null)
  let [attrOrInfo,setAttrOrInfo] = useState<boolean>(true)
  let [showPriceChange,setShowPriceChange] = useState<boolean>(false)
  let [showEnterCancel,setShowEnterCancel] = useState<boolean>(false)
  let [showBuySuccess,setShowBuySuccess] = useState<boolean>(false)
  let [showFullScreen,setShowFullScreen] = useState<boolean>(false)
  let [tableData, setTableData] = useState([])
  /* 卖家的其他商品 */
  let [UserOrder, setUserOrder] = useState<NftInfo []>([])
  let [DynamicState,setDynamicState] = useState(0)
  let [approveNum,setApproveNum] = useState<string>('0')
  let [tokenId, setTokenId] = useState('')
  let [projectId, setProjectId] = useState('')
  let [ProjectOrder, setProjectOrder] = useState([])
  let operateTtype =[
    t('Listing'),
    t('Sale'),
    t('Cancel an order'),
    t('Send'),
    t('change price'),
  ]
  // let type = params.get('type')
  let orderId = params.get('orderId')
  /* 获取交易场详情信息 */
  useEffect(()=>{
    if(orderId && orderId !== 'null' && state.token){
      getOrderDetail(params.get('orderId') as string).then(res=>{
        setTokenId(res.data.nnftUser.tokenId)
        setProjectId(res.data.projectId)
        console.log(res.data,"订单详情")
        if(res.data.nnftUser.metadata){
          res.data.nnftUser.metadata = JSON.parse(res.data.nnftUser.metadata)
          let obj:{[key: string]: string;}={}
          Object.keys(res.data.nnftUser.metadata).filter((item)=>item!=='image').map((item)=>{
            if(typeof res.data.nnftUser.metadata[item] === 'string'){
              obj[item] =res.data.nnftUser.metadata[item]
            }
          })
          res.data.nnftUser.metadata = obj
        }
        setOrderDetail(res.data)
        if(state.token){
          getUserOrder(res.data.userAddress).then(res=>{
            setUserOrder(res.data)
            // console.log(res,"获取卖家其他商品")
          })
        }
      })
    }
  },[orderId,state.token])
  /* 获取动态 */
  useEffect(()=>{
    if(tokenId && OrderDetail){
      getNftOrderState(tokenId,DynamicStateMap[DynamicState].value,OrderDetail.nnftUser.tokenAddress).then(res=>{
        setTableData(res.data)
        // console.log(res.data,"动态")
      })
    }
  },[tokenId,OrderDetail,DynamicState])
  /* 获取相关商品 */
  useEffect(()=>{
    if(projectId && state.token){
      getOrderByProject(projectId).then(res=>{
        // console.log(res,"系列商品")
        setProjectOrder(res.data)
      })
    }
  },[projectId,state.token])
  // /* 获取授权额度 */
  useEffect(()=>{
    if(web3React.account && OrderDetail?.payTokenAddress){
      if(OrderDetail?.coinName !=="BNB"){
        Contracts.example.TOKENallowance(web3React.account,contractAddress.Market,OrderDetail?.payTokenAddress as string).then((res:string)=>{
          setApproveNum(new BigNumber(res).div(10 **18).toString())
        })
      }
    }
  },[web3React.account,OrderDetail?.payTokenAddress])
  let DynamicStateMap=[
      {
          key:t('All'),
          value:-1
      },
      {
          key:t('Listing'),
          value:0
      },
      {
          key:t('Sale'),
          value:1
      },
      {
          key:t('Cancel an order'),
          value:2
      },
      {
          key:t('Send'),
          value:3
      }
  ];
  const DynamicStateMenu=(
      <Menu onClick={()=>handleDropDown(setExpand13,expand13)}>
          {
              DynamicStateMap.map((item,index)=><Menu.Item key={index} onClick={()=>{setDynamicState(index)}}>
                  {item.key}
              </Menu.Item>)  
          }
      </Menu>
  );
  // 下拉图标旋转
  const handleDropDown=(fun:any,value:boolean)=>{
    fun(!value);
  }
  
  async function buyOrder(){
    if(OrderDetail){
      let Balance
      /* 获取卡牌授权对象 */
      // let isApprove =  await Contracts.example.getapproveMarket(web3React.account as string,OrderDetail.nnftUser.tokenAddress)
      // console.log(isApprove)
      // if(!isApprove){
      //   return dispatch(createAddMessageAction('卖家卡牌未授权'))
      // }
      if(OrderDetail.coinName !== 'BNB'){
        /* 判断授权 */
        if(new BigNumber(approveNum).lt(OrderDetail.priceString as string)){
          return dispatch(createAddMessageAction(t('Please authorize')))
        }
        Balance = await Contracts.example.TOKENbalanceOf(web3React.account as string,OrderDetail?.payTokenAddress as string)
        Balance = new BigNumber(Balance).div(10 **18).toString()
      }
      if(OrderDetail.coinName === 'BNB'){
        Balance = await Contracts.example.getBalance(web3React.account as string)
        Balance = new BigNumber(Balance).div(10 **18).toString()
      }
      // console.log(Balance,"余额")
      //判断余额不足
      if(new BigNumber(Balance as string).lt(OrderDetail.priceString as string)){
        return dispatch(createAddMessageAction(t('Not enough balance')))
      }
      dispatch(createSetLodingAction(true))
      buyNftOrder(OrderDetail.id as number).then(res=>{
        console.log(res,"购买加密信息")
        if(OrderDetail){
          let price = OrderDetail.coinName === 'BNB' ? OrderDetail.priceString :0
          Contracts.example.makeOrder(web3React.account as string,res.data,price as string).then(()=>{
            // navigate(-1)
            setShowBuySuccess(true)
            return dispatch(createAddMessageAction(t('Purchase successful')))
          }).finally(()=>{
            dispatch(createSetLodingAction(false))
          })
        }
      },()=>{
        dispatch(createSetLodingAction(false))
      })
    }
  }
  function isApprove(){
    if(OrderDetail){
      return new BigNumber(approveNum).gte(OrderDetail.priceString as string) || OrderDetail.coinName === 'BNB'
    }else{
      return false
    }
  }
  function goSomeone(address:string){
    if(address){
      navigate('/Someone?address='+address)
    }
  }
  // function FullScreen(){
  //   const full = document.getElementById('nftImg')
  //   if(full){
  //       full.requestFullscreen()
  //   }
  // }
  function approve(){
    Contracts.example.TOKENapprove(web3React.account as string,contractAddress.Market,OrderDetail?.payTokenAddress as string).then((res :any)=>{
      Contracts.example.TOKENallowance(web3React.account as string,contractAddress.Market,OrderDetail?.payTokenAddress as string).then((res:string)=>{
        setApproveNum(new BigNumber(res).div(10 **18).toString())
      })
    })
  }
  function goProject(projectName:string,isAuthentication:number | null){
    if(!isAuthentication){
      dispatch(createAddMessageAction(t('Not certified')))
    }
    if(projectName && isAuthentication){
      navigate('/project?projectName='+ projectName)
    }
  }
  function copyUserAddr(account:string){
    if(account){
        copy(account as string)
        dispatch(createAddMessageAction(t('Please connect your wallet')))
    }
  }
  function CopyLink(){
    copy(window.location.href)
    dispatch(createAddMessageAction(t('Copy successful')))
  }
  function syncUserNftDataFun() {
    dispatch(createSetLodingAction(true))
    syncUserNftData(web3React.account as string).then(()=>{},()=>{
        dispatch(createSetLodingAction(false))
        dispatch(createAddMessageAction(t('Sync failed')))
    })
}
  return (
    <div>
      <div className="GoodsDetial">
        <div className="DetialImg DetialImg1 flexCenter">
          <div className="GoodsImg">
            {
              OrderDetail && <img id="nftImg" 
              onClick={()=>{setShowFullScreen(true)}} 
              src={OrderDetail.nnftUser.image as string || defaultCard} 
              onError={(e:any) => {
                // 替换的图片
                e.target.src = defaultCard;
                // 控制不要一直触发错误
                e.onError = null;
              }}
              alt="" />
            }
          </div>
        </div>
        <div className="GoodsInfo">
          <div className="infoRow">
            {
              OrderDetail && <div className="rowLeft pointer" onClick={()=>{goProject(OrderDetail!.nnftUser.projectName,OrderDetail!.isAuthentication)}}>
              <span className="projectName">{OrderDetail&& OrderDetail.nnftUser.projectName}</span>
              {
                OrderDetail&& OrderDetail.isAuthentication  ? <img src={authentication} alt="" /> : <img src={NotCertified} alt="" />
              }
            </div>
            }
            
            <div className="rowRight"><img src={Collection} alt="" /><div className="colorA5">{OrderDetail &&  OrderDetail.giveNum}</div><img src={see} alt="" /><div className="colorA5">{OrderDetail && OrderDetail.browseNum}</div></div>
          </div>
          <div className="infoRow">
            <div className="rowLeft"><span className="nftName">{OrderDetail && OrderDetail.nnftUser.nftName}</span></div>
            {/* 分享组 */}
            <div className="shareGroup">
              <div className="item flexCenter pointer" onClick={syncUserNftDataFun}>
                <img src={Refresh} alt="" />
              </div>
              <div className="item flexCenter pointer" onClick={CopyLink}>
                <img src={share} alt="" />
              </div>
              <div className="item flexCenter pointer">
                <img src={set} alt="" />
              </div>
            </div>
          </div>
          {/* <div className="hold">持有者 {OrderDetail && AddrHandle(OrderDetail.userAddress as string)}</div> */}
          <div className="hold">{t('hold address')}
          {
            OrderDetail && <div className="userAddress flexCenter pointer" onClick={()=>goSomeone(OrderDetail!.userAddress as string)}>
                    <img src={chainIcon} alt="" />
                    <span>{AddrHandle(OrderDetail.userAddress as string) }</span>
                    {/* <img className="copyIcon" onClick={()=>{copyUserAddr(OrderDetail!.userAddress as string)}} src={minCopyIcon} alt="" /> */}
          </div>
          }
          
          </div>

          {/* 价格 & 购买按钮 */}
          {/* 价格 & 调价按钮 */}
          <div className="DetialImg DetialImg2 flexCenter">
          <div className="GoodsImg">
            {
              OrderDetail && <img id="nftImg" 
              onClick={()=>{setShowFullScreen(true)}} 
              src={OrderDetail.nnftUser.image as string || defaultCard} 
              onError={(e:any) => {
                // 替换的图片
                e.target.src = defaultCard;
                // 控制不要一直触发错误
                e.onError = null;
              }}
              alt="" />
            }
          </div>
        </div>
          {
          OrderDetail && OrderDetail.userAddress && OrderDetail.userAddress === web3React.account ?<div className="buyRow">
            <div className="buyPrice">
              <img src={thumbtack} alt="" />
              <div className="division"></div>
              <div className="Price">
                <div className="tokenNum">{OrderDetail.priceString} {OrderDetail.coinName}</div>
                <div className="dollar">{t('Price')}（${NumSplic(OrderDetail.uorderPrice+'',4)})</div>
              </div>
            </div>
            <div className="btnGroup">
              <div className="BuyBtn flexCenter pointer" onClick={()=>{setShowPriceChange(true)}}>{t('Change Price')}</div>
              <div className="cancelBtn flexCenter pointer" onClick={()=>setShowEnterCancel(true)}>{t('Cancel')}</div>
            </div>
          </div> : <div className="buyRow">
          <div className="buyPrice">
            <img src={thumbtack} alt="" />
            <div className="division"></div>
            <div className="Price">
              {
                OrderDetail && <div className="tokenNum">{OrderDetail.priceString} {OrderDetail.coinName}</div>
              }
              {
                OrderDetail && <div className="dollar">{t('Price')}（${NumSplic(OrderDetail.uorderPrice+'',4)})</div>
              }
            </div>
          </div>
          <div className="btnGroup">
            {
              isApprove() ? <div className="BuyBtn flexCenter pointer" onClick={buyOrder}>{t('Buy')}</div> : <div className="BuyBtn flexCenter pointer" onClick={approve}>{t('Authorize')}</div>
            }
          </div>
        </div>
        }
          {
            OrderDetail && OrderDetail.userAddress && OrderDetail.userAddress === web3React.account ? <div className="brnRow">
                  <div className="BuyBtn flexCenter pointer" onClick={()=>{setShowPriceChange(true)}}>{t('Change Price')}</div>
                  <div className="cancelBtn flexCenter pointer" onClick={()=>setShowEnterCancel(true)}>{t('Cancel')}</div>
            </div>
            : 
            <div className="brnRow">
              {
                isApprove() ? <div className="BuyBtn flexCenter" onClick={buyOrder}>{t('Buy')}</div> : <div className="BuyBtn flexCenter" onClick={approve}>{t('Authorize')}</div>
              }
            </div>
          }
          
          {/* 描述 */}

          <div className="describe">
          {t('description')}：{
            OrderDetail && OrderDetail.projectDesc
          }
          </div>
          {/* 属性 信息 */}
          <div className="attribute">
            <div className={attrOrInfo ? "item activeItem pointer flexCenter" : "item pointer flexCenter"} onClick={()=>{setAttrOrInfo(true)}}>{t('Attributes')}</div>
            <div  className={attrOrInfo ? "item flexCenter pointer" : "item activeItem pointer flexCenter"}  onClick={()=>{setAttrOrInfo(false)}}>{t('Info')}</div>
          </div>
          {/* 属性行 */}
          {
            attrOrInfo? <>{
               OrderDetail && OrderDetail.nnftUser.metadata && Object.keys(OrderDetail.nnftUser.metadata).map(item=>{
                return <div className="attrRow" key={item}>
                  {/* {console.log({item},'fy')} */}
                  <div className="attrLabel">{t(`${item}`)}</div>
                  <div className="attrValue">{OrderDetail && OrderDetail.nnftUser.metadata[item]}</div>
                </div>})
            }</>:
            <>
              {OrderDetail &&<div className="attrRow">
                <div className="attrLabel">{t('CONTRACT')}</div>
                <a href={"https://bscscan.com/address/"+OrderDetail.nnftUser.tokenAddress} target="_blank"  rel="noreferrer">
                  <div className="attrValue fontNwhite">{AddrHandle(OrderDetail.nnftUser.tokenAddress)}<img src={share2} alt="" />
                  </div>
                </a>
              </div>}
              <div className="attrRow">
                <div className="attrLabel">{t('TOKEN ID')}</div>
                <div className="attrValue">{OrderDetail && (OrderDetail.nnftUser.tokenId.length > 16 ? AddrHandle(OrderDetail.nnftUser.tokenId,10,6) : OrderDetail.nnftUser.tokenId) }</div>
              </div>
              <div className="attrRow">
                <div className="attrLabel">{t('BLOCKCHAIN')}</div>
                <div className="attrValue">BNB Chain</div>
              </div>
            </>
          }
        </div>
      </div>
      <div className="dynamicOrTable">
        <div className="tab">
          <div className="item activeItem flexCenter">{t('Activities')}</div>
          {/* <div className="item flexCenter">图表</div> */}
        </div>
        <Dropdown overlay={DynamicStateMenu} trigger={['click']} onVisibleChange={()=>handleDropDown(setExpand13,expand13)}>
            <div className="search">
                <div className="searchBox">{DynamicStateMap[DynamicState].key}</div>
                <img className={expand13?'rotetaOpen':'rotetaClose'} src={openIcon} alt="" />
            </div>
        </Dropdown>
      </div>
      {/* 表格 start*/}
      <div className="TableBox">
      <ConfigProvider renderEmpty={()=><NoData/>}>
        
                <Table dataSource={tableData} pagination={false} rowKey="id" scroll={{ x: 'max-content' }}>
                <Column
                    title={t('Type')}
                    render={item => (
                        <>
                        <div className="typeMain">{operateTtype[item.operateType]}</div>
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
                          {
                              item.projectLogo ? <img src={item.projectLogo} alt="" />:<img src={Logo} alt="" />
                          }
                        <div>
                            <div className="protName pointer" onClick={()=>{goProject(item.projectName,item.isAuthentication)}}>{item.projectName} 
                            {item.isAuthentication === 1 ? <img src={authentication} alt="" /> : <img src={NotCertified} alt="" />}</div>
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
                          {item.formAddress ? item.formAddress : "-"}
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
      {/* 表格 end*/}
      <div className="other">{t('More from the seller')}</div>
      <div className="otherRow">
        {
          UserOrder.map((item,index)=><GoodsCard key={index} NftInfo={item} goPath={()=>{navigate('/Goods?orderId='+item.orderId)}}></GoodsCard>)
        }
      </div>
      <div className="LoadMore flexCenter"  onClick={()=>goSomeone(OrderDetail!.userAddress as string)}>{t('View All')}  {'>'}</div>
      {/* <div className="other">{t('More from XXX')}其他更多来自{OrderDetail.nnftUser.projectName}的信息</div> */}
      {
        OrderDetail && <div className="other">{t('More from XXX',{NFTUser:OrderDetail.nnftUser.projectName})}</div>
      }
      <div className="otherRow">
        {
          ProjectOrder.map((item,index)=><GoodsCard key={index} NftInfo={item}></GoodsCard>)
        }
      </div>
      {
        OrderDetail && <div className="LoadMore flexCenter" onClick={()=>{goProject(OrderDetail!.nnftUser.projectName,OrderDetail!.isAuthentication)}}>{t('View Collection')}  {'>'}</div>
      }
      {
        OrderDetail && <>
          <ChangePrice isShow={showPriceChange} tokenId={OrderDetail.nnftUser.tokenId} coinName={OrderDetail.coinName as string} orderId={OrderDetail.id as number} close={()=>{setShowPriceChange(false)}}></ChangePrice>
          <EnterCancel isShow={showEnterCancel} tokenId={OrderDetail.nnftUser.tokenId} orderId={OrderDetail.id as number} close={()=>{setShowEnterCancel(false)}}></EnterCancel>
        </>
      }
      {
        OrderDetail && <BuySuccess isShow={showBuySuccess} 
        data={{
          address:OrderDetail.userAddress as string,
          projectName:OrderDetail.nnftUser.projectName,
          tokenID:OrderDetail.nnftUser.tokenId
        }} 
        close={()=>{setShowBuySuccess(false)}}></BuySuccess>
      }
      {
        OrderDetail && showFullScreen && <FullScreen   close={()=>{setShowFullScreen(false)}} image={OrderDetail.nnftUser.image as string}></FullScreen>
      }
    </div>
  )
}
