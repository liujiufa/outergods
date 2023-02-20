import './App.css';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components';
import './18n/i18n'
import Routers from './router'
// import web3 from 'web3';
import { stateType } from './store/reducer'
import { Login } from './API'
import { GetQueryString } from './utils/tool'
import { createAddMessageAction, createLoginSuccessAction } from './store/actions'
import { useConnectWallet } from './web3'
import ViewportProvider from './components/viewportContext'
import Loding from './components/loding'
import InitAccount from './components/InitAccount'
// import Home from './view/Home';
let aa
const Message = styled.span`
  color: #fff;
  text-align: center;
  background: #3683F6;
  height: 62px;
  border-radius: 10px;
  padding: 5px 12px;
  border-radius: 5px;
`
const MessageRow = styled.div`
  height: 50px;
`
const MessageBox = styled.div`
  width: 100%;
  position:fixed;
  z-index: 99999;
  top: 50px;
  text-align: center;
`
let bb
function App() {
  const [initPage, setInitPage] = useState(false)
  const web3React = useWeb3React()
  const dispatch = useDispatch();
  let state = useSelector<stateType, stateType>(state => state);
  useEffect(() => {
    if (web3React.active) {
      LoginFun()
    } else {
    }
  }, [web3React.account])
  useConnectWallet()
  function LoginFun() {
    let refereeUserAddress = GetQueryString("address") || ''
    Login({
      password: "123",
      refereeUserAddress,
      userAddress: web3React.account as string,
      // userAddress: '0x89916247B18DF309FfA55318bfF235F3c34324b3',
      userPower: 0
    }).then((res: any) => {
      console.log(res);
      if (res.code !== 200) {
        addMessage(res.msg)
      }
      dispatch(createLoginSuccessAction(res.data.token, web3React.account as string))
    })
  }
  function addMessage(msg: string) {
    dispatch(createAddMessageAction('添加提醒'))
  }
  return (
    <ViewportProvider>
      <div className="App">
        <MessageBox>
          {
            state.message.map((item, index) => <MessageRow key={index}><Message>{item.message}</Message></MessageRow>)
          }
        </MessageBox>
        <Routers></Routers>
        {state.showLoding && <Loding></Loding>}
      </div>
      <InitAccount isShow={initPage} close={() => { setInitPage(false) }}></InitAccount>
    </ViewportProvider>
  );
}

export default App;
