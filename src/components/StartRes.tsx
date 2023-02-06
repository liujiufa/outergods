import React from 'react'
import { Col, Row } from 'antd';
import { useNavigate , useSearchParams} from "react-router-dom";
import '../assets/style/componentStyle/StartRes.scss'
import Img1 from '../assets/image/decImg/1.jpg'
import Img2 from '../assets/image/decImg/2.jpg'
import Img3 from '../assets/image/decImg/3.jpg'
import Img4 from '../assets/image/decImg/4.jpg'
import Img5 from '../assets/image/decImg/5.jpg'
import Img6 from '../assets/image/decImg/6.jpg'
import Img7 from '../assets/image/decImg/7.jpg'
import Img8 from '../assets/image/decImg/8.jpg'
import Img9 from '../assets/image/decImg/9.jpg'
import Img10 from '../assets/image/decImg/10.jpg'
import Img11 from '../assets/image/decImg/11.jpg'
import Img12 from '../assets/image/decImg/12.jpg'
import Img13 from '../assets/image/decImg/13.jpg'
import Img14 from '../assets/image/decImg/14.jpg'
import Img15 from '../assets/image/decImg/15.jpg'
import Img16 from '../assets/image/decImg/16.jpg'
import Img17 from '../assets/image/decImg/17.jpg'
import Img18 from '../assets/image/decImg/18.jpg'
import Img19 from '../assets/image/decImg/19.jpg'

export default function NoData() {
    const [params] = useSearchParams();
    let type = params.get('type')
// console.log(type,'nihao')
  return (
    <Row>
        <Col span={20} className='Container'>
          {type==='0'?
          <div className="content"><h1>How to Easily Setup a MetaMask Wallet</h1>
        <div className="text">Looking to kick off your NFT collection, but not sure where to begin? The first thing you’ll need is a crypto wallet, which will store your method of payment and allow you to access your new NFT. A crypto wallet allows you to purchase, send and receive your NFTs, as well as interact with blockchain-integrated websites—commonly known as decentralized applications (or dapps, for short)—like Habitat NFT. </div>
        <div className="subTitle">Step 1: Install MetaMask</div>
        <div className="text">You can go ahead and install the MetaMask wallet. Once you have downloaded the extension, you can simply add it to your browser.</div>
        <div className="text">You can toggle the extension by accessing your browser’s settings. When you head to “More Tools”, you will find “Extensions”. Once you click it, you will be directed to this screen.</div>
        <div className="ImgBox"><img src={Img1} alt="" /></div>
        <div className="text">If you toggle the blue button at the bottom right of each card, you will be able to see the extension like this.</div>
<div className="ImgBox"><img src={Img2} alt="" /></div>
<div className="subTitle">Step 2: Open Your MetaMask Wallet</div>
<div className="text">Once you’ve successfully set up your MetaMask (MM) wallet, you can access it on the top right-hand corner of your screen. Open the wallet and click on the three dots on the top-right corner of the screen.
</div>
<div className="ImgBox"><img src={Img3} alt="" /></div>

<div className="text">You will get the option to open your wallet on an expanded screen.</div>
<div className="ImgBox"><img src={Img4} alt="" /></div>

<div className="text">Once you select the second option, you will be redirected to your wallet on a new tab.</div>
<div className="ImgBox"><img src={Img5} alt="" /></div>

<div className="subTitle">Step 3: Add BSC Network Information</div> 
<div className="text">Now that you have the MetaMask wallet open on a separate screen, it will be much easier for you to set up the BSC network. Simply select your profile icon on the top-right, and head down to settings.
</div>
<div className="ImgBox"><img src={Img6} alt="" /></div>

<div className="text">In the left-hand corner, you will see the “Networks” option.</div> 
<div className="ImgBox"><img src={Img7} alt="" /></div>

<div className="text">Once you select that, you will have a screen just like below.</div>
<div className="ImgBox"><img src={Img8} alt="" /></div>

<div className="text">You must then click on “Add Network” to add BSC. You will be asked to enter technical information about the network that you want to add. For Binance Smart Chain, fill out the information given below:</div>
<div className="text">For Mainnet
​​Network Name: Smart Chain
</div>

<div className="text">New RPC URL: https://bsc-dataseed.binance.org/</div>
<div className="text">ChainID: 56</div>
<div className="text">Symbol: BNB</div>
<div className="text">Block Explorer URL: <a href='https://bscscan.com'>https://bscscan.com</a></div>
<div className="text">Once you’ve copied and pasted all the information onto your MM wallet, you can go ahead and click on “Save”.</div>
<div className="ImgBox"><img src={Img9} alt="" /></div>

<div className="text">Once you have saved your network, in the same “Networks” tab you will now see Binance Smart Chain added.</div>
<div className="ImgBox"><img src={Img10} alt="" /></div>

<div className="text">Once you come out of the “Settings” tab, you will notice that your wallet now features the BNB symbol and right under “Assets”, BNB has been added. BNB is the native token on the BSC. If you have done everything correctly, then your wallet screen will look like this.</div>
<div className="ImgBox"><img src={Img11} alt="" /></div>

<div className="subTitle">Step 4: Transfer BNB to Your MeteMask Wallet</div> 
<div className="text">Once you’ve successfully set up the BSC network on your MetaMask wallet, you can easily transfer BNB between other Binance wallets (including your Binance exchange account) and the MetaMask wallet. To do that, you simply need to go to your exchange and on your wallet, select “Withdraw crypto”.</div>
<div className="text">Once you select “Withdraw Crypto”, you will be directed to this screen.</div>
<div className="ImgBox"><img src={Img12} alt="" /></div>

<div className="text">If you haven’t already, you will have to select BNB as your coin. Now, to transfer BNB coins, you will have to copy your MM wallet address. For this, you simply need to click on your account address (on MetaMask) and it will be copied to your clipboard.</div>
<div className="ImgBox"><img src={Img13} alt="" /></div>

<div className="text">Head back to the Binance screen and paste your wallet address. Most likely, Binance will automatically choose the network through which the BNB can be transferred. And in this case, as you can see, it has already chosen the BEP-20 network.
Remember that you must only select the BSC network otherwise, your assets will be lost!</div>
<div className="ImgBox"><img src={Img14} alt="" /></div>

<div className="text">Now, you must enter the amount that you wish to transfer and select “Withdraw”. You will be asked to accept the undertakings - these are just here to remind you that if you select the wrong network, your assets will be lost. Be sure to double-check that only the BSC network has been selected.</div>

<div className="text">Once that is done, your transaction will be completed. You will have to wait until it is processed by the network.</div>
<div className="ImgBox"><img src={Img15} alt="" /></div>

<div className="text">Once it is successful, you will see the exact BNB transferred to your MetaMask wallet.</div>
<div className="ImgBox"><img src={Img16} alt="" /></div>

<div className="text">Thus, your wallet is now set up. You can easily transfer assets between your Binance account and MM.Connect MetaMask to Binance Smart Chain (BSC)</div>








       
        
        </div>:' '}
          {type==='1'?
          <div className="content"><h1>How to Buy BNB from MetaMask</h1>
        <div className="text">1. Open MetaMask on your computer.</div>
        <div className="ImgBox"><img src={Img17} alt="" /></div>

        <div className="text">2. Search for BNB and press “Buy”.</div>
        <div className="ImgBox"><img src={Img18} alt="" /></div>

        <div className="text">3. Choose how much BNB you would like to buy and follow the on-screen instructions to complete the process.</div>
        <div className="ImgBox"><img src={Img19} alt="" /></div>

        </div>:' '}
          {type==='2'?
          <div className="content"><h1>How to Find an NFT You Like</h1>
        <div className="text">With so many projects out there, we know it can seem hard to find an NFT you love. Here are a few things you may want to keep in mind to simplify the process. </div>
        <div className="text etext">1. <b>Consider the purpose of purchasing.</b> Are you buying an NFT you’ll use for a profile photo (PFP)? Alternatively, is it purely for art? Is it something you’d display at home? Maybe you’re looking for virtual land? How long do you plan to own the NFT? Asking these questions will help you narrow down the search as you browse.</div>
        <div className="text etext">2. <b>Research the project.</b> Start with the official project website. This is a great starting point to understand the motivations and goals of the founder(s). Many projects these days have a roadmap with lots of milestones. Does it seem realistic, or is it overly ambitious? Make sure to also check the project’s social media. </div>
        <div className="text etext">3. <b>The founders.</b> Most times, founders drive the vision, future, and success of a project. It’s time to introduce two terms: doxxed and undoxxed. Doxxed founders have made their identity publicly known so you are able to research their background/history of success. Undoxxed founders have not revealed their identity and often go by an alias. </div>
        <div className="text etext">4. <b>Join their Discord.</b> You might buy an NFT just for the art, but you shouldn’t overlook the community. Checking out the project’s Discord is usually the best way to get a sense of the community and meet your fellow collectors. Join the discord and ask questions of the community and moderators. Are they helpful and welcoming?</div>
        <div className="text etext">5. <b>Research the artist.</b> Artistry takes many forms. Some artists are brilliant and just starting out. Others are accomplished and have a history of other successful projects. At the end of the day, does the art make you feel a certain way? Do you want to support the artist? </div>
<div className="text etext">6. <b>Rarity features.</b> NFT’s are unique and each one has a unique rarity. Usually, NFT’s that are rare are more sought after. You can see the traits, which drive rarity, in the left-hand bar when on a project page.</div>
<div className="text etext">7. <b>Project stats (eg. floor price, volume, owners).</b> NFT users often focus on floor price. Yes – some projects might “moon” overnight, but you shouldn’t overlook other stats like volume and the number of owners. A collection with a high floor price and no volume is meaningless.If this is a short-term purchase, factoring in the volume of how many users are buying and selling at any given time will be important if you ever decide to sell. Likewise, for profile picture projects (PFPs), projects having fewer owners may have difficulty gaining long-term traction and building community.</div>
<div className="text">Ultimately, there are many points to think about when purchasing a NFT. At the end of the day, most people love NFT’s for the art and joy they provide. Once you have your NFT, make sure to share it with your fellow collectors!</div>
{/* <div className="ImgBox"><img src={Img20} alt="" /></div> */}

        </div>:' '}
        </Col>
    </Row>
  )
}
