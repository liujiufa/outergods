import { useSwiper} from "swiper/react";
import { useImperativeHandle } from 'react'
interface propsType{
    children?: React.ReactNode ,
    onRef:any
}
function SwiperButtonNext  (props:propsType) {
  const swiper = useSwiper();
  useImperativeHandle(props.onRef, () => {
    return {
        next: next,
        prev: prev,
    };
  });
  function next(){
    swiper.slideNext()
  }
  function prev(){
    swiper.slidePrev()
  }
  return <button className="swiper-button-prev">{props.children}</button>;
};
export default SwiperButtonNext