import { useCallback, useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../constants/itemTypes';
import { Box } from './Box';
import Markline from './Markline'

const styles = {
  width: 1080,
  height: 700,
  position: 'relative',
  backgroundColor: '#f6f6f6',
  boxShadow: 'rgb(204 204 204) 0px 0px 5px 1px inset'
};

const Container = () => {
  const attach= useRef({})
  const [currTarget, setCurrTarget] = useState({})
  const [boxes, setBoxes] = useState({
    a: { top: 20, left: 400, width: 300, height: 180, title: '组件1' },
    b: { top: 180, left: 20, width: 200, height: 120, title: '组件2' },
    c: { top: 400, left: 600, width: 380, height: 240, title: '组件3' },
  });

  // 拖拽完成后设置组件最新位置
  const moveBox = useCallback((id, left, top) => {
    const data = {...boxes[id], left, top}
    setBoxes({...boxes, [id]: data})
    setCurrTarget({...currTarget, left, top})
  }, [boxes, setBoxes, currTarget]);

  // 移动过程中发生吸附事件，记录吸附位置，等待拖拽完成后设置吸附点
  const handleAttach = (id, val) => {
    attach.current[id] = val
  }

  // 创建接收drag的组件
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      let left = attach.current[item.id]?.left || Math.round(item.left + delta.x);
      let top = attach.current[item.id]?.top || Math.round(item.top + delta.y);

      moveBox(item.id, left, top);
      return undefined;
    },
    hover: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);

      setCurrTarget({...item, left, top})
    },
    collect: (monitor) => {
      return {}
    }
  }), [moveBox]);

  return (
    <div ref={drop} style={styles}>
      {/* 所有可拖拽组件 */}
	  	{Object.keys(boxes).map((key) => {
        const { left, top, title, width, height } = boxes[key];
        return (
          <Box key={key} id={key} left={left} top={top} width={width} height={height}>
	  				{title}
	  			</Box>
        );
      })}
      {/* 辅助线组件 */}
      <Markline currTarget={currTarget} targets={boxes} onAttach={handleAttach} />
	  </div>
  );
};

export default Container
