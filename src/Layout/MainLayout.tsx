import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Dropdown } from 'antd';
import { useConnectWallet, injected, ChainId } from '../web3'
import { searchData } from '../API'
import { useDebounceFn } from 'ahooks'
import { createLoginSuccessAction, createAddMessageAction } from '../store/actions'
// import { stateType } from '../store/reducer'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next'
import logo from '../assets/image/NFTLogo.png'
import Search from '../assets/image/searchIcon.png'
import BNBIcon from '../assets/image/BNBIcon.png'
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
    name: string
    img: string
}
const { Header, Footer } = Layout;
const MainLayout: React.FC = () => {
    let { t, i18n } = useTranslation()
    const location = useLocation();
    let [addrList, setAddrList] = useState<userData[]>([])
    let [projectList, setProjectList] = useState<projectData[]>([])
    let [showSearchRes, setShowSearchRes] = useState<boolean>(false)
    const dispatch = useDispatch();
    let ConnectWallet = useConnectWallet()
    const web3React = useWeb3React()
    const navigate = useNavigate();
    function changeLanguage(lang: any) {
        window.localStorage.setItem("lang", lang.key)
        i18n.changeLanguage(lang.key)
    }
    function focus(path: string) {
        if (path === location.pathname) {
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
    useEffect(() => {
        document.addEventListener('click', function (e: Event) {
            // e.target as HTMLInputElement
            // console.log(e)
            setShowSearchRes(false)
        })
    }, [])
    const { run } = useDebounceFn(changeProjectSearch)
    function changeProjectSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setShowSearchRes(true)
        if (e.target.value) {
            searchData(e.target.value).then(res => {
                setAddrList(res.data.userList)
                setProjectList(res.data.projectList)
                setShowSearchRes(true)
                // console.log(res, "搜索结果")
            })
        } else {
            setShowSearchRes(false)
        }
    }
    function goSomeone(address: string) {
        navigate('/Someone?address=' + address)
        setShowSearchRes(false)
    }
    function goProject(projectName: string) {
        navigate('/Project?projectName=' + projectName)
        setShowSearchRes(false)
    }
    function FocusFun() {
        setShowSearchRes(true)
    }
    function getparent(triggerNode: any) {
        return triggerNode.parentNode
    }
    const personalMenu = (
        <Menu>
            <Menu.Item key="0" onClick={() => { navigate('/Personal?type=0') }}>
                <div className="box">
                    <img src={personal} alt="" />
                    <span className="dropText">{t('Profile')}</span>
                </div>
            </Menu.Item>
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
            <Menu.Item key="2" onClick={() => { navigate('/Launch') }}>
                Collections
            </Menu.Item>
            <Menu.Item key="3">
                Activities
            </Menu.Item>
            <Menu.SubMenu key="SubMenu" title={i18n.language === 'zh' ? 'ZH' : (i18n.language === 'en' ? 'EN' : '한국어')} >
                <Menu.Item key="5" onClick={() => changeLanguage({ key: 'en' })}>
                    English
                </Menu.Item>
                <Menu.Item key="6" onClick={() => changeLanguage({ key: 'kr' })}>
                    한국어
                </Menu.Item>
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
                {
                    label: <span className="LangItem">한국어</span>,
                    key: 'kr',
                },
                {
                    type: 'divider',
                },
                {
                    label: <span className="LangItem">中文简体</span>,
                    key: 'zh',
                }
            ]}
        />
    );
    return (
        <Layout className="layout">
            <Header className="MainSider" style={{ position: 'fixed', zIndex: 9999, width: '100%' }}>
                <img className="logo pointer" src={logo} onClick={() => { navigate('/') }} alt="" />
                <div className="menu">
                    <div className={focus('/Market')} onClick={() => { navigate('/Market') }}>
                        {t('Marketplace')}
                        <div className="unLink"></div>
                    </div>

                    <div className={focus('/Launch')} onClick={() => { navigate('/Launch?id=1') }}>
                        Collections
                        <div className="unLink"></div>
                    </div>
                    <div className="menuItem">
                        Activities
                        <div className="unLink"></div>
                    </div>
                </div>
                <div className="search" onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}>
                    <img src={Search} alt="" />
                    <input type="text" onChange={(e) => { run(e) }} onFocus={FocusFun} placeholder={t('Search by Collection、User、Address')} />
                    {
                        showSearchRes && (addrList.length !== 0 || projectList.length !== 0) && <div className="searchResult">
                            <div className="LabelRow">{t('User')}</div>
                            {
                                addrList.map((item, index) => <div className="resItem" onClick={() => { goSomeone(item.userAddress) }} key={index}><div className="radius"><img src={item.headImg} alt="" /></div>{item.userAddress}</div>)
                            }
                            <div className="LabelRow">{t('Project')}</div>
                            {
                                projectList.map((item, index) => <div className="resItem" onClick={() => { goProject(item.name) }} key={index}><div className="radius"><img src={item.img} alt="" /></div>{item.name}</div>)
                            }
                        </div>
                    }

                </div>
                <div className="Chain">
                    <img src={BNBIcon} alt="" />
                    <span className="ChainName">BNB Chain</span>
                </div>
                <Dropdown overlay={menu} placement="bottomCenter" overlayStyle={{ zIndex: 99999 }} getPopupContainer={getparent} trigger={['click']}>
                    <div className="Lang">
                        <img src={langIcon} alt="" />
                        {i18n.language === 'zh' ? 'ZH' : (i18n.language === 'en' ? 'EN' : '한국어')}
                    </div>
                </Dropdown>
                {
                    web3React.active ? <Dropdown overlay={personalMenu} trigger={['click']} getPopupContainer={getparent} overlayClassName='MenuList' overlayStyle={{ padding: '10px 12px', zIndex: 99999 }}>
                        <img className="walletIcon" src={prevPersonal} alt="" />
                    </Dropdown>
                        :
                        <img className="walletIcon" onClick={() => { ConnectWallet(injected, ChainId.BSC) }} src={wallet} alt="" />
                }
                <Dropdown overlay={HeadMenu} trigger={['click']} getPopupContainer={getparent} overlayStyle={{ zIndex: 99999 }}>
                    <img className="HeadMenu" src={menuIcon} alt="" />
                </Dropdown>
            </Header>

            <Layout className="Content">
                <Outlet />
            </Layout>
            <div className="MainFooter">
                <div className="footerBox">
                    <img src={footerLogo}></img>
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