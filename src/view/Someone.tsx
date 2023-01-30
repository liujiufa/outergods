import React,{useEffect , useState} from 'react'
import { useNavigate , useSearchParams} from "react-router-dom";
import { Table,ConfigProvider } from 'antd';
import {getUserInfo,getNftUserInfo,getNftUserState,getUserAwardList,getUserGiveLikeList,NftUserType} from '../API'
import {useWeb3React} from '@web3-react/core'
import {stateType} from '../store/reducer'
import {useSelector,useDispatch} from "react-redux";
import { Menu, Dropdown } from 'antd';
import {AddrHandle , HowLongAgo} from '../utils/tool'
import '../assets/style/Personal.scss'
import {createAddMessageAction} from '../store/actions'
import CollectionScreenModal from '../components/CollectionScreenModal'
import Goods,{NftInfo} from '../components/HotspotCard'
import { useTranslation } from 'react-i18next'
import copy from 'copy-to-clipboard'; 
import NoData from '../components/NoData'
import LaunchLogo from '../assets/image/LaunchLogo.png'
import write from '../assets/image/write.png'
import NotCertified from '../assets/image/NotCertified.png'
import chainIcon from '../assets/image/chainIcon.png'
import copyIcon from '../assets/image/minCopyIcon.png'
import shareIcon from '../assets/image/shareIcon.png'
import minSet from '../assets/image/minSet.png'
import openIcon from '../assets/image/openIconWhite.png'
import filter from '../assets/image/filter.png'
import TableGoodsImg from '../assets/image/TableGoodsImg.png'
import authentication from '../assets/image/authentication.png'
const { Column } = Table;


interface userInfoType{
    userName: string | null,
    brief:string | null,
    createTime:number,
    headImg: string | null,
}
interface AwardType{
    amount:number,
    totalAmount:number,
    coinName:string,
}
export default function Someone(): JSX.Element {
    // 控制图标上下
const [expand22, setExpand22] = useState(true); 
const [expand23, setExpand23] = useState(true); 
const [expand24, setExpand24] = useState(true); 
const [expand25, setExpand25] = useState(true); 
    const [params] = useSearchParams();
    const dispatch = useDispatch();
    const web3React = useWeb3React()
  let { t } = useTranslation();

    let state = useSelector<stateType,stateType>(state => state);
    let [userInfo,setUserInfo] = useState<userInfoType | any>(null)
    let [userNft,setUsetNft] =useState<NftInfo []>([])
    const navigate = useNavigate();
    let [tabIndex,setTabIndex] =useState<number>(0)
    let [pageNum,setPageNum] = useState<number>(1)
    let [showScreenModal,setShowScreenModal] = useState<boolean>(false)
    let [isDynamic,setIsDynamic] =useState<boolean>(false)
    let [nftState,setNftstate] = useState(0)
    let [nftSort,setNftSort] = useState(0)
    let [DynamicState,setDynamicState] = useState(0)
    let [DynamicType,setDynamicType] = useState(1)
    let [currencyType,setCurrencyType] = useState(0)
    let [tableData, setTableData] = useState([])
    let [AwardList,setAwardList] =useState<AwardType []>([])
    let [userLikeList,setUserLikeList] =useState<NftInfo []>([])
    let address = params.get('address')
    /* 收藏 start */
    let CollectionStateMap=[
        {
            key:t('All'),
            value:-1
        },
        {
            key:t('For sale'),
            value:1
        },
        {
            key:t('Not listed'),
            value:0
        }
    ];
    let currencyMap =[
        {
            key:'BNB',
            value:0
        },
        {
            key:'USDT',
            value:1
        },
    ]
    let CollectionSortMap=[
        {
            key:t('time descending'),
            value:2
        },
        {
            key:t('ascending time'),
            value:1
        }
    ]
    const CollectionStateMenu = (
        <Menu>
            {
                CollectionStateMap.map((item,index)=><Menu.Item key={index} onClick={()=>{setNftstate(index)}}>
                    {item.key}
                </Menu.Item>)  
            }
        </Menu>
      );
    const CollectionScreenMenu = (
        <Menu>
            {
                CollectionSortMap.map((item,index)=><Menu.Item key={index} onClick={()=>{setNftSort(index)}}>
                    {item.key}
                </Menu.Item>)
            }
        </Menu>
      );
    /* 收藏 end */
    /* 动态 start */
    // let DynamicStateMap=[
    //     {
    //         key:'挂单中',
    //         value:0
    //     },
    //     {
    //         key:'已出售',
    //         value:1
    //     },
    //     {
    //         key:'取消订单',
    //         value:2
    //     },
    //     {
    //         key:'转出',
    //         value:3
    //     }
    // ];
    let DynamicStateMap=[
        {
            key: t('Listing'),
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
    let DynamicTypeMap=[
        {
            key:'NFT',
            value:2
        },
        {
            key:t('Blind Box'),
            value:1
        }
    ]
    const DynamicStateMenu=(
        <Menu>
            {
                DynamicStateMap.map((item,index)=><Menu.Item key={index} onClick={()=>{setDynamicState(index)}}>
                    {item.key}
                </Menu.Item>)  
            }
        </Menu>
    );
    const DynamicTypeMenu = (
        <Menu>
            {
                DynamicTypeMap.map((item,index)=><Menu.Item key={index}  onClick={()=>{setDynamicType(index)}}>
                    {item.key}
                </Menu.Item>)  
            }
        </Menu>
    );
    /* 动态 end */
    /* 奖励 start */
    const currencyMenu = (
        <Menu>
            {
                currencyMap.map((item,index)=><Menu.Item key={index}  onClick={()=>{setCurrencyType(index)}}>
                    {item.key}
                </Menu.Item>)  
            }
        </Menu>
    );
    /* 奖励 end */
    useEffect(()=>{
        if(web3React.account && state.token && address){
            getUserAwardList().then(res=>{
                setAwardList(res.data)
                // console.log(res,'用户奖励')
            })
            getUserGiveLikeList(address).then(res=>{
                setUserLikeList(res.data)
                // console.log(res,"用户点赞列表")
            })
        }
      },[nftState,nftSort,web3React.account,state.token,address])
      useEffect(()=>{
        if(web3React.account && state.token && address){
            setPageNum(1)
            getNftUserInfo({
                userAddress:address,
                pageSize:10,
                currentPage:1,
                bidType:-1,
                status:CollectionStateMap[nftState].value,
                type:-1,
                projectName:'',
                sortType:CollectionSortMap[nftSort].value
            }).then(res=>{
                setUsetNft(res.data)
                // console.log(res,'用户所拥有的nft')
            })
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[nftState,nftSort,web3React.account,state.token,address])
      /* 修改筛选条件 */
    function changeScreen(ScreenData:NftUserType,stateIndex?:number,sortIndex?:number){
        setNftstate(stateIndex || 0)
        setNftSort(sortIndex || 0)
        setPageNum(1)
        getNftUserInfo({...ScreenData,pageSize:10,currentPage:1,userAddress:web3React.account as string}).then(res=>{
            setUsetNft(res.data)
            // console.log(res,'用户所拥有的nft')
        })
    }
    function LoadMore(){
        // console.log("加载更多")
        let page = pageNum+1
        setPageNum(page)
        getNftUserInfo({
            userAddress:address as string,
            pageSize:10,
            currentPage:page,
            bidType:-1,
            status:CollectionStateMap[nftState].value,
            type:-1,
            projectName:'',
            sortType:CollectionSortMap[nftSort].value
        }).then(res=>{
            setUsetNft([...userNft,...res.data])
            if(res.data.length === 0){
                dispatch(createAddMessageAction(t('No more')))
            }
            // console.log(res,'用户所拥有的nft')
        })
    }
    useEffect(()=>{
        if(web3React.account && state.token && address){
            getNftUserState({userAddress:address,status:DynamicStateMap[DynamicState].value,type:DynamicTypeMap[DynamicType].value}).then(res=>{
                setTableData(res.data)
                console.log(res,"动态")
            }) 
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[DynamicType,DynamicState,web3React.account,state.token,address])
    useEffect(()=>{
        if(address && state.token){
            getUserInfo(address).then((res)=>{
                setUserInfo(res.data)
                // console.log(res,'用户信息')
            })
        }
      },[web3React.account,state.token , address])
      // 下拉图标旋转
  const handleDropDown=(fun:any,value:boolean)=>{
    fun(!value);
  }
      function changeIsDynamic(value:boolean){
          //获取用户所有的nft
          if(!value){
            
          }else{
            //获取动态

          }
        setIsDynamic(value)
      }
      function getFullYear(time:number){
        var date = new Date(time); // 初始化日期
        return date.getFullYear();
      }
      function getMonth(time:number){
        var date = new Date(time); // 初始化日期
        return date.getMonth() + 1;
      }
      function copyUserAddr(account:string){
        if(account){
            copy(account as string)
            dispatch(createAddMessageAction(t('Copied')))
        }
      }
    function share(){
        copy(window.location.origin+window.location.pathname+'#/Someone?address='+address)
        dispatch(createAddMessageAction(t('Copied')))
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
    <div>
        <div className="userInfo">
            <div className="userHeader">
                <img src={userInfo?.headImg || LaunchLogo} alt="" />
            </div>
            <div className="Info">
                <div className="userName">{userInfo?.userName || t('Username')}</div>
                <div className="userAddress pointer flexCenter" onClick={()=>{copyUserAddr(address as string)}}>
                    <img src={chainIcon} alt="" />
                    <span>{address && AddrHandle(address,5,4)}</span>
                    <img className="copyIcon" src={copyIcon} alt=""  />
                </div>
                {
                    userInfo && <div className="introduce">{t('Join in April 2022 / short self-introduction',{FullMonth:getMonth(userInfo?.createTime),FullYear:getFullYear(userInfo?.createTime),UserInfo:userInfo?.brief || ' '})}</div>
                }
                
            </div>
            <div className="flex1"></div>
            <div className="btnGroup" >
                <div className="share pointer flexCenter" onClick={share}><img src={shareIcon} alt="" />{t('Share')}</div>
            </div>
        </div>
        <div className="tabs">
            <div className={tabIndex ===0 ? "item pointer activeItem":"item pointer"} onClick={()=>{setTabIndex(0)}}>{t('Collection')}</div>
            <div className={tabIndex ===1 ? "item pointer activeItem":"item pointer"} onClick={()=>{setTabIndex(1)}}>{t('Favorites')}</div>
        </div>
        {/* 收藏 start */}
        {
            tabIndex === 0 &&   <div className="searchRow">
                <div className="tab">
                    <div className={isDynamic ? 'item pointer flexCenter':'item activeItem pointer flexCenter'} onClick={()=>{changeIsDynamic(false)}} >{t('Items')}</div>
                    <div className={isDynamic ? 'item pointer activeItem flexCenter':'item pointer flexCenter'} onClick={()=>{changeIsDynamic(true)}}>{t('Activities')}</div>
                </div>
                <div className="searchedge">
                    {/* 收藏  start*/}
                    {
                        !isDynamic &&<>
                        <Dropdown overlay={CollectionStateMenu} trigger={['click']} onVisibleChange={()=>handleDropDown(setExpand22,expand22)}>
                            <div className="search">
                                {CollectionStateMap[nftState].key}
                                <img className={expand22?'rotetaOpen':'rotetaClose'}  src={openIcon} alt="" />
                            </div>
                        </Dropdown>
                        <Dropdown overlay={CollectionScreenMenu} trigger={['click']} onVisibleChange={()=>handleDropDown(setExpand23,expand23)}>
                            <div className="search">
                                <div className="searchBox">{CollectionSortMap[nftSort].key}</div>
                                <img className={expand23?'rotetaOpen':'rotetaClose'} src={openIcon} alt="" />
                            </div>
                        </Dropdown>
                        <div className="filter" onClick={()=>{setShowScreenModal(true)}}>
                            <img src={filter} alt="" />
                            {t('Filter')}
                        </div>
                        </>
                    }
                    {/* 收藏  end*/}
                    {/* 动态 start */}
                    {
                        isDynamic &&<>
                        <Dropdown overlay={DynamicStateMenu} trigger={['click']} onVisibleChange={()=>handleDropDown(setExpand24,expand24)}>
                            <div className="search">
                                <div className="searchBox">{DynamicStateMap[DynamicState].key}</div>
                                <img  className={expand24?'rotetaOpen':'rotetaClose'} src={openIcon} alt="" />
                            </div>
                        </Dropdown>
                        <Dropdown overlay={DynamicTypeMenu} trigger={['click']} onVisibleChange={()=>handleDropDown(setExpand25,expand25)}>
                            <div className="search">
                                {DynamicTypeMap[DynamicType].key}
                                <img  className={expand25?'rotetaOpen':'rotetaClose'} src={openIcon} alt="" />
                            </div>
                        </Dropdown>
                        
                        </>
                        
                    }
                        
                    {/* 动态 end */}
                </div>
            </div>
        }
        {/* 物品 start */}
        {
            tabIndex === 0 && !isDynamic && <>
                <div className="goodsList">
                    {
                        userNft.map((item,index)=><Goods key={index} NftInfo={item}></Goods>)
                    }
                </div>
                <div className="LoadMore flexCenter" onClick={LoadMore}>{t('Load More')}  {'>'}</div>
            </>
        }
        {/* 物品 end */}
        {/* 动态 start */}
        {
           tabIndex === 0 && isDynamic && <div className="TableBox">
                
                <ConfigProvider renderEmpty={()=><NoData/>}>
                <Table dataSource={tableData} pagination={false} rowKey="id"  scroll={{ x: 'max-content' }}>

                <Column
                    title={t('Type')}
                    render={item => (
                        <>
                        <div className="typeMain">Listing</div>
                        <div className="typeSub">as fixed price</div>
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
                            <div className="protName pointer"  onClick={()=>{goProject(item.projectName,item.isAuthentication)}}>{item.projectName} 
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
            
        {/* 动态 end */}
        {/* 收藏 end */}
        {/* 喜欢 start */}
        {
            tabIndex === 1 && <div className="goodsList">
                {
                    userLikeList.map((item,index)=><Goods key={index} NftInfo={item}></Goods>)
                }
            </div>
        }
        {/* 喜欢 end */}
        {/* 筛选弹窗 */}
        <CollectionScreenModal isShow={showScreenModal} close={()=>{setShowScreenModal(false)}} changeScreen={changeScreen} ></CollectionScreenModal>
    </div>
  )
}
