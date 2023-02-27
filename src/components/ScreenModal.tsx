import React, { useState } from 'react'
import { Menu, Dropdown } from 'antd';
import { getProjectByName } from '../API'
import { useDebounceFn } from 'ahooks'
import '../assets/style/componentStyle/ScreenModal.scss'
import closeIcon from '../assets/image/closeBlack.png'
import openIcon from '../assets/image/openIconBlack.png'
import searchIcon from '../assets/image/searchIcon.png'
import projectImg from '../assets/image/projectImg.png'
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next'

interface PropsType {
  isShow: boolean,
  close: Function,
  changeScreen: Function,
}
export interface ScreenDataType {
  bidType: number,
  type: number,
  projectName: string,
  minPrice: number,
  maxPrice: number,
  sortType: number,
  currentPage: number,
  pageSize: number
}
interface ProjectType {
  name: string,
  img: string,
  orderCount: number
}
export default function ScreenModal(props: PropsType) {
  // 控制图标上下
  const [expand6, setExpand6] = useState(true);
  const [expand7, setExpand7] = useState(true);
  const [expand8, setExpand8] = useState(true);
  const [expand9, setExpand9] = useState(true);
  let [ProjectList, setProjectList] = useState<ProjectType[]>([])
  let [ScreenInfo, setScreenInfo] = useState({
    min: 0,
    max: 0,
    projectName: '',
    bidType: 0,
    type: 0,
    minPrice: 0,
    maxPrice: 0,
    sortType: 0,
    currentPage: 1,
    pageSize: 10
  })
  let { t } = useTranslation();
  // 下拉图标旋转
  const handleDropDown = (fun: any, value: boolean) => {
    fun(!value);
  }
  function changeScreenInfo(e: React.ChangeEvent<HTMLInputElement> | string) {
    console.log("typeof", e, typeof (e))
    if (typeof (e) === 'string') {
      setScreenInfo({
        ...ScreenInfo,
        projectName: e
      })
    } else {
      let name = e.target.getAttribute('name')
      setScreenInfo({
        ...ScreenInfo,
        [name as string]: e.target.value
      })
    }
  }
  let typeMap = [
    {
      key: t('All'),
      value: -1
    },
    {
      key: t('Fixed Price'),
      value: 0
    }
  ]
  let [typeIndex, setTypeIndex] = useState(0)
  const typeMenu = (
    <Menu>
      {
        typeMap.map((item, index) => <Menu.Item key={index} onClick={() => { setTypeIndex(index) }}>
          {item.key}
        </Menu.Item>)
      }
    </Menu>
  );
  let IsSuitMap = [
    {
      key: t('All'),
      value: 0
    },
    {
      key: t('Bundle'),
      value: 1
    },
    {
      key: t('Single Item'),
      value: 2
    }
  ]
  let [IsSuitIndex, setIsSuitIndex] = useState(0)
  const IsSuitMenu = (
    <Menu onClick={() => handleDropDown(setExpand7, expand7)}>
      {
        IsSuitMap.map((item, index) => <Menu.Item key={index} onClick={() => { setIsSuitIndex(index) }}>
          {item.key}
        </Menu.Item>)
      }

    </Menu>
  );
  let sortMap = [
    {
      key: t('Newest'),
      value: 1
    },
    {
      key: t('Price: High to Low'),
      value: 2
    },
    {
      key: t('Price: Low to High'),
      value: 3
    }
  ]
  let [sortIndex, setSortIndex] = useState(0)
  const sortMenu = (
    <Menu onClick={() => handleDropDown(setExpand8, expand8)}>
      {
        sortMap.map((item, index) => <Menu.Item key={index} onClick={() => { setSortIndex(index) }}>
          {item.key}
        </Menu.Item>)
      }
    </Menu>
  );
  let goodTypeMap = [
    {
      key: t('All'),
      value: -1
    },
    {
      key: 'NFT',
      value: 2
    },
    {
      key: t('Blind Box'),
      value: 1
    }
  ]
  let [goodTypeIndex, setGoodTypeIndex] = useState(0)
  const goodTypeMenu = (
    <Menu onClick={() => handleDropDown(setExpand9, expand9)}>
      {
        goodTypeMap.map((item, index) => <Menu.Item key={index} onClick={() => { setGoodTypeIndex(index) }}>
          {item.key}
        </Menu.Item>)
      }
    </Menu>
  );
  // function changeValue(key:string,value:string|number,index:number){

  // }
  function submit() {
    props.changeScreen({
      bidType: typeMap[typeIndex].value,
      type: goodTypeMap[goodTypeIndex].value,
      projectName: ScreenInfo.projectName,
      minPrice: ScreenInfo.min,
      maxPrice: ScreenInfo.max,
      sortType: sortMap[sortIndex].value,
      currentPage: 1,
      pageSize: 10
    }, typeIndex, sortIndex)
    props.close()
  }
  const { run } = useDebounceFn(changeProjectSearch)
  function changeProjectSearch(e: React.ChangeEvent<HTMLInputElement>) {
    getProjectByName(e.target.value).then(res => {
      setProjectList(res.data)
      console.log('项目名称搜索结果', res.data)
    })
  }
  function reset() {
    setTypeIndex(0)
    setIsSuitIndex(0)
    setSortIndex(0)
    setGoodTypeIndex(0)
  }

  console.log("ScreenInfo", ScreenInfo)

  return (
    <Modal className='habitat-modal' visible={props.isShow} destroyOnClose={true} centered closable={false} footer={null} width={959}>
      <div className="modalTop">
        <div className="title">{t('Filter')}</div>
        <img src={closeIcon} alt="" onClick={() => props.close()} />
      </div>
      <div className="columnAll">
        <div className="column">
          <div className="columnLabel">{t('Basic')}</div>
          <div className="ScreenLabel">{t('Type')}</div>
          <Dropdown overlay={typeMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand6, expand6)}>
            <div className="ScreenDropDown">
              {typeMap[typeIndex].key}
              <img className={expand6 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
            </div>
          </Dropdown>
          {/* <div className="ScreenLabel">{t('Bundle & Items')}</div>
          <Dropdown overlay={IsSuitMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand7, expand7)}>
            <div className="ScreenDropDown">
              {IsSuitMap[IsSuitIndex].key}
              <img className={expand7 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
            </div>
          </Dropdown> */}
          <div className="ScreenLabel">{t('Sort')}</div>
          <Dropdown overlay={sortMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand8, expand8)}>
            <div className="ScreenDropDown">
              {sortMap[sortIndex].key}
              <img className={expand8 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
            </div>
          </Dropdown>
          <div className="ScreenLabel">{t('Price')}（$）</div>
          <div className="section">
            <div className="min flexCenter">
              <input type="text" name="min" onChange={changeScreenInfo} placeholder={t('Min')} />
            </div>
            <span>{t('To')}</span>
            <div className="max flexCenter">
              <input type="text" name="max" onChange={changeScreenInfo} placeholder={t('Max')} />
            </div>
          </div>
        </div>
        <div className="column">
          <div className="columnLabel">{t('Type')}</div>
          <div className="ScreenLabel">{t('Type')}</div>
          <Dropdown overlay={goodTypeMenu} trigger={['click']} onVisibleChange={() => handleDropDown(setExpand9, expand9)}>
            <div className="ScreenDropDown">
              {goodTypeMap[goodTypeIndex].key}
              <img className={expand9 ? 'rotetaOpen' : 'rotetaClose'} src={openIcon} alt="" />
            </div>
          </Dropdown>
        </div>
        <div className="column ">
          <div className="columnLabel">{t('series')}</div>
          <div className="ScreenLabel">{t('search')}</div>
          <div className="search">
            <img src={searchIcon} alt="" />
            <input type="text" name="projectName" value={ScreenInfo.projectName}
              onChange={(e) => {
                const name = e.target.value;
                setScreenInfo({
                  ...ScreenInfo,
                  projectName: name
                })
                run(e)
              }} placeholder={t('All')} />
          </div>
          <div className="searchResult">
            {
              ProjectList.map((item, index) => <div className="project" key={index} onClick={() => { changeScreenInfo(item.name) }}>
                <div className="projectImg">
                  <img src={item.img} alt="" />
                </div>
                <div className="projectName">{item.name}</div>
                <div className="ProjectNo">{item?.orderCount}</div>
              </div>)
            }
          </div>

        </div>
      </div>
      <div className="ModalFooter">
        <div className="resetBtn flexCenter" onClick={reset}>{t('Reset')}</div>
        <div className="enterBtn flexCenter" onClick={submit}>{t('Apply')}</div>
      </div>
    </Modal>
  )
}
