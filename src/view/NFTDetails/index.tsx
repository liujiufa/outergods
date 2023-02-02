

import styled from "styled-components"
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

export default function NFTDetails() {
  return (
    <Container id="NFTDetails">
        <L>
            <NFTDetailsL />
        </L>
        <M>
            <NFTDetailsM />
        </M>
    </Container>
  )
}
