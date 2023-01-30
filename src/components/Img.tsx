import React, { useRef } from 'react'
import defaultCard from '../assets/image/defaultCard.png'
import '../assets/style/componentStyle/Img.scss'

interface propsType {
  url: string
}
export default function Img(props: propsType) {
  let { url } = props
  url = url || defaultCard
  let img = useRef<HTMLImageElement | null>(null)
  function load() {
    img.current!.className = "loadImg"
  }
  function err(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    (e.target as HTMLImageElement).src = defaultCard;
  }
  return (
    <img className="inLoadImg" ref={img} src={url} alt="" onLoad={load} onError={err} />
  )
}
