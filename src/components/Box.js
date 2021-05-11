import { useDrag } from 'react-dnd';
import { ItemTypes } from '../constants/itemTypes';

const style = {
  position: 'absolute',
  backgroundColor: '#2ab1e8',
  cursor: 'move',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const Box = ({ id, left, top, children, width, height }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { id, left, top, width, height },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id, left, top]);

  if (isDragging) {
    return <div ref={drag}/>;
  }
  
  return (
    <div ref={drag} style={{ ...style, left, top, width, height }}>
	  	{children}
	  </div>
  );
};
