import React, { useState } from 'react'
import { Menu, Dropdown } from 'antd';
import { getProjectByName } from '../API'
import { useDebounceFn } from 'ahooks'
import '../assets/style/componentStyle/ConfirmModal.scss'
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
  img: string
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
    // console.log(e)
    if (typeof e === 'string') {
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
      // console.log('项目名称搜索结果',res)
    })
  }

  return (
    <Modal visible={props.isShow} destroyOnClose={true} centered closable={false} footer={null} width={566} className="ConfirmModal">
      <div className="confirmModalTop">
        <div className="title">确认购买</div>
        <img src={closeIcon} alt="" onClick={() => props.close()} />
      </div>
      <div className="tip">
        购买此NFT需支付1 USDT
      </div>
      <div className="ConfirmModalFooter">
        <div className="enterBtn flexCenter" onClick={submit}>确认</div>
      </div>
    </Modal>
  )
}
