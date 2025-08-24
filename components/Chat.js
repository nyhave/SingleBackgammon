import React from 'https://esm.sh/react@18.3.1';

const Chat = () => {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((msgs) => [...msgs, text]);
    setInput('');
  };

  return React.createElement(
    'div',
    { className: 'flex-1 border border-gray-400 bg-gray-200 flex flex-col' },
    React.createElement(
      'div',
      { className: 'flex-1 overflow-y-auto p-2 space-y-1' },
      messages.map((msg, i) =>
        React.createElement(
          'div',
          { key: i, className: 'p-1 bg-white rounded shadow' },
          msg
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'flex p-2 space-x-2' },
      React.createElement('input', {
        className: 'flex-1 border rounded p-1',
        value: input,
        onChange: (e) => setInput(e.target.value),
        onKeyDown: (e) => {
          if (e.key === 'Enter') sendMessage();
        },
        placeholder: 'Type message',
      }),
      React.createElement(
        'button',
        {
          className: 'px-2 py-1 bg-blue-500 text-white rounded',
          onClick: sendMessage,
        },
        'Send'
      )
    )
  );
};

export default Chat;
