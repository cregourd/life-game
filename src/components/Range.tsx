import { useState } from "react";

type SliderProps = {
  min: number,
  max: number,
  value: [number, number],
  onChange: (value: [number, number]) => void
}
//& React.InputHTMLAttributes<HTMLInputElement>

const Slider = ({ min, max, value, onChange }: SliderProps) => {

  const [minValue, setMinValue] = useState(value[0])
  const [maxValue, setMaxValue] = useState(value[1])


  return (
    <div className="flex items-center justify-between">
      <input
        type="range"
        min={min}
        max={max}
        value={minValue}
        onChange={(event) => {
          const newValue = Math.min(parseInt(event.target.value), maxValue);
          setMinValue(newValue);
          onChange([newValue, maxValue]);
        }}
        className="w-1/2"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxValue}
        onChange={(event) => {
          const newValue = Math.max(parseInt(event.target.value), minValue);
          setMaxValue(newValue);
          onChange([minValue, newValue]);
        }}
        className="w-1/2"
      />
    </div>
  );
};


export default Slider;