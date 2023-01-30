import React,{useState} from 'react'
import { Menu, Dropdown } from 'antd';
import {getProjectByName} from '../API'
import {useDebounceFn } from 'ahooks'
import '../assets/style/componentStyle/ScreenModal.scss'
import closeIcon from '../assets/image/closeIconWhite.png'
import openIcon from '../assets/image/openIconWhite.png'
import searchIcon from '../assets/image/searchIcon.png'
import projectImg from '../assets/image/projectImg.png'
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next'

interface PropsType{
    isShow:boolean,
    close:Function,
    changeScreen:Function,
}
export interface ScreenDataType{
  bidType:number,
  type:number,
  projectName:string,
  minPrice:number,
  maxPrice:number,
  sortType:number,
  currentPage:number,
  pageSize:number
}
interface ProjectType{
  name:string,
  img:string
}
export default function ScreenModal(props:PropsType) {
  // 控制图标上
  const expandArr=[true,true,true,true,true]
  const [expand1, setExpand1] = useState(true); 
  const [expand2, setExpand2] = useState(true); 
  const [expand3, setExpand3] = useState(true); 
  const [expand4, setExpand4] = useState(true); 
  const [expand5, setExpand5] = useState(true); 

  let { t } = useTranslation();

  let [ProjectList,setProjectList] = useState<ProjectType []>([])
  let [ScreenInfo,setScreenInfo] =useState({
    min:0,
    max:0,
    projectName:'',
    bidType:0,
    type:0,
    minPrice:0,
    maxPrice:0,
    sortType:0,
    currentPage:1,
    pageSize:10
  })
  // 下拉图标旋转
  const handleDropDown=(fun:any,value:boolean)=>{
    fun(!value);
  }
  // const handleDropDown1=(index:number)=>{
    
  //   setExpand1([...expand1,!expand1[index]])
  //   console.log(expand1,'test')
  // }
  function changeScreenInfo(e:React.ChangeEvent<HTMLInputElement>|string) {
    // console.log(e)
    if(typeof e === 'string') {
      setScreenInfo({
          ...ScreenInfo,
          projectName:e
      })
    }else{
      let name = e.target.getAttribute('name')
      setScreenInfo({
          ...ScreenInfo,
          [name as string]:e.target.value
      })
    }
}
  let typeMap=[
    {
      key:t('All'),
      value:-1
    },
    {
      key:t('as fixed price'),
      value:0
    }
  ]
  let [typeIndex,setTypeIndex] = useState(0)
  const typeMenu = (
    <Menu onClick={()=>handleDropDown(setExpand5,expand5)}>
      {
        typeMap.map((item,index)=><Menu.Item key={index} onClick={()=>{setTypeIndex(index)}}>
        {item.key}
      </Menu.Item>)
      }
    </Menu>
  );
  let stateMap=[
    {
        key:t('All'),
        value:-1
    },
    {
        key:t('Sale'),
        value:1
    },
    {
        key:t('Listing'),
        value:0
    }
  ]
  let [stateIndex,setStateIndex] = useState(0)
  const stateMenu = (
    <Menu onClick={()=>handleDropDown(setExpand1,expand1)}>
      {
        stateMap.map((item,index)=><Menu.Item key={index} onClick={()=>{setStateIndex(index)}}>
        {item.key}
      </Menu.Item>)
      }
    </Menu>
  );
  let IsSuitMap=[
    {
      key:t('All'),
      value:0
    },
    {
      key:t('Bundle'),
      value:1
    },
    {
      key:t('Single Item'),
      value:2
    }
  ]
  let [IsSuitIndex,setIsSuitIndex] = useState(0)
  const IsSuitMenu = (
    <Menu onClick={()=>handleDropDown(setExpand2,expand2)}>
      {
        IsSuitMap.map((item,index)=><Menu.Item key={index} onClick={()=>{setIsSuitIndex(index)}}>
        {item.key}
      </Menu.Item>)
      }
     
    </Menu>
  );
  let sortMap=[
    {
        key:t('Newest'),
        value:1
    },
    {
        key:t('Price'),
        value:3
    }
  ]
  let [sortIndex,setSortIndex] = useState(0)
  const sortMenu = (
    <Menu onClick={()=>handleDropDown(setExpand3,expand3)}>
      {
        sortMap.map((item,index)=><Menu.Item key={index} onClick={()=>{setSortIndex(index)}}>
        {item.key}
      </Menu.Item>)
      }
    </Menu>
  );
  let goodTypeMap=[
    {
      key:t('All'),
      value:-1
    },
    {
      key:'NFT',
      value:2
    },
    {
      key:t('Blind Box'),
      value:1
    }
  ]
  let [goodTypeIndex,setGoodTypeIndex] = useState(0)
  const goodTypeMenu = (
    <Menu onClick={()=>handleDropDown(setExpand4,expand4)}>
      {
        goodTypeMap.map((item,index)=><Menu.Item key={index} onClick={()=>{setGoodTypeIndex(index)}}>
        {item.key}
      </Menu.Item>)
      }
    </Menu>
  );
  // function changeValue(key:string,value:string|number,index:number){

  // }
  function submit(){
    props.changeScreen({
      bidType:typeMap[typeIndex].value,
      type:goodTypeMap[goodTypeIndex].value,
      projectName:ScreenInfo.projectName,
      minPrice:ScreenInfo.min,
      maxPrice:ScreenInfo.max,
      sortType:sortMap[sortIndex].value,
      currentPage:1,
      pageSize:10,
      status:stateMap[stateIndex].value
    },stateIndex,sortIndex)
    props.close()
  }
  const { run } = useDebounceFn(changeProjectSearch)
  function changeProjectSearch(e:React.ChangeEvent<HTMLInputElement>){
    // console.log(e.target.value)
    if(e.target.value){
      getProjectByName(e.target.value).then(res=>{
        setProjectList(res.data)
        // console.log('项目名称搜索结果',res)
      })
    }
  }
  function reset(){
    setTypeIndex(0)
    setStateIndex(0)
    setIsSuitIndex(0)
    setSortIndex(0)
    setGoodTypeIndex(0)
  }
  return (
    <Modal visible={props.isShow} destroyOnClose={true} centered closable={false} footer={null} width={959}>
      <div className="modalTop">
        <div className="title">{t('Filter')}</div>
        <img src={closeIcon} alt="" onClick={()=>props.close()} />
      </div>
      <div className="columnAll">
        <div className="column">
          <div className="columnLabel">{t('Basic')}</div>
          <div className="ScreenLabel">{t('State')}</div>
          <Dropdown overlay={stateMenu} trigger={['click']} onVisibleChange={()=>handleDropDown(setExpand1,expand1)}>
            <div className="ScreenDropDown">
              {stateMap[stateIndex].key}
              <img className={expand1?'rotetaOpen':'rotetaClose'} src={openIcon} alt="" /> 
            </div>
          </Dropdown>
          <div className="ScreenLabel">{t('Bundle & Items')}</div>
          <Dropdown overlay={IsSuitMenu} trigger={['click']} onVisibleChange={()=>handleDropDown(setExpand2,expand2)}>
            <div className="ScreenDropDown">
              {IsSuitMap[IsSuitIndex].key}
              <img className={expand2?'rotetaOpen':'rotetaClose'} src={openIcon} alt="" />
            </div>
          </Dropdown>
          {
              stateIndex ===1 &&<>
                <div className="ScreenLabel">{t('Sort')}</div>
                <Dropdown overlay={sortMenu} trigger={['click']} onVisibleChange={()=>handleDropDown(setExpand3,expand3)}>
                    <div className="ScreenDropDown">
                    {sortMap[sortIndex].key}
                    <img className={expand3?'rotetaOpen':'rotetaClose'} src={openIcon} alt="" />
                    </div>
                </Dropdown>
              </>
          }
        </div>
        <div className="column">
          <div className="columnLabel">{t('Type')}</div>
          <div className="ScreenLabel">{t('Type')}</div>
          <Dropdown overlay={goodTypeMenu} trigger={['click']} onVisibleChange={()=>handleDropDown(setExpand4,expand4)}>
            <div className="ScreenDropDown">
              {goodTypeMap[goodTypeIndex].key}
              <img className={expand4?'rotetaOpen':'rotetaClose'} src={openIcon} alt="" />
            </div>
          </Dropdown>
          {
              stateIndex ===1 &&<>
               <div className="ScreenLabel">{t('Type')}</div>
                <Dropdown overlay={typeMenu} trigger={['click']} onVisibleChange={()=>handleDropDown(setExpand5,expand5)}>
                    <div className="ScreenDropDown">
                    {typeMap[typeIndex].key}
                    <img  className={expand5?'rotetaOpen':'rotetaClose'} src={openIcon} alt="" />
                    </div>
                </Dropdown>
              </>
          }
          
        </div>
        <div className="column">
          <div className="columnLabel">{t('series')}</div>
          <div className="ScreenLabel">{t('search')}</div>
          <div className="search">
            <img src={searchIcon} alt="" />
            <input type="text" placeholder={t('All')} name="projectName" onChange={(e)=>{run(e)}} />
          </div>
          {
            ProjectList.map((item,index)=><div className="project" key={index} onClick={()=>{changeScreenInfo(item.name)}}>
              <div className="projectImg">
                <img src={item.img} alt="" />
              </div>
              <div className="projectName">{item.name}</div>
              <div className="ProjectNo">3231</div>
            </div>)
          }
          
        </div>
      </div>
      <div className="ModalFooter">
        <div className="resetBtn flexCenter" onClick={reset}>{t('Reset')}</div>
        <div className="enterBtn flexCenter" onClick={submit}>{t('Apply')}</div>
      </div>
    </Modal>
  )
}
