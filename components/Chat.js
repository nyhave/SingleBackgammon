import React from 'https://esm.sh/react@18.3.1';

const initialMessages = [
  `Welcome to the chat!\nThis message spans multiple lines\nto preview the layout.`,
  `Here is a second sample message\nwith several lines\nfor testing purposes.`,
  `A third example that is a bit longer\nso you can see wrapping\nand spacing within the box.`,
  `Finally a fourth message\nthat also contains\nmultiple line breaks.`,
];

const Chat = () => {
  const [messages, setMessages] = React.useState(initialMessages);
  const [input, setInput] = React.useState('');
  const textareaRef = React.useRef(null);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((msgs) => [...msgs, text]);
    setInput('');
  };

  React.useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(ta).lineHeight) || 16;
    const maxHeight = lineHeight * 3;
    ta.style.height = Math.min(ta.scrollHeight, maxHeight) + 'px';
  }, [input]);

  return React.createElement(
    'div',
    {
      className:
        'flex-1 min-h-0 border border-gray-400 bg-gray-200 flex flex-col overflow-hidden',
    },
    React.createElement(
      'div',
      { className: 'flex p-2 space-x-2 border-b border-gray-400' },
      React.createElement('textarea', {
        ref: textareaRef,
        className:
          'flex-1 border rounded p-1 resize-none overflow-y-auto',
        value: input,
        onChange: (e) => setInput(e.target.value),
        onKeyDown: (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        },
        placeholder: 'Ny besked',
        rows: 1,
        style: { maxHeight: '4.5rem' },
      }),
      React.createElement(
        'button',
        {
          className: 'px-2 py-1 bg-blue-500 text-white rounded',
          onClick: sendMessage,
        },
        'Send'
      )
    ),
    React.createElement(
      'div',
      { className: 'flex-1 overflow-y-auto p-2 space-y-1' },
      messages.map((msg, i) =>
        React.createElement(
          'div',
          {
            key: i,
            className:
              'p-1 bg-white rounded shadow whitespace-pre-wrap break-all',
          },
          msg
        )
      )
    )
  );
};

export default Chat;
