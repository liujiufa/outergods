import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { stateType } from '../store/reducer'
import { useSelector, useDispatch } from "react-redux";
import { createAddMessageAction } from '../store/actions'
import { useNavigate } from "react-router-dom";
import { userInfoType, updateUserInfo, getUserInfo } from '../API'
import { useTranslation } from 'react-i18next'

import '../assets/style/UserInfo.scss'
import LaunchLogo from '../assets/image/LaunchLogo.png'
import twitterIcon from '../assets/image/twitterIcon.png'
import facebookIcon from '../assets/image/facebookIcon.png'
import youtubeIcon from '../assets/image/youtubeIcon.png'


export default function UserInfo(): JSX.Element {
    const web3React = useWeb3React()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let { t } = useTranslation();

    let state = useSelector<stateType, stateType>(state => state);
    let [userInfo, setUserInfo] = useState<userInfoType>({
        userName: '',
        brief: '',
        email: '',
        headImg: '',
        faceBook: '',
        tweet: '',
        youtube: '',
        id: ''
    })
    useEffect(() => {
        if (web3React.account && state.token) {
            getUserInfo(web3React.account).then((res: any) => {
                setUserInfo({
                    userName: res.data.userName || '',
                    brief: res.data.brief || '',
                    email: res.data.email || '',
                    headImg: res.data.headImg || '',
                    faceBook: res.data.faceBook || '',
                    tweet: res.data.tweet || '',
                    youtube: res.data.youtube || '',
                    id: res.data.id
                })
            })

        }

    }, [web3React.account, state.token])
    function changeInfo(e: React.ChangeEvent<HTMLInputElement>) {
        let name = e.target.getAttribute('name')
        setUserInfo({
            ...userInfo,
            [name as string]: e.target.value
        })
    }
    function submit() {
        updateUserInfo(userInfo).then(res => {
            // console.log(res,"修改用户信息")
            dispatch(createAddMessageAction(t('Modification succeeded')))
            navigate(-1)
        })
    }
    return (
        <div id="userinfo" className="userInfoPage">
            <div className="userInfoContainer">
                <div className="userInfoContent">
                    <div className="setting">设置</div>
                    <div className="userInfoTitle">{t('Profile')}</div>
                    <div className="line"></div>
                    <div className="mainLabel">{t('Basic information')}</div>
                    {/* <div className="mainLabelTips">您可以从<span>“我的NFT”</span>中选择一个NFT作为你的头像</div> */}
                    <div className="mainLabelTips">{t('avatar1', { NFT: "NFT" })}</div>
                    <div className="headerLabel">{t('avatar')}</div>
                    <div className="userHeader">
                        <img src={LaunchLogo} alt="" />
                    </div>
                    <div className="InfoLabel">{t('USERNAME')}</div>
                    <div className="putBox">
                        <input type="text" name="userName" value={userInfo.userName} placeholder={t('Your Username')} onChange={changeInfo} />
                    </div>
                    <div className="InfoLabel">{t('E-mail')}</div>
                    <div className="putBox">
                        <input type="text" name="email" value={userInfo.email} placeholder={t('Your E-mail')} onChange={changeInfo} />
                    </div>
                    <div className="InfoLabel">{t('INTRO')}</div>
                    <div className="putBox">
                        <input type="text" name="brief" value={userInfo.brief} onChange={changeInfo} placeholder={t('selfIntro')} />
                    </div>
                    <div className="mainLabel" style={{ marginTop: 40 }}>{t('Social links')}</div>
                    <div className="mainLabelTips">{ }</div>
                    <div className="InfoLabel"><img src={twitterIcon} alt="" />{t('TWITTER')}</div>
                    <div className="putBox">
                        <input type="text" name="tweet" value={userInfo.tweet} onChange={changeInfo} placeholder={t('Link')} />
                    </div>
                    <div className="InfoLabel"><img src={youtubeIcon} alt="" />{t('YOUTUBE')}</div>
                    <div className="putBox">
                        <input type="text" name="youtube" value={userInfo.youtube} onChange={changeInfo} placeholder={t('Link')} />
                    </div>
                    <div className="InfoLabel"><img src={facebookIcon} alt="" />{t('FACEBOOK')}</div>
                    <div className="putBox">
                        <input type="text" name="faceBook" value={userInfo.faceBook} onChange={changeInfo} placeholder={t('Link')} />
                    </div>
                    <div className="submit flexCenter" onClick={submit}>{t('Save')}</div>
                </div>
            </div>

            <div className="right"></div>
        </div>

    )
}
