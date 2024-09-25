import React from 'react';

export const AnimatedRow = ({ ...props }) => {
  return (
    <tr className="slide-in" {...props}>
      {props.children}
    </tr>
  );
};
