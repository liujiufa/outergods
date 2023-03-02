import { useDebounceFn } from 'ahooks'
import React, { useState } from 'react'
import { searchData } from '../API'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from 'antd'
import searchIcon from '../assets/image/searchIcon.png'
import returnIcon from '../assets/image/returnIcon.png'
import defaultCard from '../assets/image/defaultCard.png'
import '../assets/style/MobileSearch.scss'
import NoData from '../components/NoData'
export default function MobileSearch() {
    const navigate = useNavigate()
    let [showSearchRes, setShowSearchRes] = useState<any>()
    let [list, setList] = useState<any>()

    const { run } = useDebounceFn(changeProjectSearch)
    function changeProjectSearch(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.value) {
            setShowSearchRes(e.target.value)
            searchData(e.target.value).then(res => {
                console.log(res.data);
                setList(res.data)
            })
        } else {
            setShowSearchRes(null)
        }
    }

    return (
        <div className='mobileSearch'>
            <div className="searchHeader">
                <div className="left flexCenter">
                    <img src={returnIcon} alt="" onClick={() => { navigate("/") }} />
                </div>
                <div className="right">
                    <div className="searchIcon">
                        <img src={searchIcon} alt="" />
                    </div>
                    <input type="text" value={showSearchRes} placeholder='搜索集合、地址' onChange={(e) => {
                        run(e)
                        setShowSearchRes(e.target.value)
                    }} />
                </div>
            </div>
            <div className="line"></div>
            <div className="addressContent">
                <div className="title">用户地址:</div>
                <div className="items">
                    {list?.userList.length > 0 ? list?.userList.map((item: any, index: number) => <div key={index} className="item" onClick={() => { navigate('/Someone?address=' + item.userAddress) }}>

                        <Tooltip title={<span style={{ fontWeight: 400, fontSize: "14px", color: "#000000" }}>{item.userAddress}</span>} color="#FFF" key="tips">
                            {item.userAddress}
                        </Tooltip>

                    </div>) : <NoData></NoData>}
                </div>
            </div>
            <div className="line"></div>
            <div className="projectContent">
                <div className="title">项目名字:</div>
                <div className="items">
                    {list?.projectList.length > 0 ? list?.projectList.map((item: any, index: any) => <div key={index} className="item">
                        <img src={item?.img} alt="" />
                        <div className="right">
                            <div className="title">{item?.name}</div>
                            <div className="projectNum">{item?.orderCount ?? 0}个项目</div>
                        </div>
                    </div>) : <NoData></NoData>}
                </div>
            </div>

            <div className="bg1"></div>
            <div className="bg2"></div>
            <div className="bg3"></div>
        </div >
    )
}
