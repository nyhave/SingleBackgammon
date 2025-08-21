const App = () => (
  <div className="text-center">
    <h1 className="text-3xl font-bold mb-4">SingleBackgammon</h1>
    <button className="px-4 py-2 bg-blue-500 text-white rounded">Test Button</button>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
