


import React from 'react'
import styled from 'styled-components'

import { FlexCCBox } from './FlexBox'

import NFT1Png from '../assets/image/nftGroup/nft1.png'
import AuthenticationPng from '../assets/image/nftGroup/authentication.png'


const Container = styled(FlexCCBox)`
    width: 100%;
    padding: 18px;
    background: #FFFFFF;
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
`

const NFTImg = styled.img`
    width: 100%;
`

const NFTRight = styled.div`
    flex: 1;
`

const NFTImgGroup = styled(FlexCCBox)`
    width: 84px;
    height: 84px;
    border: 4px solid #FFFFFF;
    filter: drop-shadow(5px 4px 37px rgba(179, 193, 220, 0.4));
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    border-radius: 50%;
    overflow: hidden;
`

const AuthenticationGroup = styled.img`
    width: 14px;
    height: 18px;
    margin-left: 12px;
    border-radius: 50%;    
    margin-top: 60px;
`

const NFTName = styled(FlexCCBox)`
    font-weight: 700;
    font-size: 16px;
    color: #000000;
    margin-top: 60px;
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
`

const PriceTitle = styled.div`
    width: 100%;
    margin-top: 4px;
    font-weight: 700;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
`

export default function ProjectGroup() {
  return (
    <Container>
        <Content>
            <Group>
                <NFTLeft>
                    <NFTImg src={NFT1Png} />
                </NFTLeft>
                <NFTRight>
                    <NFTImg src={NFT1Png} />
                    <NFTImg src={NFT1Png} style={{marginTop: "12px"}}/>
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
  )
}
