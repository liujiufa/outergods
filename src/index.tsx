import React from 'react';
// import { Web3Provider } from "@ethersproject/providers";
import ReactDOM from 'react-dom';
import './index.scss';
import { Provider } from "react-redux";
import { Web3ReactProvider } from '@web3-react/core'
import store from "./store";
import Web3 from 'web3'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from "react-router-dom";
import { Contracts } from './web3'
import 'antd/dist/antd.css';
function getLibrary(provider: any): Web3 {
  const library = new Web3(provider);
  new Contracts(provider)
  return library;
}
ReactDOM.render(
  <Provider store={store}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <HashRouter>
        <App />
      </HashRouter>
    </Web3ReactProvider>
  </Provider>,
  document.getElementById('root')
);
reportWebVitals();
