import React from 'react'
import noDataImg from '../assets/image/nodataWhite.png'

export default function NoData() {
  return (
    <div className="NoData flexCenter">
        <img style={{maxWidth:'60%'}} src={noDataImg} alt=""/>
    </div>
  )
}
