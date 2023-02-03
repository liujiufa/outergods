import React, { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import DeputyLayout from "../Layout/DeputyLayout";
import PageLoding from '../components/PageLoding';
const Home = React.lazy(() => import('../view/Home'));
const Market = React.lazy(() => import('../view/Market'));
const Launch = React.lazy(() => import('../view/Launch'));
const Personal = React.lazy(() => import('../view/Personal'));
const UserInfo = React.lazy(() => import('../view/UserInfo'));
const NFTDetails = React.lazy(() => import('../view/NFTDetails'));
const Main = React.lazy(() => import('../view/Main'));
const Sell = React.lazy(() => import('../view/Sell'));

export default function Router() {
  return (
    <Suspense fallback={<PageLoding></PageLoding>}>
      <Routes>
        <Route path="/*" element={<MainLayout />}>
          {/* <Route index element={<Home />}></Route> */}
          <Route index element={<Main />}></Route>
          <Route path="Market" element={<Market />}></Route>  {/** */}
          <Route path="Launch" element={<Launch />}></Route>   {/** */}
          <Route path="Personal" element={<Personal />}></Route>  {/** */}
          <Route path="UserInfo" element={<UserInfo />}></Route>   {/** */}
          <Route path="NFTDetails" element={<NFTDetails />}></Route>  {/** */}
          <Route path="Sell" element={<Sell />}></Route>
          {/* <Route path="StartRes2"  element={<StartRes2/>}></Route>
            <Route path="StartRes3"  element={<StartRes3/>}></Route> */}
        </Route>
        <Route path="/DeputyLayout" element={<DeputyLayout />}>
        </Route>
      </Routes>
    </Suspense>

  )
}
