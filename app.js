const App = () =>
  React.createElement(
    'div',
    { className: 'text-center' },
    React.createElement(
      'h1',
      { className: 'text-3xl font-bold mb-4' },
      'SingleBackgammon'
    ),
    React.createElement(
      'button',
      { className: 'px-4 py-2 bg-blue-500 text-white rounded' },
      'Test Button'
    )
  );

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
