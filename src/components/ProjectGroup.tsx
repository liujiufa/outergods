


import React, { Fragment } from 'react'
import styled from 'styled-components'

import { FlexCCBox } from './FlexBox'

import NFT1Png from '../assets/image/4.png'
import AuthenticationPng from '../assets/image/authentication.svg'
import NotAuthenticationPng from '../assets/image/NotCertified.svg'
import { decimalNum } from '../utils/decimalNum'
import { useNavigate } from 'react-router-dom'

const Container = styled(FlexCCBox)`
    width: 100%;
    background: #FFFFFF;
    box-shadow: 7px 9px 12px rgba(198, 207, 231, 0.4);
    padding: 16px;
    border-radius: 14px;
    @media (max-width: 750px) {
        padding: 6px;
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
    width: 65%;
    margin-right: 6px;
    @media (max-width: 750px) {
        margin-right: 4px;
    }
`

const NFTImg = styled.img`
    width: 100%;
    border-radius: 8px;
    aspect-ratio: 1;
    object-fit: contain; 
    // padding-top: 1%;
`

const NFTImg1 = styled(NFTImg)`
    margin-top: 6px;
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
            margin-top: 32px;
        }
    }
`

const NFTName = styled(FlexCCBox)`
    font-weight: 700;
    font-size: 16px;
    color: #000000;
    margin-top: 20%;
    width:100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; 
    justify-content: start;
    @media (max-width: 750px) {
        margin-top: 32px;
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
    console.log(data)
    const navigate = useNavigate()
    return (
        <Fragment>
            {
                !!data ? <Container onClick={() => {
                    if (data?.tokenAddress) {
                        navigate('/Launch?tokenAddress=' + data?.tokenAddress)
                    }
                }}>
                    <Content>
                        <Group>
                            <NFTLeft>
                                {data?.imgUrl1 !== "null" ? <NFTImg src={data?.imgUrl1 || NFT1Png} /> : <NFTImg src={NFT1Png} />}
                            </NFTLeft>
                            <NFTRight>
                                {data?.imgUrl2 !== "null" ? <NFTImg src={data?.imgUrl2 || NFT1Png} /> : <NFTImg src={NFT1Png} />}
                                {data?.imgUrl3 !== "null" ? <NFTImg1 src={data?.imgUrl3 || NFT1Png} /> : <NFTImg src={NFT1Png} />}
                            </NFTRight>
                            <NFTImgGroup> <NFTImg src={data?.img || NFT1Png} /> </NFTImgGroup>
                        </Group>
                        <Group>
                            <NFTName >{data.name}</NFTName>
                            <AuthenticationGroup src={data?.isAuthentication === 0 ? NotAuthenticationPng : AuthenticationPng} />
                        </Group>
                        <GroupPrice>
                            <PriceItem>
                                <PriceContent>
                                    <PriceAmount>${decimalNum(data?.floorPrice, 4)}</PriceAmount>
                                    <PriceTitle>地板价</PriceTitle>
                                </PriceContent>
                            </PriceItem>
                            <PriceItem>
                                <PriceContent>
                                    <PriceAmount>${decimalNum(data?.tradeAmount, 2) ?? 0}</PriceAmount>
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
                            <NFTImgGroup> <NFTImg src={data?.img || NFT1Png} /> </NFTImgGroup>
                        </Group>
                        <Group>
                            <NFTName>Collection</NFTName>
                            <AuthenticationGroup src={NotAuthenticationPng} />
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
