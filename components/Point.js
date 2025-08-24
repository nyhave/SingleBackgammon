import React from 'https://esm.sh/react@18.3.1';

const Point = ({
  point,
  index,
  selected,
  highlighted,
  movedFrom,
  movedTo,
  onClick,
}) => {
  const isTop = index < 12;
  const colorClass = index % 2 === 0
    ? isTop
      ? 'border-b-yellow-600'
      : 'border-t-yellow-600'
    : isTop
      ? 'border-b-orange-700'
      : 'border-t-orange-700';
  const number = 24 - index;
  const isBlackHome = index <= 5;
  const quadrantBorder = index === 6 || index === 17 ? 'border-r-4 border-gray-800' : '';

  const checkers = [];
  for (let i = 0; i < point.count; i++) {
    checkers.push(
      React.createElement('div', {
        key: i,
        className: `w-6 h-6 rounded-full border mb-1 ${
          point.color === 'white'
            ? 'bg-white border-gray-800'
            : 'bg-black border-white'
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
        quadrantBorder
      } ${selected ? 'bg-green-200' : ''} ${
        highlighted ? 'bg-blue-200' : ''
      } ${movedFrom ? 'bg-red-200' : ''} ${movedTo ? 'bg-yellow-200' : ''}`,
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
        className: `absolute text-xs ${
          isBlackHome ? 'text-white' : 'text-gray-600'
        } ${isTop ? 'top-1' : 'bottom-1'} left-1 pointer-events-none`,
      },
      number
    )
  );
};

export default Point;
