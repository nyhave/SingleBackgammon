import React from 'https://esm.sh/react@18.3.1';

const Dice = ({ values }) =>
  React.createElement(
    'div',
    { className: 'flex space-x-2' },
    values.map((value, i) =>
      React.createElement(
        'div',
        {
          key: i,
          className:
            'w-10 h-10 flex items-center justify-center border border-gray-800 rounded bg-white text-black text-2xl font-bold',
          'aria-label': `Die showing ${value}`,
        },
        value
      )
    )
  );

export default Dice;
