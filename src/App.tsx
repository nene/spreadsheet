import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { moveFocus } from './app/focus';
import { Sheet } from './sheet/Sheet';

const width = 10;
const height = 20;

export function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    body.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp': dispatch(moveFocus({x: 0, y: -1})); break;
        case 'ArrowDown': dispatch(moveFocus({x: 0, y: +1})); break;
        case 'ArrowLeft': dispatch(moveFocus({x: -1, y: 0})); break;
        case 'ArrowRight': dispatch(moveFocus({x: +1, y: 0})); break;
      }
    });
  }, [dispatch]);

  return (
    <Sheet width={width} height={height} />
  );
}
