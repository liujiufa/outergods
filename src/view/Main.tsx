

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import BgPng from '../assets/image/main/bg.png'
import Bg1Png from '../assets/image/main/bg1.png'
import Bg2Png from '../assets/image/main/bg2.png'
import SellPng from '../assets/image/main/sell.png'

import openIcon from '../assets/image/openIconWhite.png'
import NFT1Png from '../assets/image/nftGroup/nft1.png'
import NFTPng from '../assets/image/nft.png'

import styled from "styled-components"
import { FlexCCBox, FlexSBCBox, FlexSCBox } from "../components/FlexBox";
import { useState } from "react";
import { Menu, Dropdown } from "antd";
import ProjectGroup from "../components/ProjectGroup";
import Goods from '../components/HotspotCard'

const Container = styled.div`
    width: 100%;
    background: #F5F5F5;
    position: relative;
    top: 0;
    left: 0;
`

const NFTContent = styled.div`
    width: 100%;
    padding: 0 8%;
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
    .swiper-slide-active,.swiper-slide-duplicate-active{
        transform: scale(0.98) !important;
	}
`

const SlideItemPC = styled(SwiperSlide)<{idx: number}>`
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
	transform: ${({idx})=> `scale(${idx}) !important`};
	/* transform: scale(0.7) !important; */
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
    span {
        color: #7C8FFB;
        font-weight: 700;
        font-size: 40px;
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
`

const TipsGroup = styled(FlexSBCBox)`
    width: 80%;
    margin-top: 60px;
    background: #FFFFFF;
    box-shadow: 15px 3px 82px rgba(198, 207, 231, 0.45);
    border-radius: 126px;
    padding: 16px 32px;
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
`

const TipsGroupTime = styled(FlexCCBox)`
    font-weight: 400;
    font-size: 18px;
    color: #000000;
`

const NFTTitle = styled(FlexCCBox)`
    font-weight: 700;
    font-size: 32px;
    /* identical to box height */
    color: #000000;
    margin-top: 60px;
`

const NFTViceTitle = styled(FlexCCBox)`
    font-weight: 400;
    font-size: 16px;
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
    margin-top: 16px;
`

const GroupMenu = styled(FlexCCBox)`
    justify-content: flex-end;
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
`

const SearchBox = styled(FlexCCBox)`
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 3px;
`

const GroupProject = styled(Group)`
    width: 100%;
    flex-flow: row wrap;
    justify-content: start;
    margin: 24px auto 0;
`

const GroupItem = styled(FlexCCBox)`
    width: 16.6%;
    padding: 16px;
`


const UserList = styled(Group)`
    width: 100%;
    flex-flow: row wrap;
    justify-content: start;
    margin: 24px auto 0;
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
`

const OtherContent = styled.div`
    width: 100%;
    background: #FFFFFF;
    box-shadow: 52px 53px 141px rgba(182, 195, 228, 0.4);
    border-radius: 20px;
    overflow-y: hidden;
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
`


export default function Main() {

    const [nftIdo, setNftIdo] = useState<any[]>([BgPng, Bg1Png, Bg2Png, BgPng, Bg1Png, BgPng, Bg2Png])
    const [expand1, setExpand1] = useState(true)
    const [activeIndex, setActiveIndex] = useState(0)

    const handleDropDown = (fun: any, value: boolean) => {
        fun(!value);
    }
    const typeMenu = (
        <Menu onClick={() => handleDropDown(setExpand1, expand1)}>
            <Menu.Item>全部</Menu.Item>
        </Menu>
    );
    return (
        <Container>

            <SwiperPC >

                {
                    !!nftIdo.length && <SwiperBoxPC
                        slidesPerView={7}
                        spaceBetween={30}
                        centeredSlides={true}
                        loop={true}
                        loopFillGroupWithBlank={true}
                        className="mySwiper"
                        id="swiper-nft-pc"
                        // slideToClickedSlide
                        onSlideChangeTransitionEnd={(s) => {
                            console.log("s", s)
                        }}
                        onTouchEnd={(swiper) =>{
                            console.log("swiper",swiper)
                            setActiveIndex(swiper.activeIndex % nftIdo.length)
                        }}
                    >
                        {
                            nftIdo.map((item, idx) => <SlideItemPC idx={1- Math.abs((idx - activeIndex)) / nftIdo.length} onClick={(event) => {
                                console.log("item", item, event, idx)
                            }} >
                                <SliderContainer >
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
                        XXX是<span>WEB3</span>的NFT市场，欢迎来进行交易和收藏
                    </Title>
                    <Group>
                        <SellBox >出售</SellBox>
                    </Group>
                    <Group>
                        <TipsGroup>
                            <TipsGroupLeft>
                                <TipsGroupType>SALE</TipsGroupType>
                                <TipsGroupText><span>xxxx</span>以<span className="num">0.07BNB</span>的价格从<span>0xhdggg...hhfg</span> <span className="type">出售给</span> <span>0hhbj...sdhi</span></TipsGroupText>
                            </TipsGroupLeft>
                            <TipsGroupTime>一个小时前</TipsGroupTime>
                        </TipsGroup>
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
                    <GroupProject>
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8].map((item) => <GroupItem>
                                <ProjectGroup />
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
                    <GroupProject>
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8].map((item) => <GroupItem>
                                <Goods />
                            </GroupItem>)
                        }
                    </GroupProject>
                    <Group>
                        <NFTTitle>最佳卖家</NFTTitle>
                    </Group>
                    <UserList>
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8].map((item) => <UserItem>
                                <UserContent >
                                    <UserImg src={NFT1Png} />
                                    <UserName>Otto</UserName>
                                    <UserAmount>156 ETH</UserAmount>
                                </UserContent>
                            </UserItem>)
                        }
                    </UserList>

                    <Group>
                        <NFTTitle>最新</NFTTitle>
                    </Group>
                    <GroupProject>
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8].map((item) => <GroupItem>
                                <Goods />
                            </GroupItem>)
                        }
                    </GroupProject>
                    <Group>
                        <NFTTitle>入门</NFTTitle>
                    </Group>
                    <Group>
                        <NFTViceTitle>了解基础知识</NFTViceTitle>
                    </Group>
                    <UserList>
                        {
                            [1, 2, 3, 4].map((item) => <OtherItem>
                                <OtherContent>
                                    <OtherImg src={NFTPng} />
                                    <OtherText >什么是NFT？</OtherText>
                                </OtherContent>
                            </OtherItem>)
                        }
                    </UserList>
                </NFTContent>

            </Group>
            <Bg1 />
            <Bg2 />
            <Bg3 />
            <Bg4 />
        </Container>

    )
}
