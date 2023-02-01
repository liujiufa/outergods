

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import BgPng from '../assets/image/main/bg.png'
import Bg1Png from '../assets/image/main/bg1.png'
import Bg2Png from '../assets/image/main/bg2.png'
import SellPng from '../assets/image/main/sell.png'


import styled from "styled-components"
import { FlexCCBox, FlexSBCBox, FlexSCBox } from "../components/FlexBox";
import { useState } from "react";

const Container = styled.div`
    width: 100%;
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

const SlideItemPC = styled(SwiperSlide)`
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
	transform: scale(0.7) !important;
    background: #FFFFFF;
    border-radius: 12px;
    font-size: 24px;
    color: #000000;
    cursor: pointer;
    
    width: 600px !important;
    height: 600px !important;
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



export default function Main() {

    const [nftIdo, setNftIdo] = useState<any[]>([BgPng, Bg1Png, Bg2Png, BgPng, Bg1Png, BgPng, Bg2Png])


    return (
        <Container>

            <SwiperPC >

                {
                    !!nftIdo.length && <SwiperBoxPC
                        slidesPerView={3}
                        spaceBetween={30}
                        centeredSlides={true}
                        loop={true}
                        loopFillGroupWithBlank={true}
                        className="mySwiper"
                        id="swiper-nft-pc"
                        slideToClickedSlide
                        onSlideChangeTransitionEnd={(s) => {
                            console.log("s", s)
                        }}
                    >
                        {
                            nftIdo.map((item, idx) => <SlideItemPC onClick={() => {
                                console.log("idx", idx)
                            }} >
                                <SliderContainer >
                                    <img src={item} />
                                </SliderContainer>
                            </SlideItemPC>)
                        }
                    </SwiperBoxPC>
                }
            </SwiperPC>
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
        </Container>

    )
}
