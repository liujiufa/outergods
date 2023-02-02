import React, { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import DeputyLayout from "../Layout/DeputyLayout";
import PageLoding from '../components/PageLoding';
const Home = React.lazy(() => import('../view/Home'));
const Market = React.lazy(() => import('../view/Market'));
const Goods = React.lazy(() => import('../view/GoodsDetial'));
const Launch = React.lazy(() => import('../view/Launch'));
const LaunchMR = React.lazy(() => import('../view/LaunchMR'));
const DemonX = React.lazy(() => import('../view/DemonX'));
const ABOUT = React.lazy(() => import('../view/ABOUT'));
const JSG = React.lazy(() => import('../view/JSG'));
const Horse = React.lazy(() => import('../view/Horse'));
const Personal = React.lazy(() => import('../view/Personal'));
const Project = React.lazy(() => import('../view/Project'));
const Sell = React.lazy(() => import('../view/Sell'));
const UserInfo = React.lazy(() => import('../view/UserInfo'));
const Someone = React.lazy(() => import('../view/Someone'));


const NFTDetails = React.lazy(() => import('../view/NFTDetails'));
const Main = React.lazy(() => import('../view/Main'));



const StartRes1 = React.lazy(() => import('../components/StartRes'));

// const StartRes2 = React.lazy(() => import('../components/StartRes2'));
// const StartRes3 = React.lazy(() => import('../components/StartRes3'));
export default function Router() {
  return (
    <Suspense fallback={<PageLoding></PageLoding>}>
      <Routes>
          <Route  path="/*" element={<MainLayout />}>
            <Route index  element={<Home />}></Route>
            <Route path="Market"  element={<Market/>}></Route>
            <Route path="Goods"  element={<Goods/>}></Route>
            <Route path="Launch"  element={<Launch/>}></Route>
            <Route path="LaunchMR"  element={<LaunchMR/>}></Route>
            <Route path="DemonX"  element={<DemonX/>}></Route>
            <Route path="ABOUT"  element={<ABOUT/>}></Route>
            <Route path="JSG"  element={<JSG/>}></Route>
            <Route path="Horse"  element={<Horse/>}></Route>
            <Route path="Personal"  element={<Personal/>}></Route>
            <Route path="Project"  element={<Project/>}></Route>
            <Route path="Sell"  element={<Sell/>}></Route>
            <Route path="UserInfo"  element={<UserInfo/>}></Route>
            <Route path="Someone"  element={<Someone/>}></Route>
            <Route path="NFTDetails"  element={<NFTDetails/>}></Route>
            <Route path="Main"  element={<Main/>}></Route>

            <Route path="StartRes1"  element={<StartRes1/>}></Route>
            {/* <Route path="StartRes2"  element={<StartRes2/>}></Route>
            <Route path="StartRes3"  element={<StartRes3/>}></Route> */}
        </Route>
        <Route path="/DeputyLayout" element={<DeputyLayout />}>
        </Route>
      </Routes>
    </Suspense>

  )
}
