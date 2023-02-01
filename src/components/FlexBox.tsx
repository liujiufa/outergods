import styled from "styled-components";

export const FlexBox = styled.div`
    display: flex;
`
export const FlexSSBox = styled(FlexBox)`
    justify-content: start;
    align-items: start;
`

export const FlexSCBox = styled(FlexBox)`
    justify-content: start;
    align-items: center;
`

export const FlexSASBox = styled(FlexBox)`
    justify-content: space-around;
    align-items: center;
`

export const FlexSACBox = styled(FlexBox)`
    justify-content: space-around;
    align-items: center;
`

export const FlexSBSBox = styled(FlexBox)`
    justify-content: space-between;
`

export const FlexSBCBox = styled(FlexBox)`
    justify-content: space-between;
    align-items: center;
`

export const FlexCCBox = styled(FlexBox)`
    justify-content: center;
    align-items: center;
`

export const FlexSECBox = styled(FlexBox)`
    justify-content: space-evenly;
    align-items: center;
`

export const ClaimBtn = styled(FlexCCBox)<{isClaim?: boolean}>`
    padding: 8px 16px;
    font-size: ${({theme})=> theme.size14};
    cursor: ${({isClaim}) => isClaim ? "pointer" : "default" };
    opacity: ${({isClaim}) => isClaim ? 1 : ".3" };
    background-size: 100% 100%;
    background-repeat: no-repeat;
    white-space: nowrap;
`