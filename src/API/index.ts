import axois from '../utils/axiosExport'
interface LoginData {
    password: string;
    refereeUserAddress: string;
    userAddress: string;
    userPower: number;
}
export function Login(data: LoginData) {
    return axois.request({
        url: '/user/uUser/loginByPass',
        method: 'post',
        data: {
            ...data,
            Encrypt: true
        }
    })
}
export function getHomeLoveRank() {
    return axois.request({
        url: '/user/home/getHomeLoveRank',
        method: 'get'
    })
}
export function getUserInfo(userAddress: string) {
    return axois.request({
        url: '/user/uUser/getUserInfo/' + userAddress,
        method: 'get'
    })
}
export function selectBlownList(queryTime: number) {
    return axois.request({
        url: '/user/home/selectBlownList',
        method: 'post',
        data: {
            queryTime
        }
    })
}
export interface userInfoType {
    userName: string
    brief: string
    email: string
    headImg: string
    faceBook: string
    tweet: string
    youtube: string
    id: string
}
export function updateUserInfo(data: userInfoType) {
    return axois.request({
        url: '/user/uUser/updateUserInfo',
        method: 'post',
        data
    })
}
export interface NftUserType {
    userAddress: string,
    pageSize?: number,
    currentPage?: number,
    bidType: number,
    status: number,
    type: number,
    projectName: string,
    sortType?: number
}
export function getNftUserInfo(data: NftUserType) {
    return axois.request({
        url: '/user/uUser/getNftUserInfo',
        method: 'post',
        data
    })
}
interface NftStateType {
    userAddress: string,
    status: number,
    type: number
}
/* 获取用户nft 动态 */
export function getNftUserState(data: NftStateType) {
    // console.log(data);
    return axois.request({
        url: `/user/uUser/getNftUserState/${data.userAddress}/${data.status}/${data.type}`,
        method: 'get'
    })
}
/* 获取用户奖励 */
export function getUserAwardList() {
    return axois.request({
        url: `/user/uUser/getUserAwardList`,
        method: 'get'
    })
}
export interface getOrderType {
    bidType: number,
    type: number,
    projectName: string,
    minPrice: number,
    maxPrice: number,
    sortType: number,
    currentPage: number,
    pageSize: number
}
export function getTradeOrder(data: getOrderType) {
    return axois.request({
        url: `/user/nNftOrder/getTradeOrder`,
        method: 'post',
        data
    })
}
/* 获取用户点赞列表 */
export function getUserGiveLikeList(userAddress: string) {
    return axois.request({
        url: `/user/uUserLike/getUserGiveLikeList/${userAddress}`,
        method: 'get'
    })
}
/* 用户点赞 */
export function userGiveLike(tokenId: string, tokenAddress: string) {
    return axois.request({
        url: `/user/uUserLike/userGiveLike/${tokenId}/${tokenAddress}`,
        method: 'get'
    })
}
/* 项目名称模糊查询 */
export function getProjectByName(projectName: string) {
    return axois.request({
        url: `/user/home/getProjectByName/${projectName}`,
        method: 'get'
    })
}
/* 获取订单详情 */
export function getOrderDetail(id: string) {
    return axois.request({
        url: `/user/nNftOrder/getOrderDetail/${id}`,
        method: 'get'
    })
}
/* 获取Nft操作动态 */
export function getNftOrderState(tokenId: string, type: number, address: string) {
    return axois.request({
        url: `/user/nNftOrder/getNftOrderState/${tokenId}/${type}/${address}`,
        method: 'get'
    })
}
/* 获取卖家其他商品 */
export function getUserOrder(userAddress: string) {
    return axois.request({
        url: `/user/nNftOrder/getUserOrder/${userAddress}`,
        method: 'get'
    })
}
/* 获取该系列相关商品 */
export function getOrderByProject(projectId: string) {
    return axois.request({
        url: `/user/nNftOrder/getOrderByProject/${projectId}`,
        method: 'get'
    })
}
/* 获取收藏的nft详情 */
export function getNftUserInfoDetail(tokenAddress: string, tokenId: string) {
    return axois.request({
        url: `/user/uUser/getNftUserInfoDetail/${tokenAddress}/${tokenId}`,
        method: 'get'
    })
}
/* 获取交易场订单动态 */
export function getTradeOrderState(projectName: string) {
    return axois.request({
        url: `/user/nNftOrder/getTradeOrderState/${projectName}`,
        method: 'get'
    })
}
/* 获取项目详情 */
export function getNftProjectDetail(projectName: string) {
    return axois.request({
        url: `/user/nNftProject/getNftProjectDetail/${projectName}`,
        method: 'get'
    })
}
interface createOrderType {
    tokenId: string
    tokenAddress: string
    nftName: string
    projectName: string
    bidType: number
    coinName: string
    nftUserId: number
    num: string
    encipheredMessage: string
    encipheredData: string
    pastTime: number
}
/* 创建订单 */
export function createOrder(data: createOrderType) {
    return axois.request({
        url: `/user/nNftOrder/createOrder`,
        method: 'post',
        data: {
            ...data,
            Encrypt: true
        }
    })
}
interface upPrice {
    id: number
    price: string
    encipheredMessage: string
    encipheredData: string
}
/* 获取项目详情 */
export function updateOrderPrice(data: upPrice) {
    return axois.request({
        url: `/user/nNftOrder/updateOrderPrice`,
        method: 'post',
        data
    })
}
interface closeOrder {
    id: number
    encipheredMessage: string
    encipheredData: string
}
/* 获取项目详情 */
export function cancelOrder(data: closeOrder) {
    return axois.request({
        url: `/user/nNftOrder/cancelOrder`,
        method: 'post',
        data
    })
}
/* 购买订单加密 */
export function buyNftOrder(dataId: number) {
    return axois.request({
        url: `/user/nNftOrder/buyNftOrder/${dataId}`,
        method: 'get'
    })
}
/* 设置用户头像 */
export function updateUserImage(tokenId: string) {
    return axois.request({
        url: `/user/uUser/updateUserImage/${tokenId}`,
        method: 'get'
    })
}
/* 获取发射台列表 */
export function getPlatformBaseList() {
    return axois.request({
        url: `/demonUser/pPlatformBase/getPlatformBaseList`,
        method: 'get'
    })
}
/* 获取发射台详情 */
export function getPlatformBaseDetail(id: number | string) {
    return axois.request({
        url: `/demonUser/pPlatformBase/getPlatformBaseDetail/${id}`,
        method: 'get'
    })
}
/* 获取项目购买详情 */
export function getBuyDetail(id: string) {
    return axois.request({
        url: `/demonUser/pPlatformBase/getBuyDetail/${id}`,
        method: 'get'
    })
}
/* 获取铸造列表 */
export function getCardList(projectId: string) {
    return axois.request({
        url: `/demonUser/pPlatformBase/getCardList/${projectId}`,
        method: 'get'
    })
}
/* 获取铸造列表 */
export function getCardListHorse(projectId: string) {
    return axois.request({
        url: `/demonUser/pPlatformBase/getCardListHorse/${projectId}`,
        method: 'get'
    })
}
/* 首页搜索 */
export function searchData(searchMsg: string) {
    return axois.request({
        url: `/user/home/searchData/${searchMsg}`,
        method: 'get'
    })
}
/* 铸造加密 */
export function mintNft(dataId: number, id: number) {
    return axois.request({
        url: `/demonUser/pPlatformBase/mintNft/${dataId}/${id}`,
        method: 'get'
    })
}
/* 马场铸造加密 */
export function mintNftHorse(dataId: number, id: number) {
    return axois.request({
        url: `/demonUser/pPlatformBase/mintNftHorse/${dataId}/${id}`,
        method: 'get'
    })
}
/* 铸造取消*/
export function sendUserCancelMint(id: number) {
    return axois.request({
        url: `/demonUser/pPlatformBase/sendUserCancelMint/${id}`,
        method: 'get'
    })
}
/* 领取奖励 */
export function drawAward(id: number) {
    return axois.request({
        url: `/user/uUser/drawAward/${id}`,
        method: 'get'
    })
}
/* 领取奖励 */
export function syncUserNftData(userAddress: string) {
    return axois.request({
        url: `/user/uUser/syncUserNftData/${userAddress}`,
        method: 'get'
    })
}
interface loginByPassType {
    password: string
    refereeUserAddress: string
    userAddress: string
    type: number
    userPower: number
}
/* 发射台登录 */
export function loginByPass(data: loginByPassType) {
    // console.log(data)
    return axois.request({
        url: `/demonUser/uUser/loginByPass`,
        method: 'post',
        data
    })
}
/* 发射台奖励信息 */
export function CastingGetUserInfo(type: number) {
    return axois.request({
        url: `/demonUser/pPlatformBase/getUserInfo/${type}`,
        method: 'get'
    })
}
/* 领取发射台奖励 */
export function sendDrawAward(id: number, coinName: string) {
    return axois.request({
        url: `/demonUser/pPlatformBase/sendDrawAward/${id}/${coinName}`,
        method: 'get'
    })
}
/* 取消领取发射台奖励 */
export function sendUserCancelDrawAward() {
    return axois.request({
        url: `/demonUser/pPlatformBase/sendUserCancelDrawAward`,
        method: 'get'
    })
}
/* 奖励领取记录 */
export function getUserDrawDetail() {
    return axois.request({
        url: `/user/uUser/getUserDrawDetail`,
        method: 'get'
    })
}

// 个人中心
export function getNfts(data: any) {
    return axois.request({
        url: `/user/home/getNFTs`,
        method: 'post',
        data
    })
}
