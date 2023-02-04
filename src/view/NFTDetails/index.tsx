

import { useWeb3React } from "@web3-react/core"
import { Menu } from "antd"
import copy from "copy-to-clipboard"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import styled from "styled-components"
import { getNftUserInfoDetail, getUserOrder, getNftOrderState, getOrderByProject, updateUserImage, syncUserNftData } from "../../API"
import { NftInfo } from "../../components/HotspotCard"
import { createAddMessageAction, createSetLodingAction } from "../../store/actions"
import { stateType } from "../../store/reducer"
import { AddrHandle } from "../../utils/tool"
import NFTDetailsL from "./Adaptation/NFTDetailsL"
import NFTDetailsM from "./Adaptation/NFTDetailsM"


const Container = styled.div`
    width: 100%;
`

const L = styled.div`
    width: 100%;
    display: block;
    @media (max-width: 1280px) {
        display: none;
    }
`

const M = styled.div`
    width: 100%;
    display: none;
    @media (max-width: 1280px) {
        display: block;
    }
`

export interface NormalizedMetadataType {
    attributes: []
    image: string
    name: string
    description?: string
}
export interface OrderDetailType {
    name: string,
    nftName: string
    image: string
    description: string
    tokenAddress: string
    isAuthentication: number | null
    tokenId: string
    metadata: {
        [key: string]: string;
    },
    normalizedMetadata: NormalizedMetadataType
    browseNum: number
    giveNum: number
    price: number,
    id: number,
    userAddress: string
}

export default function NFTDetails() {
    const [expand21, setExpand21] = useState(true);
    const dispatch = useDispatch();
    const web3React = useWeb3React()
    const navigate = useNavigate();
    let state = useSelector<stateType, stateType>(state => state);
    const [params] = useSearchParams();
    let { t } = useTranslation();
    let [OrderDetail, setOrderDetail] = useState<OrderDetailType | undefined>(undefined)
    let [attrOrInfo, setAttrOrInfo] = useState<boolean>(true)
    let [showFullScreen, setShowFullScreen] = useState<boolean>(false)
    let [tableData, setTableData] = useState([])
    /* 卖家的其他商品 */
    let [UserOrder, setUserOrder] = useState<NftInfo[]>([])
    let [DynamicState, setDynamicState] = useState(0)
    let [tokenId, setTokenId] = useState('')
    let [projectId, setProjectId] = useState('')
    let [ProjectOrder, setProjectOrder] = useState([])
    let [showSellModal, setShowSellModal] = useState<boolean>(false)
    let ID = params.get('ID')
    let tokenAddress = params.get('tokenAddress')
    let owner_of = params.get('owner_of')
    // 0：出售
    let NFTDetailType = params.get('NFTDetailType')
    console.log(NFTDetailType, "0");

    console.log(owner_of == web3React.account, (owner_of), (web3React.account));
    useEffect(() => {
        if (ID && state.token && tokenAddress) {
            getNftUserInfoDetail(tokenAddress, ID).then(res => {
                setTokenId(res.data.tokenId)
                if (res.data.metadata) {
                    res.data.metadata = JSON.parse(res.data.metadata)
                    let obj: { [key: string]: string; } = {}
                    Object.keys(res.data.metadata).filter((item) => item !== 'image').map((item) => {
                        if (typeof res.data.metadata[item] === 'string') {
                            obj[item] = res.data.metadata[item]
                        }
                    })
                    res.data.metadata = obj
                    res.data.normalizedMetadata = JSON.parse(res.data.normalizedMetadata)
                }
                console.log(res.data, 'NFT详情');
                setOrderDetail(res.data)
                if (state.token) {
                    getUserOrder(res.data.userAddress).then(res => {
                        setUserOrder(res.data)
                    })
                }
            })
        }
    }, [ID, state.token])
    useEffect(() => {
        if (tokenId && OrderDetail && OrderDetail.tokenAddress) {
            getNftOrderState(tokenId, DynamicStateMap[DynamicState].value, OrderDetail.tokenAddress).then(res => {
                // console.log(res,"nft动态")
                setTableData(res.data)
            })
        }
    }, [tokenId, OrderDetail, DynamicState])
    useEffect(() => {
        if (projectId && state.token) {
            // console.log(projectId)
            getOrderByProject(projectId).then(res => {
                setProjectOrder(res.data)
                // console.log(res,"获取系列相关商品")
            })
        }
    }, [projectId, state.token])

    let DynamicStateMap = [
        {
            key: t('Listing'),
            value: 0
        },
        {
            key: t('Sale'),
            value: 1
        },
        {
            key: t('Cancel an order'),
            value: 2
        },
        {
            key: t('Send'),
            value: 3
        }
    ];
    const DynamicStateMenu = (
        <Menu onClick={() => handleDropDown(setExpand21, expand21)}>
            {
                DynamicStateMap.map((item, index) => <Menu.Item key={index} onClick={() => { setDynamicState(index) }}>
                    {item.key}
                </Menu.Item>)
            }
        </Menu>
    );
    const setMenu = (
        <Menu>
            <Menu.Item key="1" onClick={setHead}>
                {t('Use as avatar')}
            </Menu.Item>
            <Menu.Item key="2" onClick={FullScreen}>
                {t('Full screen display')}
            </Menu.Item>
            <Menu.Item key="3" >
                {t('Report')}
            </Menu.Item>
        </Menu>
    );
    // 下拉图标旋转
    const handleDropDown = (fun: any, value: boolean) => {
        fun(!value);
    }
    function copyUserAddr() {
        if (web3React.account) {
            copy(web3React.account as string)
            dispatch(createAddMessageAction(t('Copied')))
        } else {
            dispatch(createAddMessageAction(t('Please connect your wallet')))
        }
    }
    function setHead() {
        updateUserImage(OrderDetail?.tokenId as string).then(res => {
            // console.log("设置头像",res)
            dispatch(createAddMessageAction(t('Set successfully')))
        })
    }
    function FullScreen() {
        setShowFullScreen(true)
    }
    function goProject() {
        if (OrderDetail) {
            if (!OrderDetail.isAuthentication) {
                return dispatch(createAddMessageAction(t('Not certified')))
            }
            navigate('/project?projectName=' + OrderDetail.name)
        }
    }
    function CopyLink() {
        copy(window.location.href)
        dispatch(createAddMessageAction(t('Copy successful')))
    }
    function syncUserNftDataFun() {
        dispatch(createSetLodingAction(true))
        syncUserNftData(web3React.account as string).then(() => { }, () => {
            dispatch(createSetLodingAction(false))
            dispatch(createAddMessageAction(t('Sync failed')))
        })
    }
    function goSomeone(address: string) {
        if (address) {
            navigate('/Someone?address=' + address)
        }
    }
    function goProjectFun(projectName: string, isAuthentication: number | null) {
        if (!isAuthentication) {
            dispatch(createAddMessageAction(t('Not certified')))
        }
        if (projectName && isAuthentication) {
            navigate('/project?projectName=' + projectName)
        }
    }

    return (
        <Container id="NFTDetails">
            <L>
                <NFTDetailsL OrderDetail={OrderDetail} CopyLink={CopyLink} attrOrInfo={attrOrInfo} NFTTypeDetail={NFTDetailType} />
            </L>
            <M>
                <NFTDetailsM OrderDetail={OrderDetail} CopyLink={CopyLink} attrOrInfo={attrOrInfo} />
            </M>
        </Container>
    )
}
