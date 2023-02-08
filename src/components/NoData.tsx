import React from 'react'
import noDataImg from '../assets/image/nodata.png'

export default function NoData() {
  return (
    <div className="NoData flexCenter" style={{ margin: "auto" }}>
      <img style={{ maxWidth: '60%' }} src={noDataImg} alt="" />
    </div>
  )
}
