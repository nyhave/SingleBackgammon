export default function Dice({ values = [] }) {
  return (
    <div className="dice">
      {values.map((value, index) => (
        <div key={index} className={`die face-${value}`}>
          {value}
        </div>
      ))}
    </div>
  );
}
