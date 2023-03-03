import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import '../assets/style/componentStyle/SearchResult.scss'
export default function SearchRusult(props: any) {
    console.log(props.data);

    let { t, i18n } = useTranslation()
    const navigate = useNavigate()
    function goSomeone(address: string) {
        console.log(address, "用户地址");
        navigate('/Someone?address=' + address)
    }
    function goProject(tokenAddress: string) {
        navigate('/Launch?tokenAddress=' + tokenAddress)
    }
    return (
        <>
            {
                (props.data?.userList?.length !== 0 || props.data?.projectList?.length !== 0) && <div className="searchResult">
                    <div className="LabelRow">{t('User')}</div>
                    <div className="items">
                        {
                            props.data?.userList?.map((item: any, index: any) => <div key={index} className="resItem" onClick={() => { goSomeone(item.userAddress) }} >
                                <div className="radius"><img src={item.headImg} alt="" /></div>
                                {item.userAddress}
                            </div>)
                        }
                    </div>
                    <div className="LabelRow">{t('Project')}</div>
                    <div className="items">
                        {
                            props.data?.projectList?.map((item: any, index: any) => <div key={index} className="resItem" onClick={() => { goProject(item.tokenAddress) }}>
                                <div className="radius"><img src={item.img} alt="" /></div>
                                {item.name}
                            </div>)
                        }
                    </div>
                </div>
            }
        </>
    )
}
