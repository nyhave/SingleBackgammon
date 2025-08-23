import React from 'https://esm.sh/react@18.3.1';

const Point = ({ point, index, selected, highlighted, onClick }) => {
  const isTop = index < 12;
  const colorClass = index % 2 === 0
    ? isTop
      ? 'border-b-yellow-600'
      : 'border-t-yellow-600'
    : isTop
      ? 'border-b-orange-700'
      : 'border-t-orange-700';
  const number = index < 12 ? index + 13 : 24 - index;

  const checkers = [];
  for (let i = 0; i < point.count; i++) {
    checkers.push(
      React.createElement('div', {
        key: i,
        className: `w-6 h-6 rounded-full border border-gray-800 mb-1 ${
          point.color === 'white' ? 'bg-white' : 'bg-black'
        }`,
      })
    );
  }

  return React.createElement(
    'div',
    {
      'data-point': index,
      onClick,
      className: `relative w-8 h-32 flex justify-center items-center cursor-pointer ${
        selected ? 'bg-green-200' : ''
      } ${highlighted ? 'bg-blue-200' : ''}`,
    },
    React.createElement('div', {
      className: `absolute w-0 h-0 border-l-[16px] border-r-[16px] ${
        isTop ? 'border-b-[128px]' : 'border-t-[128px]'
      } border-l-transparent border-r-transparent ${colorClass} ${
        isTop ? 'top-0' : 'bottom-0'
      } left-1/2 -translate-x-1/2 pointer-events-none`,
    }),
    React.createElement(
      'div',
      {
        className: `absolute w-full h-full flex flex-col ${
          isTop ? 'justify-end' : 'justify-start'
        } items-center ${isTop ? 'bottom-0' : 'top-0'} pointer-events-none`,
      },
      ...checkers
    ),
    React.createElement(
      'span',
      {
        className: `absolute text-xs text-gray-600 ${
          isTop ? 'top-1' : 'bottom-1'
        } left-1 pointer-events-none`,
      },
      number
    )
  );
};

export default Point;
