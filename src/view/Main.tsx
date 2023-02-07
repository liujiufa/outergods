

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import BgPng from '../assets/image/main/bg.png'
import Bg1Png from '../assets/image/main/bg1.png'
import Bg2Png from '../assets/image/main/bg2.png'
import SellPng from '../assets/image/main/sell.png'
import openIcon from '../assets/image/openIconWhite.png'
import NFT1Png from '../assets/image/nftGroup/nft1.png'
import NFTPng from '../assets/image/nft.png'
import BuyNftPng from '../assets/image/buynft.png'
import EncryWalletPng from '../assets/image/encryWallet.png'
import GasPng from '../assets/image/gas.png'


import styled from "styled-components"
import { FlexCCBox, FlexSBCBox, FlexSCBox } from "../components/FlexBox";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Menu, Dropdown } from "antd";
import ProjectGroup from "../components/ProjectGroup";
import TransactionTips from '../components/TransactionTips'
import Goods from '../components/HotspotCard'

import '../assets/style/Main.scss'
import { getBestSellerNft, getHoTProject, getTradeLast } from "../API";


const Container = styled.div`
    width: 100%;
    position: relative;
    top: 0;
    left: 0;
    overflow: hidden;
    padding-bottom: 80px;
    background-color: #F5F5F5;
    @media (max-width: 750px) {
        padding-bottom: 12px;
    }
`

const Bg = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -2;
    background: #F5F5F5;
`

const NFTContent = styled.div`
    width: 100%;
    padding: 0 8%;
    @media (max-width: 1080px) {
        padding: 0 8px;
    }
`


const Group = styled(FlexCCBox)`
    width: 100%;
`


const TitleGroup = styled(FlexCCBox)`
    width: 100%;
`


const Item = styled(TitleGroup)`
    margin-top: 4vw;
`

const SwiperPC = styled(Item)`
    display: flex;
    width: 100%;
`

const SwiperBoxPC = styled(Swiper)`
    display: flex;
    width: 100%;
`

const SlideItemPC = styled(SwiperSlide) <{ idx: number, posi: number }>`
    text-align: center;
    font-size: 18px;
    display: block;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
	transition: 300ms;
	/* transform: ${({ idx, posi }) => `translateX(${posi}px) !important`}; */
    background: #FFFFFF;
    border-radius: 12px;
    font-size: 24px;
    color: #000000;
    cursor: pointer;
`

const SliderContainer = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 12px;
    @media (max-width: 750px) {
		padding: 8px 6px;
    }
    img {
        width: 100%;
        border-radius: 12px;
    }
`

const Title = styled(FlexCCBox)`
    margin-top: 60px;
    width: 100%;
    font-weight: 700;
    font-size: 40px;
    color: rgba(0, 0, 0, 0.6);
    font-family: 'PingFang SC Bold';

    span {
        color: #7C8FFB;
        font-weight: 700;
        font-size: 40px;
    }
    @media (max-width: 750px) {
        font-size: 16px;
        span {
            font-size: 16px;
        }
    }
`

const SellBox = styled(FlexCCBox)`
    background-image: url(${SellPng});
    background-size: 100% 100%;
    margin-top: 40px;
    width: 240px;
    height: 56px;
    font-weight: 700;
    font-size: 28px;
    color: #FFFFFF;
    text-shadow: 2px 4px 0px #00097E;
    padding-bottom: 12px;
    @media (max-width: 750px) {
        width: 120px;
        height: 28px;
        font-size: 14px;
        text-shadow: 1px 2px 0px #00097E;
        padding-bottom: 6px;
    }
`

const TipsGroup = styled(FlexSBCBox)`
    width: 80%;
    margin-top: 60px;
    background: #FFFFFF;
    box-shadow: 15px 3px 82px rgba(198, 207, 231, 0.45);
    border-radius: 126px;
    padding: 16px 32px;
    @media (max-width: 750px) {
        margin-top: 24px;
        width: 96%;
        padding: 4px 8px;
        border-radius: 24px;
        box-shadow: 4px 3px 21px rgba(198, 207, 231, 0.45);
        zoom: 0.92;
    }
`

const TipsGroupLeft = styled(FlexSCBox)`
`

const TipsGroupType = styled(FlexCCBox)`
    border: 1px solid #4381FF;
    border-radius: 27px;
    font-weight: 400;
    font-size: 20px;
    /* identical to box height */
    color: #4381FF;
    padding:  4px 16px;
    margin-right: 24px;
    @media (max-width: 750px) {
        padding: 2px 8px;
        font-size: 12px;
        zoom: 0.87;
        margin-right: 8px;
    }
`

const TipsGroupText = styled(FlexCCBox)`
    font-weight: 400;
    font-size: 16px;
    color: rgba(0, 0, 0, .6);
    & span {
        color: #000;
        font-weight: 400;
        font-size: 16px;
    };
    & .num {
        color: #7C8FFB;
        font-weight: 400;
        font-size: 16px;
    };
    & .type {
        color: #F62222;
        font-weight: 400;
        font-size: 16px;
    };

    @media (max-width: 750px) {
        &, & span, & .num, & .type {
            font-size: 12px;
            zoom: 0.87;
        }
    }
`

const TipsGroupTime = styled(FlexCCBox)`
    font-weight: 400;
    font-size: 18px;
    color: #000000;
    @media (max-width: 750px) {
        font-size: 12px;
    }
`

const NFTTitle = styled(FlexCCBox)`
    font-weight: 700;
    font-size: 32px;
    /* identical to box height */
    color: #000000;
    margin-top: 60px;
    @media (max-width: 750px) {
        font-size: 20px;
        margin: 16px 0 8px;
    }
`

const NFTViceTitle = styled(FlexCCBox)`
    font-weight: 400;
    font-size: 16px;
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
    margin-top: 16px;
    @media (max-width: 750px) {
        font-size: 14px;
        margin: 0 0 8px;
    }
`

const GroupMenu = styled(FlexCCBox)`
    justify-content: flex-end;
    padding: 0 12px;
`

const SearchGroup = styled(FlexSBCBox)`
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #788CFF;
    margin-left: 30px;
    width: 120px;
    height: 36px;
    border: 1px solid #788CFF;
    box-sizing: border-box;
    border-radius: 18px;
    padding: 6px 15px;
    @media (max-width: 750px) {
        width: 80px;
        padding: 4px 8px;
        margin-left: 12px;
    }
`

const SearchBox = styled(FlexCCBox)`
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 3px;
    @media (max-width: 750px) {
        font-size: 12px;
    }
`

const GroupProject = styled(FlexSCBox)`
    width: 100%;
    margin: 24px auto 0;
    overflow: auto;
    padding: 12px;
    @media (max-width: 750px) {
        margin: 0 auto;
    }
`

const GroupItem = styled(FlexCCBox)`
    width: 16.6%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    min-width: 200px;
    border-radius: 12px;
    background-color: transparent;
    @media (max-width: 750px) {
        min-width: 178px;
        padding: 6px;
    }
`

const UserList = styled(Group)`
    width: 100%;
    /* flex-flow: row wrap; */
    justify-content: start;
    margin: 24px auto 0;
    @media (max-width: 750px) {
        margin: 0 auto;
    }
`

const OtherList = styled(UserList)`
    width: 100%;
    overflow: auto;
    justify-content: start;
    margin: 24px auto 0;
    @media (max-width: 750px) {
        margin: 0 auto;
        padding-bottom: 24px;
    }
`


const UserItem = styled(Group)`
    width: 12.5%;
    padding: 12px;
`

const UserContent = styled.div`
    width: 100%;
`

const UserImg = styled.img`
    width: 100%;
    border-radius: 15px;
`

const UserName = styled(Group)`
    margin-top: 10px;
    font-weight: 700;
    font-size: 18px;
    color: #000000;
`

const UserAmount = styled(Group)`
    font-weight: 400;
    font-size: 14px;
    color: #000000;
`

const OtherItem = styled(FlexCCBox)`
    width: 25%;
    padding: 24px;
    @media (max-width: 750px) {
        width: 50%;
        padding: 8px;
        min-width: 50vw;
    }
`

const OtherContent = styled.div`
    width: 100%;
    background: #FFFFFF;
    box-shadow: 52px 53px 141px rgba(182, 195, 228, 0.4);
    border-radius: 20px;
    overflow-y: hidden;
    @media (max-width: 750px) {
        border-radius: 8px;
        box-shadow: 13px 12px 30px rgba(182, 195, 228, 0.4);
    }
`

const OtherImg = styled.img`
    width: 100%;
`

const OtherText = styled(FlexSCBox)`
    width: 100%;
    padding: 20px;
    font-weight: 700;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.7);
    @media (max-width: 750px) {
        font-size: 12px;
        zoom: 0.87;
        padding: 4px;
    }
`

const Bg1 = styled.div`
    position: absolute;
    top: 100px;
    left: 0;
    background: linear-gradient(123.43deg, rgba(250, 177, 177, 0.3) 14.61%, rgba(194, 177, 255, 0.3) 35.53%, rgba(109, 131, 255, 0.18) 53.83%, rgba(56, 255, 243, 0.249) 80.12%);
    filter: blur(175.782px);
    width: 50vw;
    height: 50vw;
    transform: translateX(-20vw);
    z-index: -1;
`

const Bg2 = styled.div`
    position: absolute;
    top: 500px;
    right: 0;
    background: linear-gradient(233.91deg, rgba(177, 248, 250, 0.25) 9.69%, rgba(194, 177, 255, 0.25) 38.49%, rgba(109, 131, 255, 0.15) 68.83%, rgba(56, 255, 243, 0.2075) 83.42%);
    filter: blur(159.116px);
    width: 50vw;
    height: 50vw;
    transform: translateX(20vw);
    z-index: -1;
`

const Bg3 = styled.div`
    position: absolute;
    top: 1500px;
    left: 0;
    background: linear-gradient(233.91deg, rgba(177, 248, 250, 0.25) 9.69%, rgba(194, 177, 255, 0.25) 38.49%, rgba(109, 131, 255, 0.15) 68.83%, rgba(56, 255, 243, 0.2075) 83.42%);
    filter: blur(159.116px);
    width: 50vw;
    height: 50vw;
    transform: translateX(-20vw);
    z-index: -1;
`

const Bg4 = styled.div`
    position: absolute;
    bottom: 50px;
    left: 50%;
    background: linear-gradient(233.91deg, rgba(177, 248, 250, 0.25) 9.69%, rgba(194, 177, 255, 0.25) 38.49%, rgba(109, 131, 255, 0.15) 68.83%, rgba(56, 255, 243, 0.2075) 83.42%);
    filter: blur(159.116px);
    width: 80vw;
    height: 80vw;
    transform: translateX(-50%);
    z-index: -1;
`


export default function Main() {

    const [nftIdo, setNftIdo] = useState<any[]>([BgPng, Bg1Png, Bg2Png, BgPng, Bg1Png, BgPng, Bg2Png])
    const [expand1, setExpand1] = useState(true)
    const [activeIndex, setActiveIndex] = useState(0)
    const [idxGroup, setIdxGroup] = useState<{ index: number; posi: number; }[]>([])
    const [hostList, setHostList] = useState<any[]>([0, 0, 0, 0, 0, 0,])
    const [tradeList, setTradeList] = useState<any[]>([0, 0, 0, 0, 0, 0,])
    const [bestSellerNftList, setBestSellerNftList] = useState<any[]>([0, 0, 0, 0, 0, 0,])
    
    const handleDropDown = (fun: any, value: boolean) => {
        fun(!value);
    }

    const typeMenu = (
        <Menu onClick={() => handleDropDown(setExpand1, expand1)}>
            <Menu.Item>全部</Menu.Item>
        </Menu>
    );

    useEffect(() => {

        const list = nftIdo.map((item, idx) => idx)

        const activeIdx = list.findIndex(item => item === activeIndex)

        const findIndex = (activeIdx + 1) === list.length ? 0 : activeIdx

        let listLeft = list.filter((item, idx) => findIndex < idx)
        let listRight = list.filter((item, idx) => findIndex > idx)

        const listGroup = listLeft.concat(listRight);

        listLeft = listGroup.slice(0, 3)
        listRight = listGroup.slice(3).reverse()

        const idxGroup1 = listLeft.map((item, idx) => {
            return ({
                index: item,
                posi: idx + 1
            })
        })

        const idxGroup2 = listRight.map((item, idx) => {
            return ({
                index: item,
                posi: -(idx + 1)
            })
        })

        const idxGroup = idxGroup1.concat(idxGroup2)
        setIdxGroup(idxGroup)
    }, [nftIdo, activeIndex])

    const init = useCallback(
        async () => {
            Promise.all([getHoTProject()]).then((res) => {
                const [res1] = res
                const [hostProject] = [res1.data]
                const hList = hostProject.slice(0, 5)
                const hL = [0, 0, 0, 0, 0].map((item, idx)=> hList[idx] || item)
                setHostList([0, ...hL])
            })
            Promise.all([getTradeLast()]).then((res) => {
                const [res1] = res
                const [tradeLast] = [res1.data]
                setTradeList(tradeLast.slice(0,  6))
            })
            Promise.all([getBestSellerNft()]).then((res) => {
                const [res1] = res
                console.log("res1", res1)
                const [bestSellerNft] = [res1.data]
                console.log("bestSellerNft", bestSellerNft)
                setBestSellerNftList([0, bestSellerNft[0], bestSellerNft[0], 0, 0,  0])
            })
            
        },
        []
    )



    useEffect(() => {
        init()
    }, [])

    const otherList = [{
        text: "什么是NFT？",
        img: NFTPng
    },{
        text: "如何购买NFT？",
        img: BuyNftPng
    },{
        text: "什么是加密钱包？",
        img: EncryWalletPng
    },
    {
        text: "区块链gas费是什么？",
        img: GasPng
    }]

    return (
        <Container>
            <SwiperPC >
                {
                    !!nftIdo.length && <SwiperBoxPC
                        slidesPerView={7}
                        spaceBetween={8}
                        centeredSlides={true}
                        loop={true}
                        loopFillGroupWithBlank={true}
                        className="mySwiper"
                        id="swiper-nft-pc"
                        // slideToClickedSlide
                        onSlideChangeTransitionEnd={(swiper) => {
                            setActiveIndex(swiper.activeIndex % nftIdo.length)
                        }}
                        onTouchEnd={(swiper) => {
                            console.log("swiper", swiper.activeIndex)
                        }}
                    >
                        {
                            nftIdo.map((item, idx) => <SlideItemPC
                                idx={
                                    //    0.5 + Math.abs(idxGroup.filter(option=> option.index === idx)[0]?.posi ?? 8 )  / 16
                                    idxGroup.filter(option => option.index === idx)[0]?.posi ?? 0
                                }
                                posi={
                                    !idxGroup.filter(option => option.index === idx)[0]?.posi ? 0 : (
                                        idxGroup.filter(option => option.index === idx)[0]?.posi > 0 ? ((1 - idxGroup.filter(option => option.index === idx)[0]?.posi) * 50) :
                                            ((1 + idxGroup.filter(option => option.index === idx)[0]?.posi) * 50)
                                    )
                                }
                                onClick={(event) => {
                                    console.log("IDX", idx, activeIndex)
                                }} >
                                <SliderContainer >
                                    {idx}
                                    <img src={item} />
                                </SliderContainer>
                            </SlideItemPC>)
                        }
                    </SwiperBoxPC>
                }
            </SwiperPC>
            <Group>
                <NFTContent>
                    <Title>
                        <span>HABITAT</span>-面向<span>WEB3</span>的NFT交易创新平台
                    </Title>
                    <Group>
                        <SellBox >出售</SellBox>
                    </Group>
                    <Group>
                        {/* <TipsGroup>
                            <TipsGroupLeft>
                                <TipsGroupType>SALE</TipsGroupType>
                                <TipsGroupText><span>xxxx</span>以<span className="num">0.07BNB</span>的价格从<span>0xhdggg...hhfg</span> <span className="type">出售给</span> <span>0hhbj...sdhi</span></TipsGroupText>
                            </TipsGroupLeft>
                            <TipsGroupTime>一个小时前</TipsGroupTime>
                        </TipsGroup> 
                        */}
                        <TransactionTips></TransactionTips>
                    </Group>
                    <Group>
                        <NFTTitle>热门项目</NFTTitle>
                    </Group>
                    <GroupMenu>
                        <Dropdown overlay={typeMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand1, expand1)}>
                            <SearchGroup>
                                <SearchBox >24小时</SearchBox>
                                <img className={expand1 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                            </SearchGroup>
                        </Dropdown>
                        <Dropdown overlay={typeMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand1, expand1)}>
                            <SearchGroup>
                                <SearchBox >查看全部</SearchBox>
                                <img className={expand1 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                            </SearchGroup>
                        </Dropdown>
                    </GroupMenu>
                    <GroupProject
                    >
                        {
                            hostList.map((item) => <GroupItem>
                                <ProjectGroup data={item} />
                            </GroupItem>)
                        }
                    </GroupProject>
                    <Group>
                        <NFTTitle>畅销NFT</NFTTitle>
                    </Group>
                    <Group>
                        <NFTViceTitle>热门转手的NFT</NFTViceTitle>
                    </Group>
                    <GroupMenu>
                        <Dropdown overlay={typeMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand1, expand1)}>
                            <SearchGroup>
                                <SearchBox >24小时</SearchBox>
                                <img className={expand1 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                            </SearchGroup>
                        </Dropdown>
                        <Dropdown overlay={typeMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand1, expand1)}>
                            <SearchGroup>
                                <SearchBox >查看全部</SearchBox>
                                <img className={expand1 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
                            </SearchGroup>
                        </Dropdown>
                    </GroupMenu>
                    <GroupProject
                    >
                        {
                            bestSellerNftList.map((item) => <GroupItem>
                                {
                                    !!item ? <Goods NftInfo={{ ...item, priceJson: JSON.parse(item.priceJson || JSON.stringify("")), uprice: item.uorderPrice, metadata: JSON.parse(item.metaData || JSON.stringify("")) }} /> : <Goods />
                                }
                            </GroupItem>)
                        }
                    </GroupProject>
                    <div style={{ display: "none" }}>
                        <Group>
                            <NFTTitle>最佳卖家</NFTTitle>
                        </Group>
                        <UserList>
                            {
                                [1, 2, 3, 4, 5, 6].map((item) => <UserItem>
                                    <UserContent >
                                        <UserImg src={NFT1Png} />
                                        <UserName>Otto</UserName>
                                        <UserAmount>156 ETH</UserAmount>
                                    </UserContent>
                                </UserItem>)
                            }
                        </UserList>
                    </div>

                    <Group>
                        <NFTTitle>最新</NFTTitle>
                    </Group>
                    <GroupProject
                    >
                        {
                            tradeList.map((item) => <GroupItem>
                                {
                                    !!item ? <Goods NftInfo={{ ...item, uprice: item.uorderPrice, metadata: JSON.parse(item.metaData || JSON.stringify("")) }} /> : <Goods />
                                }
                            </GroupItem>)
                        }
                    </GroupProject>
                    <Group>
                        <NFTTitle>入门</NFTTitle>
                    </Group>
                    <Group>
                        <NFTViceTitle>了解基础知识</NFTViceTitle>
                    </Group>
                    <OtherList >
                        {
                            otherList.map((item) => <OtherItem>
                                <OtherContent>
                                    <OtherImg src={item.img} />
                                    <OtherText >{item.text}</OtherText>
                                </OtherContent>
                            </OtherItem>)
                        }
                    </OtherList>
                </NFTContent>

            </Group>
            <Bg />
            <Bg1 />
            <Bg2 />
            <Bg3 />
            <Bg4 />
        </Container >

    )
}
