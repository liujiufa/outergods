import { useEffect, useState } from 'react';
import { Modal , Table } from 'antd';
import {stateType} from '../store/reducer'
import {useSelector} from "react-redux";
import {getUserDrawDetail} from '../API'
import {dateFormat,AddrHandle} from '../utils/tool'
import { useTranslation } from 'react-i18next'

import '../assets/style/componentStyle/ReceRecord.scss'
import closeIcon from '../assets/image/closeIconWhite.png'
const { Column } = Table;
interface PropsType{
    isShow:boolean,
    close:Function
}
interface DataType {
    id:number,
    coinName:string
    createTime:number,
    txId:string
    amountString:string
  }
export default function ReceRecord(props:PropsType) {
    let state = useSelector<stateType,stateType>(state => state);
  let { t } = useTranslation();

    let [tableData,setTableData] = useState<DataType []>([])
    useEffect(()=>{
        if(state.token){
            getUserDrawDetail().then(res=>{
                setTableData(res.data)
                // console.log(res,"奖励领取记录");
            })
        }
    },[state.token])
    
  return (
    <Modal visible={props.isShow} centered closable={false} footer={null} width={557}>
       <div className="close" onClick={()=>{props.close()}}>
          <img src={closeIcon} alt="" />
        </div>
        <div className="ReceRecordModalTop">{t('Get the record')}</div>
        <div className="TableBoxRecord">
            <Table dataSource={tableData} rowKey="id" pagination={false}>
            <Column
                title={t('Time')}
                dataIndex="createTime"
                key="createTime"
                render={(createTime) => (
                    <div>
                        {dateFormat('YYYY-mm-dd',new Date(createTime))}
                    </div>
                )}
                />
                <Column title={t('amount')} dataIndex="amountString" />
                <Column title={t('Crypto')} dataIndex="coinName" />
                <Column
                title={t('Hash')} 
                dataIndex="txId"
                key="txId"
                render={(txId) => (
                    <div>
                        {AddrHandle(txId,4,4)}
                    </div>
                )}
                />
            </Table>
        </div>
    </Modal>
  )
}
