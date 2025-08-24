import React from 'https://esm.sh/react@18.3.1';

const Rack = ({ color, count }) => {
  const checkers = [];
  for (let i = 0; i < count; i++) {
    checkers.push(
      React.createElement('div', {
        key: i,
        className: `w-3 h-3 rounded-full border border-gray-800 ${
          color === 'white' ? 'bg-white' : 'bg-black'
        }`,
      })
    );
  }
  return React.createElement(
    'div',
    {
      className: 'flex flex-row items-center justify-center bg-gray-200 h-4',
    },
    ...checkers
  );
};

export default Rack;
