import { Outlet, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Layout, Menu, Dropdown } from 'antd';
import { useConnectWallet, injected, ChainId } from '../web3'
import { searchData } from '../API'
import { useDebounceFn } from 'ahooks'
import { createLoginSuccessAction, createAddMessageAction } from '../store/actions'
// import { stateType } from '../store/reducer'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next'
import { useViewport } from '../components/viewportContext'
import SearchRusult from '../components/SearchRusult'
import logo from '../assets/image/NFTLogo.png'
import Search from '../assets/image/searchIcon.png'
import BNBIcon from '../assets/image/BNBIcon.svg'
import langIcon from '../assets/image/langIcon.png'
import wallet from '../assets/image/wallet.png'
import prevPersonal from '../assets/image/whitePesonal.png'
import personal from '../assets/image/personal.png'
import footerLogo from '../assets/image/footerIcon.png'
import outLink1 from '../assets/image/outLink1.png'
import outLink2 from '../assets/image/outLink2.png'
import outLink3 from '../assets/image/outLink3.png'
import LogOutIcon from '../assets/image/LogOutIcon.png'
import rewardIcon from '../assets/image/rewardIcon.png'
import CollectionIcon from '../assets/image/CollectionIcon.png'
import menuIcon from '../assets/image/menuIcon.png'
import like from '../assets/image/Boldlike.png'
import '../assets/style/layout.scss'
import React, { useEffect, useState } from "react";

interface userData {
    userAddress: string
    headImg: string
}
interface projectData {
    tokenAddress: string
    name: string
    img: string
}
const { Header, Footer } = Layout;
const MainLayout: React.FC = () => {
    let { width } = useViewport()
    let { t, i18n } = useTranslation()
    const location = useLocation();
    let [List, setList] = useState<any>()
    // let [showSearchRes, setShowSearchRes] = useState<any>(null)
    let [focusHide, setFocusHide] = useState<boolean>(false)
    let [hideList, setHideList] = useState<any>()
    const dispatch = useDispatch();
    let ConnectWallet = useConnectWallet()
    const web3React = useWeb3React()
    const navigate = useNavigate();
    const [params] = useSearchParams();
    let id = params.get("id")
    function changeLanguage(lang: any) {
        window.localStorage.setItem("lang", lang.key)
        i18n.changeLanguage(lang.key)
    }
    function focus(path: string) {
        let str = id ? `?id=${id}` : ''
        console.log(str);

        if (path == (location.pathname + str)) {
            return 'menuItem pointer MenuActive'
        } else {
            return 'menuItem pointer'
        }
    }
    function LogOut() {
        web3React.deactivate()
        dispatch(createLoginSuccessAction('', ''))
        dispatch(createAddMessageAction(t('Log out')))
    }
    // useEffect(() => {
    //     document.addEventListener('click', function (e: Event) {
    //         setShowSearchRes(false)
    //     })
    // }, [])
    const { run } = useDebounceFn(changeProjectSearch)
    function changeProjectSearch(e: React.ChangeEvent<HTMLInputElement>) {
        // setShowSearchRes(e.target.value)
        if (e.target.value) {
            searchData(e.target.value).then(res => {
                setList(res.data)
                console.log(res.data);
                // setShowSearchRes(e.target.value)
            })
        } else {
        }
    }

    function getparent(triggerNode: any) {
        return triggerNode.parentNode
    }
    const autoSearchFun = () => {
        if (width < 425) {
            navigate("/MobileSearch")
        } else {

        }

    }
    const personalMenu = (
        <Menu>
            <Menu.Item key="0" onClick={() => { navigate('/Personal?type=0') }}>
                <div className="box">
                    <img src={personal} alt="" />
                    <span className="dropText">{t('Profile')}</span>
                </div>
            </Menu.Item>
            {/* 
            <Menu.Item key="SubMenu" >
                <div className="box" onClick={() => {
                    console.log("zh111111", i18n.language === 'zh' ? 'en' : 'zh')
                    changeLanguage({ key: i18n.language === 'zh' ? 'en' : 'zh' })
                }}>
                    <img src={langIcon} alt="" />
                    <span className="dropText">{i18n.language === 'zh' ? '中文简体' : 'English'}</span>
                </div>
            </Menu.Item>
             */}
            <Menu.Item key="4" onClick={LogOut}>
                <div className="box">
                    <img src={LogOutIcon} alt="" />
                    <span className="dropText">{t('Log out')}</span>
                </div>
            </Menu.Item>
        </Menu>
    );
    const HeadMenu = (
        <Menu>
            <Menu.Item key="0" onClick={() => { navigate('/') }}>
                {t('Home')}
            </Menu.Item>
            <Menu.Item key="1" onClick={() => { navigate('/Market') }}>
                {t('Marketplace')}
            </Menu.Item>
            <Menu.Item key="2">
                {t('Collections')}
            </Menu.Item>
            <Menu.Item key="3" onClick={() => {
                navigate("/Market")
            }}>
                {t('Activities')}
            </Menu.Item>
            <Menu.SubMenu key="SubMenu" title={i18n.language === 'zh' ? 'ZH' : (i18n.language === 'en' ? 'EN' : '한국어')} >
                <Menu.Item key="5" onClick={() => changeLanguage({ key: 'en' })}>
                    English
                </Menu.Item>
                {/* <Menu.Item key="6" onClick={() => changeLanguage({ key: 'kr' })}>
                    한국어
                </Menu.Item> */}
                <Menu.Item key="4" onClick={() => changeLanguage({ key: 'zh' })}>
                    中文简体
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    );
    const menu = (
        <Menu
            onClick={changeLanguage}
            items={[
                {
                    label: <span className="LangItem">English</span>,
                    key: 'en',
                },
                {
                    type: 'divider',
                },
                // {
                //     label: <span className="LangItem">한국어</span>,
                //     key: 'kr',
                // },
                // {
                //     type: 'divider',
                // },
                {
                    label: <span className="LangItem">中文简体</span>,
                    key: 'zh',
                }
            ]}
        />
    );
    return (
        <Layout className="layout">
            <Header className="MainSider" style={{ position: 'fixed', zIndex: 999, width: '100%' }}>
                <img className="logo pointer" src={logo} onClick={() => { navigate('/') }} alt="" />

                <div className="menu">
                    <div className={focus('/Market')} onClick={() => { navigate('/Market') }}>
                        {t('Marketplace')}
                        <div className="unLink"></div>
                    </div>

                    {/* <div className={focus('/Launch')} onClick={() => { navigate('/Launch?id=1') }}> */}
                    <div className={focus('/Launch')}>
                        {t('Collections')}
                        <div className="unLink"></div>
                    </div>
                    <div className={focus('/Market?id=1')} onClick={() => {
                        navigate("/Market?id=1")
                    }} >
                        {t('Activities')}
                        <div className="unLink"></div>
                    </div>
                </div>

                <div className="mobile-header-right">
                    {(425 < width && width < 1440) ?
                        <div className="autoSearch">
                            <img src={Search} alt="" className="mobile-search-icon middleSearch pointer" onClick={() => { autoSearchFun() }} />
                            <input type="text" placeholder="搜索用户地址、项目集合" onChange={(e) => { run(e) }} onFocus={() => { setFocusHide(true) }} onBlur={() => {
                                setFocusHide(false); setHideList(List);
                                setTimeout(() => {
                                    setList(null)
                                }, 1000)
                            }} />
                            {List && <SearchRusult data={List}></SearchRusult>}
                        </div> :
                        (width < 425 && <img src={Search} alt="" className="mobile-search-icon middleSearch pointer" onClick={() => { autoSearchFun() }} />)
                    }
                    {
                        width > 1440 && <div className="search m-hidden pointer" onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}>
                            <img src={Search} alt="" />
                            <input type="text" onChange={(e) => { run(e) }} placeholder={t('Search by Collection、User、Address')} onBlur={() => {
                                setHideList(List);
                                setTimeout(() => {
                                    setList(null)
                                }, 1000)
                            }} />
                            {List && <SearchRusult data={List}></SearchRusult>}
                        </div>
                    }
                    {(!focusHide) && <>
                        <div className="Chain pointer">
                            <img src={BNBIcon} alt="" />
                            <span className="ChainName">BNB Chain</span>
                        </div>
                        <Dropdown overlay={menu} placement="bottomCenter" overlayStyle={{ zIndex: 99999 }} getPopupContainer={getparent} trigger={['click']}>
                            <div className="Lang pointer">
                                <img src={langIcon} alt="" />
                                {i18n.language === 'zh' ? 'ZH' : (i18n.language === 'en' ? 'EN' : '한국어')}
                            </div>
                        </Dropdown>
                        {
                            web3React.active ? <Dropdown overlay={personalMenu} trigger={['click']} getPopupContainer={getparent} overlayClassName='MenuList' overlayStyle={{ padding: '10px 12px', zIndex: 99999 }}>
                                <img className="walletIcon pointer" src={prevPersonal} alt="" />
                            </Dropdown>
                                :
                                <img className="walletIcon pointer" onClick={() => { ConnectWallet(injected, ChainId.BSC) }} src={wallet} alt="" />
                        }
                        <Dropdown overlay={HeadMenu} trigger={['click']} getPopupContainer={getparent} overlayStyle={{ zIndex: 99999 }}>
                            <img className="HeadMenu" src={menuIcon} alt="" />
                        </Dropdown>
                    </>}
                </div>


            </Header>

            <Layout className="Content">
                <Outlet />
            </Layout>
            <div className="MainFooter">
                <div className="footerBox" onClick={() => { window.open("https://www.habitverse.io/") }}>
                    <img className="logo" src={footerLogo}></img>
                </div>
                <div className="outLink">
                    <img src={outLink1} alt="" />
                    <img src={outLink2} alt="" />
                    <img src={outLink3} alt="" />
                </div>
            </div>
        </Layout>
    )
};
export default MainLayout;