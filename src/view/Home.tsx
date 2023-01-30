import { ReactNode, SetStateAction, useEffect, useState, useRef } from 'react';
import '../assets/style/Home.scss'
import { getHomeLoveRank, selectBlownList, getPlatformBaseList } from '../API'
import { useNavigate } from "react-router-dom";
import { stateType } from '../store/reducer'
import { useSelector, useDispatch } from "react-redux";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/css';
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration' // import plugin
import { Menu, Dropdown } from 'antd';
import HotspotCard, { NftInfo } from '../components/HotspotCard'
import SwiperButtonNext from '../components/SwiperButtonNext'
import { useTranslation } from 'react-i18next'
import Collection from '../components/Collection'
import Earth from '../assets/image/earth1.jpg'
import BannerImg from '../assets/image/BannerImg.png'
import ReleaseImg from '../assets/image/ReleaseImg.png'
import ReleaseImgMR from '../assets/image/ReleaseImgMR.png'
import thumbtack from '../assets/image/thumbtack.png'
import Book from '../assets/image/Book.png'
import InProgress from '../assets/image/InProgress.png'
import openIcon from '../assets/image/openIconWhite.png'
import course3 from '../assets/image/course3.png'
import course2 from '../assets/image/course2.png'
import course1 from '../assets/image/course1.png'
import contactIcon1 from '../assets/image/Community1.png'
import contactIcon2 from '../assets/image/Community2.png'
import contactIcon3 from '../assets/image/Community3.png'
import contactIcon4 from '../assets/image/Community4.png'
import contactIcon5 from '../assets/image/Community5.png'
import contactIcon6 from '../assets/image/Community6.png'
// import GtujibiBanner from '../assets/image/GtujibiBanner.png'
import OuterGodsBanner from '../assets/image/OuterGodsBannerImg.jpg'

interface launchType {
  name: string
  routingName: string
  status: number
  id: number
  startPrice: number
  totalReleaseNum: number
  castEndTime: number
  coinName: string
  platformUrl: string
}

export default function Home(): JSX.Element {
  const [expand, setExpand] = useState(true);
  const navigate = useNavigate();
  const Next = useRef<any>(null);
  const swiper = useSwiper();
  let { t } = useTranslation()
  let state = useSelector<stateType, stateType>(state => state);
  let [hotScreen, setHotScreen] = useState<number>(0)
  let [startTime, setstartTime] = useState<number>(0)
  let [CollectionData, setCollectionData] = useState<any[]>([])
  let [hotList, setHotList] = useState<NftInfo[]>([])
  let [launchList, setLaunchList] = useState<launchType[]>([])
  let [newTime, setNewTime] = useState(dayjs().valueOf())
  // 7,1,30
  let hotMapping = [
    {
      key: t('7 Days'),
      value: 7
    },
    {
      key: t('24 Hours'),
      value: 1
    },
    {
      key: t('30 Days'),
      value: 30
    }
  ]
  useEffect(() => {
    if (state.token) {
      getHomeLoveRank().then(res => {
        setHotList(res.data)
        // console.log(res, '人气喜爱')
      })
      getPlatformBaseList().then(res => {
        setstartTime(res.data[0].castStartTime)
        setLaunchList(res.data)
        // console.log(res, "发射台列表")
      })
    }
  }, [state.token])
  useEffect(() => {
    if (state.token) {
      selectBlownList(hotMapping[hotScreen].value).then(res => {
        // console.log(res, '热门收藏')
        res.data = res.data.filter((item: any) => item)
        setCollectionData(res.data)
      })
    }
  }, [state.token, hotScreen])

  dayjs.extend(duration)
  useEffect(() => {
    let time = setInterval(() => {
      if (startTime) {
        setNewTime(dayjs().valueOf())
      }
    }, 1000)
    return () => {
      clearInterval(time)
    }
  }, [startTime])
  const diffTime = dayjs.duration(startTime - newTime);
  // const day = diffTime.days(); //天
  const hours = diffTime.hours(); //小时
  const minutes = diffTime.minutes(); //分钟
  const seconds = diffTime.seconds();
  const handleDropDown = () => {
    setExpand(!expand);
  }

  const menu = (
    <Menu onClick={handleDropDown}>
      <Menu.Item key="0" onClick={() => { setHotScreen(0) }}>
        {t('7 Days')}
      </Menu.Item>
      <Menu.Item key="1" onClick={() => { setHotScreen(1) }}>
        {t('24 Hours')}
      </Menu.Item>
      <Menu.Item key="3" onClick={() => { setHotScreen(2) }}>
        {t('30 Days')}
      </Menu.Item>
    </Menu>
  );

  function goDetial(DetialInfo: any) {
    // console.log(DetialInfo.orderId);
    if (DetialInfo.orderStatus === 0) {
      navigate('/Goods?orderId=' + DetialInfo.orderId)
    } else {
      navigate('/Sell?ID=' + DetialInfo.id)
    }
  }
  return (
    <div className="HomePage">
      {/* BANNER start */}
      <div className="earth"><img src={Earth} />
      </div>
      {/* BANNER end */}
      {/* Release start */}
      <div className="ReleaseTitle">{t('Launchpad')}</div>
      <div className="ReleaseBox">
        {/* Casting */}
        <Swiper
          modules={[Autoplay]}
          slidesPerView={2}
          loop={true}
          spaceBetween={20}
          autoplay={true}
        >
          {
            launchList.map((item, index) => <SwiperSlide key={index}><div className='ReleaseContent1'>
              <div className="ReleaseImg">
                <img src={item.platformUrl} alt="" className="pointer" onClick={() => { navigate('/Launch?id=' + item.id) }} />
              </div>
              <div className="ReleaseName">{item.name}</div>
              <div className="TokenRow">
                <div className="token1">{item.startPrice} {item.coinName} <img src={thumbtack} alt="" /></div>
                <div className="token2">{item.totalReleaseNum} Items <img src={Book} alt="" /></div>
              </div>
              {
                item.status === 0 && newTime < startTime ? <div className="StartTips">{t('Will start at 20:12:22', { startTime: <span>{hours}:{minutes}:{seconds}</span> })}</div> : <div className="InProgress">{newTime > item.castEndTime ? t('Ended') : t('Ongoing')}<img src={InProgress} alt="" /></div>
              }
            </div></SwiperSlide>)
          }
          <SwiperButtonNext onRef={Next}></SwiperButtonNext>
        </Swiper>
        <button className="swiper-button-prev" onClick={() => { Next!.current.prev() }}>下一张</button>;
        <button className="swiper-button-next" onClick={() => { Next!.current.next() }}>下一张</button>;
        {/* CastingMR */}
        {/* {
        launchList.map((item, index) => <div className='ReleaseContent1' key={index}>
          <div className="ReleaseImg">
            <img src={item.platformUrl} alt="" className="pointer" onClick={()=>{navigate('/Launch?id='+item.id)}} />
          </div>
          <div className="ReleaseName">{item.name}</div>
          <div className="TokenRow">
            <div className="token1">{item.startPrice} {item.coinName} <img src={thumbtack} alt="" /></div>
            <div className="token2">{item.totalReleaseNum} Items <img src={Book} alt="" /></div>
          </div>
          {
            item.status === 0 && newTime < startTime ? <div className="StartTips">{t('Will start at 20:12:22',{startTime:<span>{hours}:{minutes}:{seconds}</span>})}</div> : <div className="InProgress">{newTime > item.castEndTime ? t('Ended') :t('Ongoing')}<img src={InProgress} alt="" /></div>
          }
        </div>)
      } */}
      </div>
      {/* Release end */}
      {/* popularity start */}
      <div className="popularityTitle">{t('Popular')}</div>
      <div className="popularityRow">
        {
          hotList.map((item, index) => <HotspotCard goPath={() => { goDetial(item) }} key={index} NftInfo={item}></HotspotCard>)
        }
      </div>
      {/* <div className="more pointer flexCenter"  onClick={()=>{navigate('/Market')}}>{t('View all')} {'>'}</div> */}
      {/* popularity end */}
      {/* Collection start */}
      <div className="CollectionTitle flexCenter">
        {t('Hot Collections')}
        <Dropdown overlay={menu} trigger={['click']} onVisibleChange={handleDropDown}>
          <div className="pastTimes">{hotMapping[hotScreen].key} {expand ? <img className='rotetaOpen' src={openIcon} alt="" /> : <img className='rotetaClose' src={openIcon} alt="" />}</div>
        </Dropdown>

        {/* <Dropdown overlay={menu1} trigger={['click']}>
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            更多操作{expand?<DownOutlined style={{fontSize: '10px'}}/>:<UpOutlined style={{fontSize: '10px'}}/>}
          </a>
        </Dropdown> */}
      </div>
      {/* 热门收藏列表 */}
      <div className="CollectionList">
        {
          CollectionData.map((item, index) => <Collection goPath={() => { goDetial(item) }} key={index} index={index} data={item}></Collection>)
        }
        <div className="CollectionCardWidth"></div>
        <div className="CollectionCardWidth"></div>
      </div>
      {/* Collection end */}
      {/* course start */}
      <div className="courseTitle">{t('Resources for getting started')}</div>
      <div className="courseRow">
        <div className="courseItem pointer">
          <img src={course1} alt="" onClick={() => { navigate('/StartRes1?type=0') }} />
          <div className="courseName">{t('How to Easily Setup a MetaMask Wallet')}</div>
        </div>
        <div className="courseItem pointer">
          <img src={course2} alt="" onClick={() => { navigate('/StartRes1?type=1') }} />
          <div className="courseName">{t('How to Fund MetaMask with ETH')}</div>
        </div>
        <div className="courseItem pointer">
          <img src={course3} alt="" onClick={() => { navigate('/StartRes1?type=2') }} />
          <div className="courseName">{t('How to Find an NFT You Love')}</div>
        </div>
      </div>
      {/* course end */}
      {/* Gtujibi  start */}
      <div className="GtujibiTitle">{t('Meet Outer Gods')}</div>
      <div className="GtujibiSubTitle">{t('Meet Outer Gods, The NFT marketplace with everything for everyone')}</div>
      <div className="GtujibiBanner">
        <img src={OuterGodsBanner} alt="" />
      </div>
      <div className="explore pointer flexCenter" onClick={() => { navigate('/Market') }}>{t('Explore the Marketplace')}</div>
      {/* Gtujibi  end */}
      {/* community  start */}
      <div className="addCommunity">{t('Join the community')}</div>
      <div className="IconRow flexCenter">
        {/* <img src={contactIcon1} alt="" /> */}
        <a href="https://twitter.com/OuterGods_NFT" target="_blank" rel="noreferrer">
          <img src={contactIcon2} alt="" />
        </a>
        {/* <img src={contactIcon3} alt="" /> */}
        {/* <img src={contactIcon4} alt="" /> */}
        <a href="https://t.me/outergodsNFTmarketplace" target="_blank" rel="noreferrer">
          <img src={contactIcon5} alt="" />
        </a>
        {/* <img src={contactIcon6} alt="" /> */}
      </div>
      {/* community  end */}
    </div>
  )
}