import { useState, useEffect } from 'react'
import './markline.css'

// 吸附精准度
const DIFF = 10
// 三横 & 三纵，六条辅助线
const LINES_ENUM = {
  XT: 'xt',
  XC: 'xc',
  XB: 'xb',
  YL: 'yl',
  YC: 'yc',
  YR: 'yr',
}
const LINES = [LINES_ENUM.XT, LINES_ENUM.XC, LINES_ENUM.XB, LINES_ENUM.YL, LINES_ENUM.YC, LINES_ENUM.YR]
const initialLineStatus = {
  xt: false,
  xc: false,
  xb: false,
  yl: false,
  yc: false,
  yr: false,
}

// 根据组件位置获取辅助线位置信息
const getLineStyle = (line, {left, top, width, height}) => {
  let style = {};

  switch(line) {
    case LINES_ENUM.XT:
      style = {top}
      break;
    case LINES_ENUM.XC:
      style = {top: Math.round(top + height / 2)}
      break;
    case LINES_ENUM.XB:
      style = {top: Math.round(top + height)}
      break;
    case LINES_ENUM.YL:
      style = {left}
      break;
    case LINES_ENUM.YC:
      style = {left: Math.round(left + width / 2)}
      break;
    case LINES_ENUM.YR:
      style = {left: Math.round(left + width)}
      break;
    default:
      break;
  }

  return style
}

const Markline = ({ targets, onAttach, currTarget }) => {
  const { id, left, top, width, height } = currTarget
  const [referId, setReferId] = useState('')
  const [attach, setAttach] = useState(null)
  const [lineStatus, setLineStatus] = useState(initialLineStatus)

  useEffect(() => {
    const currLineStatus = {...lineStatus}
    // 判断当前是否在吸附的有效区间
    const isNearly = (currVal, otherVal) => Math.abs(currVal - otherVal) <= DIFF
    // 当前是否有辅助线显示
    const isAnyLineShow = () => {
      let res = false
      Object.keys(currLineStatus).forEach(line => {
        if (currLineStatus[line]) return res = true
      })
      return res
    }
    // 更新辅助线显示 & 吸附状态
    const changeLineStatus = (id, line, isNearly, attachData) => {
      if (isNearly) {
        currLineStatus[line] = true
        setReferId(id)
        setAttach({...attach, ...attachData})
      } else {
        if (referId === id) {
          currLineStatus[line] = false
        }
        if (!isAnyLineShow()) {
          setAttach(null)
        }
      }
    }
    
    id && Object.keys(targets).forEach(cId => {
      const { left: cLeft, top: cTop, width: cWidth, height: cHeight } = targets[cId]
      if (id === cId) return

      LINES.forEach(line => {
        switch(line) {
          // 横-上
          case LINES_ENUM.XT:
            changeLineStatus(cId, LINES_ENUM.XT, isNearly(top, cTop), {top: cTop})
            break;
          // 横-中
          case LINES_ENUM.XC:
            changeLineStatus(cId, LINES_ENUM.XC, isNearly(Math.round(top + height / 2), Math.round(cTop + cHeight / 2)), {top: Math.round(cTop + cHeight / 2) - Math.round(height / 2)})
            break;
          // 横-下
          case LINES_ENUM.XB:
            changeLineStatus(cId, LINES_ENUM.XB, isNearly(top + height, cTop + cHeight), {top: cTop + cHeight - height})
            break;
          // 纵-左
          case LINES_ENUM.YL:
            changeLineStatus(cId, LINES_ENUM.YL, isNearly(left, cLeft), {left: cLeft})
            break;
          // 纵-中
          case LINES_ENUM.YC:
            changeLineStatus(cId, LINES_ENUM.YC, isNearly(Math.round(left + width / 2), Math.round(cLeft + cWidth / 2)), {left: Math.round(cLeft + cWidth / 2) - Math.round(width / 2)})
            break;
          // 纵-右
          case LINES_ENUM.YR:
            changeLineStatus(cId, LINES_ENUM.YR, isNearly(left + width, cLeft + cWidth), {left: cLeft + cWidth - width})
            break;
          default:
            break;
        }
      })
    })
    setLineStatus(currLineStatus)
    onAttach(id, attach)
  }, [id, left, top, width, height])

  return (
    <div className="mark-line">
      {id && LINES.map((line, index) => (
        <div
          key={line + index}
          className={`line ${line.includes('x') ? 'xline' : 'yline'} ${lineStatus[line] ? 'isVisible' : ''}`}
          style={ getLineStyle(line, {left, top, width, height}) }
        ></div>
      ))}
    </div>
  )
}

export default Markline