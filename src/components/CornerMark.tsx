import React from 'react';
import './CornerMark.css';

export const CornerMark: React.FC = () => {
  return (
    <div className="corner-mark">
      <span className="corner-mark__dot" aria-hidden="true" />
      <span className="corner-mark__text">SwipeSignal</span>
    </div>
  );
};
