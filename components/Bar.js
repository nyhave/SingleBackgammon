import React from 'https://esm.sh/react@18.3.1';

const Bar = ({ color, count, onClick }) => {
  const checkers = [];
  for (let i = 0; i < count; i++) {
    checkers.push(
      React.createElement('div', {
        key: i,
        className: `w-6 h-6 rounded-full border border-gray-800 mr-1 last:mr-0 ${
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
        'w-32 h-8 flex flex-row items-center justify-center bg-gray-200',
    },
    ...checkers
  );
};

export default Bar;
