import React, { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import DeputyLayout from "../Layout/DeputyLayout";
import PageLoding from '../components/PageLoding';
const Market = React.lazy(() => import('../view/Market'));
const Launch = React.lazy(() => import('../view/Launch'));
const Personal = React.lazy(() => import('../view/Personal'));
const Someone = React.lazy(() => import('../view/Someone'));
const UserInfo = React.lazy(() => import('../view/UserInfo'));
const NFTDetails = React.lazy(() => import('../view/NFTDetails'));
const Main = React.lazy(() => import('../view/Main'));
const MobileSearch = React.lazy(() => import('../view/MobileSearch'));

export default function Router() {
  return (
    <Suspense fallback={<PageLoding></PageLoding>}>
      <Routes>
        <Route path="/*" element={<MainLayout />}>
          <Route index element={<Main />}></Route>
          <Route path="Market" element={<Market />}></Route>  {/** M */}
          <Route path="Launch" element={<Launch />}></Route>   {/** L */}
          <Route path="Personal" element={<Personal />}></Route>  {/** P */}
          <Route path="Someone" element={<Someone />}></Route>  {/** P */}
          <Route path="UserInfo" element={<UserInfo />}></Route>   {/** U */}
          <Route path="NFTDetails" element={<NFTDetails />}></Route>  {/** N */}
          {/* <Route path="StartRes2"  element={<StartRes2/>}></Route>
            <Route path="StartRes3"  element={<StartRes3/>}></Route> */}
        </Route>
        <Route path="MobileSearch" element={<MobileSearch />}></Route>  {/** N */}
        <Route path="/DeputyLayout" element={<DeputyLayout />}>
        </Route>
      </Routes>
    </Suspense>

  )
}
