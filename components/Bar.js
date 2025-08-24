import React from 'https://esm.sh/react@18.3.1';

const Bar = ({ color, count, onClick }) => {
  const checkers = [];
  for (let i = 0; i < count; i++) {
    checkers.push(
      React.createElement('div', {
        key: i,
        className: `w-3 h-3 rounded-full border border-gray-800 mr-0.5 last:mr-0 ${
          color === 'white' ? 'bg-white' : 'bg-black'
        }`,
      })
    );
  }
  return React.createElement(
    'div',
    {
      onClick,
      className:
        'w-16 h-4 flex flex-row items-center justify-center bg-gray-200',
    },
    ...checkers
  );
};

export default Bar;
