


import React, { Fragment } from 'react'
import styled from 'styled-components'

import { FlexCCBox } from './FlexBox'

import NFT1Png from '../assets/image/nftGroup/nft1.png'
import AuthenticationPng from '../assets/image/nftGroup/authentication.png'
import { decimalNum } from '../utils/decimalNum'


const Container = styled(FlexCCBox)`
    width: 100%;
    background: #FFFFFF;
    box-shadow: 20px 22.2995px 107px rgba(198, 207, 231, 0.4);
    padding: 16px;
    border-radius: 16px;
    @media (max-width: 750px) {
        padding: 4px;
    }
`

const Group = styled(FlexCCBox)`
    width: 100%;
    position: relative;
    top: 0;
    left: 0;
`

const Content = styled.div`
    width: 100%;
`

const NFTLeft = styled(FlexCCBox)`
    width: 64%;
    margin-right: 12px;
    @media (max-width: 750px) {
        margin-right: 4px;
    }
`

const NFTImg = styled.img`
    width: 100%;
`

const NFTImg1 = styled(NFTImg)`
    margin-top: 12px;
    @media (max-width: 750px) {
        margin-top: 2px;
    }
`

const NFTRight = styled.div`
    flex: 1;
`

const NFTImgGroup = styled(FlexCCBox)`
    width: 40%;
    border: 4px solid #FFFFFF;
    filter: drop-shadow(5px 4px 37px rgba(179, 193, 220, 0.4));
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    border-radius: 50%;
    overflow: hidden;
    @media (max-width: 750px) {
        border: 2px solid #FFFFFF;
    }
`

const AuthenticationGroup = styled.img`
    #root & {
        width: 16px;
        height: 18px;
        margin-left: 12px;
        border-radius: 50%;    
        margin-top: 20%;
        @media (max-width: 750px) {
            margin-left: 4px;
            margin-top: 24px;
        }
    }
`

const NFTName = styled(FlexCCBox)`
    font-weight: 700;
    font-size: 16px;
    color: #000000;
    margin-top: 20%;
    @media (max-width: 750px) {
        margin-top: 24px;
    }
`

const GroupPrice = styled(Group)`
    width: 100%;
    justify-content: space-between;
    margin-top: 8px;
    text-align: center;
`

const PriceItem = styled(FlexCCBox)`
    flex: 1;
`

const PriceContent = styled.div`
    width: 100%;
`

const PriceAmount = styled.div`
    width: 100%;
    font-weight: 700;
    font-size: 18px;
    color: #788CFF;
    @media (max-width: 750px) {
        font-size: 12px;
    }
`

const PriceTitle = styled.div`
    width: 100%;
    margin-top: 12px;
    font-weight: 700;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
    @media (max-width: 750px) {
        margin-top: 0;
        zoom: 0.87;
        margin-top: 4px;
    }
`

export default function ProjectGroup({
    data
}: any) {
    return (
        <Fragment>
            {
                !!data ? <Container>
                    <Content>
                        <Group>
                            <NFTLeft>
                                <NFTImg src={NFT1Png} />
                            </NFTLeft>
                            <NFTRight>
                                <NFTImg src={NFT1Png} />
                                <NFTImg1 src={NFT1Png} />
                            </NFTRight>
                            <NFTImgGroup> <NFTImg src={NFT1Png} /> </NFTImgGroup>
                        </Group>
                        <Group>
                            <NFTName>{data.name}</NFTName>
                            <AuthenticationGroup src={AuthenticationPng} />
                        </Group>
                        <GroupPrice>
                            <PriceItem>
                                <PriceContent>
                                    <PriceAmount>${decimalNum(data?.floorPriceDouble, 4)}</PriceAmount>
                                    <PriceTitle>地板价</PriceTitle>
                                </PriceContent>
                            </PriceItem>
                            <PriceItem>
                                <PriceContent>
                                    <PriceAmount>{data?.tradeNum ?? 0}</PriceAmount>
                                    <PriceTitle>交易量</PriceTitle>
                                </PriceContent>
                            </PriceItem>
                        </GroupPrice>
                    </Content>
                </Container> : <Container>
                    <Content>
                        <Group>
                            <NFTLeft>
                                <NFTImg src={NFT1Png} />
                            </NFTLeft>
                            <NFTRight>
                                <NFTImg src={NFT1Png} />
                                <NFTImg1 src={NFT1Png} />
                            </NFTRight>
                            <NFTImgGroup> <NFTImg src={NFT1Png} /> </NFTImgGroup>
                        </Group>
                        <Group>
                            <NFTName>Collection</NFTName>
                            <AuthenticationGroup src={AuthenticationPng} />
                        </Group>
                        <GroupPrice>
                            <PriceItem>
                                <PriceContent>
                                    <PriceAmount>$404</PriceAmount>
                                    <PriceTitle>地板价</PriceTitle>
                                </PriceContent>
                            </PriceItem><PriceItem>

                                <PriceContent>
                                    <PriceAmount>404</PriceAmount>
                                    <PriceTitle>交易量</PriceTitle>
                                </PriceContent>
                            </PriceItem>
                        </GroupPrice>
                    </Content>
                </Container>
            }
        </Fragment>
    )
}
