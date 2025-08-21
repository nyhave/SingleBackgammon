export default function Checker({ color }) {
  const colorClass =
    color === 'white' ? 'bg-white' : color === 'black' ? 'bg-black' : 'bg-transparent';

  return (
    <div
      className={`w-6 h-6 rounded-full border border-gray-700 mb-1 ${colorClass}`}
    />
  );
}
