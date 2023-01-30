import React, { useEffect ,useState} from 'react'
import '../assets/style/Launch.scss'
import { useNavigate } from "react-router-dom";
import {getPlatformBaseDetail} from '../API'
import {stateType} from '../store/reducer'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration' // import plugin
import {useSelector,useDispatch} from "react-redux";
import { useTranslation } from 'react-i18next'
import LaunchBanner from '../assets/image/LaunchBannerMR.png'
import LaunchLogo from '../assets/image/LaunchLogo.png'
import authentication from '../assets/image/authentication.png'
import ProjectContact1 from '../assets/image/ProjectName1.png'
import ProjectContact2 from '../assets/image/ProjectName2.png'
import ProjectContact3 from '../assets/image/ProjectName3.png'
import ProjectContact4 from '../assets/image/ProjectName4.png'
import ProjectContact5 from '../assets/image/ProjectName5.png'
import ProjectContact6 from '../assets/image/ProjectName6.png'
import ProjectContact7 from '../assets/image/ProjectName7.png'
import go from '../assets/image/go.png'
interface detialType{
    name:string
    image:string
    bannerUrl:string
    castStartTime:number
    castEndTime:number
    startPrice:number
    coinName:string
    twitterUrl?:string
    telegraphGroupUrl?:string
    webUrl?:string
    totalReleaseNum:number
    id:number
    projectExplain:string
}
export default function Launch(): JSX.Element {
    let state = useSelector<stateType,stateType>(state => state);
    let [startTime, setstartTime] = useState<number>(0)
    let [LaunchDetial,setLaunchDetial] = useState<detialType |null>(null)
    let [newTime, setNewTime] = useState(dayjs().valueOf())
  let { t } = useTranslation()

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
    useEffect(()=>{
        if(state.token){
            getPlatformBaseDetail(2).then(res=>{
                setLaunchDetial(res.data)
                setstartTime(res.data.castStartTime)
                // console.log(res,"发射台详情")
            })
        }
    },[state.token])
    function goLaunchDetial(){
        if(LaunchDetial){
            navigate('/CastingMR?id='+LaunchDetial.id)
        }
    }
    const navigate = useNavigate();
    const diffTime = dayjs.duration(startTime - newTime);
    // const day = diffTime.days(); //天
    const hours = diffTime.hours(); //小时
    const minutes = diffTime.minutes(); //分钟
    const seconds = diffTime.seconds();
    return (
        <div className="Launch">
            <div className="banner">
                {
                    LaunchDetial && <img src={LaunchDetial.bannerUrl} alt="" />
                }
                <div className="LaunchLogo">
                    {LaunchDetial ? <img src={LaunchDetial.image} alt="" /> : <img src={LaunchLogo} alt="" />}
                    
                </div>
            </div>
            <div className="projectNameLaunch flexCenter">
                {LaunchDetial && LaunchDetial.name}
                <img src={authentication} alt="" />
            </div>
            <div className="Contact">
                {/* <img src={ProjectContact1} alt="" /> */}
                {
                    LaunchDetial?.webUrl && <a href={LaunchDetial.webUrl} target="_blank" rel="noreferrer">
                        <img src={ProjectContact7} alt="" />
                    </a>
                }
                {
                    LaunchDetial?.twitterUrl && <a href={LaunchDetial.twitterUrl} target="_blank" rel="noreferrer">
                        <img src={ProjectContact2} alt="" />
                    </a>
                }
                
                {/* <img src={ProjectContact3} alt="" /> */}
                {/* <img src={ProjectContact4} alt="" /> */}
                {/* <img src={ProjectContact5} alt="" /> */}
                {
                    LaunchDetial?.telegraphGroupUrl && <a href={LaunchDetial.telegraphGroupUrl} target="_blank" rel="noreferrer">
                        <img src={ProjectContact6} alt="" />
                    </a>
                }
            </div>
            <div className="LaunchInfo">
                <div className="column">
                    <div className="label">{t('Mint Start')}</div>
                    {/* <div className="value">23小时10分39秒</div> */}
                    {/* LaunchDetial && <div className="value">{dayjs(LaunchDetial.castStartTime).format('YYYY年MM月DD日') }</div> */}
                    {
                        startTime > newTime ? <div className="value">{hours}:{minutes}:{seconds}</div>:<div className="value">{t('Ongoing')}</div>
                        
                    }
                    
                </div>
                <div className="column">
                    <div className="label">{t('Mint End')}</div>
                    {
                        LaunchDetial && <div className="value">{dayjs(LaunchDetial.castEndTime).format('MM/DD/YYYY') }</div>
                    }
                </div>
                <div className="column">
                    <div className="label">{t('Start Price')}</div>
                    {
                        LaunchDetial && <div className="value">{LaunchDetial.startPrice} {LaunchDetial.coinName}</div>
                    }
                    
                </div>
                <div className="column">
                    <div className="label">{t('Items')}</div>
                    {
                        LaunchDetial && <div className="value">{LaunchDetial.totalReleaseNum}</div>
                    }
                </div>
            </div>
            {
                startTime <= newTime &&<div className="openBuyBtn flexCenter" onClick={goLaunchDetial}>
                {t('Open mint page')}
                    <img src={go} alt="" />
                </div>
            }
            
            {/* 说明 */}
            <div className="explain">
            
            <div className="explainTitle">
            {t('Project Description')}:
            </div>
            {
                LaunchDetial && LaunchDetial.projectExplain
            }
            </div>
        </div>
    )
}
